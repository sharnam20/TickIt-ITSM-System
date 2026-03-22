from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Article, User
from utils.rbac import role_required
from datetime import datetime
import re

solutions_bp = Blueprint('solutions', __name__)

# ──────── PUBLIC: Search & Read ────────

@solutions_bp.route('/articles', methods=['GET'])
@jwt_required()
def get_articles():
    """Get published articles. Managers see all (including drafts)."""
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        
        category = request.args.get('category')
        search = request.args.get('search', '').strip()
        
        # Managers see everything, others see only published
        if user and user.role == 'MANAGER':
            query = Article.objects()
        else:
            query = Article.objects(is_published=True)
        
        if category and category != 'All':
            query = query.filter(category=category)
        
        # Text search across title, content, tags
        if search:
            search_lower = search.lower()
            search_words = search_lower.split()
            # MongoEngine doesn't have full-text search natively,
            # so we use regex for simple matching
            query = query.filter(
                __raw__={
                    '$or': [
                        {'title': {'$regex': search, '$options': 'i'}},
                        {'content': {'$regex': search, '$options': 'i'}},
                        {'tags': {'$in': [re.compile(w, re.IGNORECASE) for w in search_words]}}
                    ]
                }
            )
        
        articles = query.order_by('-created_at')
        
        result = []
        for article in articles:
            try:
                author_name = article.author.name if article.author else 'Unknown'
            except Exception:
                author_name = 'Unknown'
            
            result.append({
                "id": str(article.id),
                "title": article.title,
                "content": article.content,
                "category": article.category,
                "tags": article.tags,
                "author": author_name,
                "is_published": article.is_published,
                "views": article.views,
                "created_at": article.created_at.isoformat(),
                "updated_at": article.updated_at.isoformat()
            })
        
        # Collect unique categories for filter UI
        all_categories = Article.objects(is_published=True).distinct('category')
        
        return jsonify({
            "articles": result,
            "categories": all_categories,
            "total": len(result)
        }), 200
        
    except Exception as e:
        print(f"[KB] Error fetching articles: {str(e)}")
        return jsonify({"error": str(e)}), 400


@solutions_bp.route('/articles/<article_id>', methods=['GET'])
@jwt_required()
def get_article(article_id):
    """Get a single article and increment view count."""
    try:
        article = Article.objects(id=article_id).first()
        if not article:
            return jsonify({"error": "Article not found"}), 404
        
        # Increment view count
        article.views += 1
        article.save()
        
        try:
            author_name = article.author.name if article.author else 'Unknown'
        except Exception:
            author_name = 'Unknown'
        
        return jsonify({
            "article": {
                "id": str(article.id),
                "title": article.title,
                "content": article.content,
                "category": article.category,
                "tags": article.tags,
                "author": author_name,
                "is_published": article.is_published,
                "views": article.views,
                "created_at": article.created_at.isoformat(),
                "updated_at": article.updated_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ──────── MANAGER: Create, Update, Delete ────────

@solutions_bp.route('/articles', methods=['POST'])
@jwt_required()
@role_required(['MANAGER'])
def create_article():
    """Create a new knowledge base article."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('title') or not data.get('content'):
            return jsonify({"error": "Title and content are required"}), 400
        
        article = Article(
            title=data['title'],
            content=data['content'],
            category=data.get('category', 'General'),
            tags=data.get('tags', []),
            author=user_id,
            is_published=data.get('is_published', False)
        )
        article.save()
        
        print(f"[KB] Article created: {article.title}")
        
        return jsonify({
            "message": "Article created successfully",
            "article_id": str(article.id)
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@solutions_bp.route('/articles/<article_id>', methods=['PATCH'])
@jwt_required()
@role_required(['MANAGER'])
def update_article(article_id):
    """Update an existing article."""
    try:
        data = request.get_json()
        article = Article.objects(id=article_id).first()
        
        if not article:
            return jsonify({"error": "Article not found"}), 404
        
        if 'title' in data:
            article.title = data['title']
        if 'content' in data:
            article.content = data['content']
        if 'category' in data:
            article.category = data['category']
        if 'tags' in data:
            article.tags = data['tags']
        if 'is_published' in data:
            article.is_published = data['is_published']
        
        article.updated_at = datetime.utcnow()
        article.save()
        
        return jsonify({"message": "Article updated successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@solutions_bp.route('/articles/<article_id>', methods=['DELETE'])
@jwt_required()
@role_required(['MANAGER'])
def delete_article(article_id):
    """Delete an article."""
    try:
        article = Article.objects(id=article_id).first()
        if not article:
            return jsonify({"error": "Article not found"}), 404
        
        article.delete()
        return jsonify({"message": "Article deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ──────── LEGACY: Keyword-based suggestion (keep for ticket creation flow) ────────

KNOWLEDGE_BASE = [
    {
        "keywords": ["password", "reset", "login", "access"],
        "title": "Password Reset Guide",
        "solution": "You can reset your SSO password at https://reset.company.com. If locked, wait 15 minutes.",
        "type": "LINK"
    },
    {
        "keywords": ["vpn", "remote", "connect", "cisco", "anyconnect"],
        "title": "VPN Connection Issues",
        "solution": "1. Restart Cisco AnyConnect. 2. Ensure you are on a stable internet. 3. Use 'gw.company.com' as gateway.",
        "type": "GUIDE"
    },
    {
        "keywords": ["wifi", "internet", "guest", "slow"],
        "title": "Wi-Fi Troubleshooting",
        "solution": "Forget the 'Corp-WiFi' network and rejoin. For Guest access, use the portal at captive.apple.com.",
        "type": "GUIDE"
    },
    {
        "keywords": ["printer", "print", "scanner", "paper"],
        "title": "Printer Setup",
        "solution": "Go to Printers & Scanners -> Add Device. Search for 'PRT-FL01' (Floor 1) or 'PRT-FL02' (Floor 2).",
        "type": "GUIDE"
    },
    {
        "keywords": ["email", "outlook", "mail", "teams", "office"],
        "title": "Microsoft 365 Support",
        "solution": "Check your license status at portal.office.com. For Outlook sync issues, try repairing the profile via Control Panel.",
        "type": "LINK"
    }
]

@solutions_bp.route('/suggest', methods=['POST'])
@jwt_required()
def suggest_solutions():
    """Legacy keyword-based suggestion during ticket creation."""
    data = request.get_json()
    query = data.get('query', '').lower()
    
    if not query or len(query) < 3:
        return jsonify({"suggestions": []}), 200
        
    suggestions = []
    
    for item in KNOWLEDGE_BASE:
        if any(kw in query for kw in item['keywords']) or any(q_word in item['title'].lower() for q_word in query.split()):
            suggestions.append({
                "title": item['title'],
                "solution": item['solution'],
                "type": item['type']
            })
            
    # Also search DB articles
    try:
        db_articles = Article.objects(is_published=True)
        for article in db_articles:
            if any(w in article.title.lower() for w in query.split()) or any(w in query for w in (article.tags or [])):
                suggestions.append({
                    "title": article.title,
                    "solution": article.content[:200] + "...",
                    "type": "ARTICLE"
                })
    except Exception:
        pass
    
    return jsonify({
        "suggestions": suggestions[:5]
    }), 200
