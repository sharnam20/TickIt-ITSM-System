from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Team
from utils.rbac import role_required

teams_bp = Blueprint('teams', __name__)

@teams_bp.route('/', methods=['GET'])
@jwt_required()
@role_required(['MANAGER'])
def get_teams():
    """Get all teams with their members."""
    try:
        teams = Team.objects()
        teams_list = []
        for team in teams:
            member_list = []
            valid_member_refs = []
            
            # Access raw member IDs to avoid auto-dereferencing broken refs
            raw_members = team._data.get('members', []) or []
            for member_ref in raw_members:
                try:
                    member_id = member_ref.id if hasattr(member_ref, 'id') else member_ref
                    user = User.objects(id=member_id).first()
                    if user:
                        member_list.append({
                            "id": str(user.id),
                            "name": user.name,
                            "email": user.email,
                            "role": user.role
                        })
                        valid_member_refs.append(user)
                except:
                    pass
            
            # Auto-clean broken references if any were removed
            if len(valid_member_refs) != len(raw_members):
                team.members = valid_member_refs
                team.save()

            lead_info = None
            if team._data.get('lead'):
                try:
                    lead_ref = team._data['lead']
                    lead_id = lead_ref.id if hasattr(lead_ref, 'id') else lead_ref
                    lead_user = User.objects(id=lead_id).first()
                    if lead_user:
                        lead_info = {
                            "id": str(lead_user.id),
                            "name": lead_user.name,
                            "email": lead_user.email
                        }
                    else:
                        # Clean broken lead reference
                        team.lead = None
                        team.save()
                except:
                    team.lead = None
                    team.save()

            teams_list.append({
                "id": str(team.id),
                "name": team.name,
                "description": team.description or "",
                "skills": team.skills or [],
                "lead": lead_info,
                "members": member_list,
                "member_count": len(member_list),
                "created_at": team.created_at.isoformat() if team.created_at else None
            })

        return jsonify({"teams": teams_list}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400


@teams_bp.route('/', methods=['POST'])
@jwt_required()
@role_required(['MANAGER'])
def create_team():
    """Create a new team."""
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({"error": "Team name is required"}), 400

    if Team.objects(name=data['name']).first():
        return jsonify({"error": "A team with this name already exists"}), 400

    try:
        current_user = User.objects(id=get_jwt_identity()).first()

        # Resolve member IDs to User references
        member_refs = []
        for member_id in data.get('members', []):
            user = User.objects(id=member_id).first()
            if user and user.role in ['EMPLOYEE', 'MANAGER']:
                member_refs.append(user)

        # Resolve lead
        lead_ref = None
        if data.get('lead_id'):
            lead_user = User.objects(id=data['lead_id']).first()
            if lead_user:
                lead_ref = lead_user

        team = Team(
            name=data['name'],
            description=data.get('description', ''),
            skills=data.get('skills', []),
            lead=lead_ref,
            members=member_refs,
            created_by=current_user
        )
        team.save()

        print(f"[TEAM] Created team '{team.name}' with {len(member_refs)} members")

        return jsonify({
            "message": f"Team '{team.name}' created successfully",
            "team_id": str(team.id)
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@teams_bp.route('/<team_id>', methods=['PUT'])
@jwt_required()
@role_required(['MANAGER'])
def update_team(team_id):
    """Update team details or membership."""
    data = request.get_json()
    
    try:
        team = Team.objects(id=team_id).first()
        if not team:
            return jsonify({"error": "Team not found"}), 404

        if data.get('name'):
            team.name = data['name']
        if 'description' in data:
            team.description = data['description']

        # Update members if provided
        if 'members' in data:
            member_refs = []
            for member_id in data['members']:
                user = User.objects(id=member_id).first()
                if user and user.role in ['EMPLOYEE', 'MANAGER']:
                    member_refs.append(user)
            team.members = member_refs

        # Update lead if provided
        if 'lead_id' in data:
            if data['lead_id']:
                lead_user = User.objects(id=data['lead_id']).first()
                team.lead = lead_user
            else:
                team.lead = None
        
        if 'skills' in data:
            team.skills = data['skills']

        team.save()
        return jsonify({"message": f"Team '{team.name}' updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@teams_bp.route('/<team_id>', methods=['DELETE'])
@jwt_required()
@role_required(['MANAGER'])
def delete_team(team_id):
    """Delete a team."""
    try:
        team = Team.objects(id=team_id).first()
        if not team:
            return jsonify({"error": "Team not found"}), 404
        
        team_name = team.name
        team.delete()
        return jsonify({"message": f"Team '{team_name}' deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@teams_bp.route('/<team_id>/add-member', methods=['POST'])
@jwt_required()
@role_required(['MANAGER'])
def add_member_to_team(team_id):
    """Add a member to an existing team."""
    data = request.get_json()
    user_id = data.get('user_id')
    
    try:
        team = Team.objects(id=team_id).first()
        if not team:
            return jsonify({"error": "Team not found"}), 404
        
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Check if already a member
        existing_ids = [str(m.id) for m in team.members]
        if user_id in existing_ids:
            return jsonify({"error": "User is already a member of this team"}), 400
        
        team.members.append(user)
        team.save()
        
        return jsonify({"message": f"{user.name} added to team '{team.name}'"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@teams_bp.route('/<team_id>/remove-member', methods=['POST'])
@jwt_required()
@role_required(['MANAGER'])
def remove_member_from_team(team_id):
    """Remove a member from a team."""
    data = request.get_json()
    user_id = data.get('user_id')
    
    try:
        team = Team.objects(id=team_id).first()
        if not team:
            return jsonify({"error": "Team not found"}), 404
        
        team.members = [m for m in team.members if str(m.id) != user_id]
        team.save()
        
        return jsonify({"message": "Member removed from team"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
