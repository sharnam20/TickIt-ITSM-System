import requests
import json

BASE_URL = 'http://localhost:5000/api'
EMAIL = 'verify_test@example.com'
PASSWORD = 'password123'

def test_flow():
    # 1. Login
    print(f"Testing Login for {EMAIL}...")
    login_data = {'email': EMAIL, 'password': PASSWORD}
    r = requests.post(f'{BASE_URL}/auth/login', json=login_data)
    
    if r.status_code != 200:
        print(f"Login failed: {r.status_code} - {r.text}")
        return
    
    token = r.json().get('access_token')
    headers = {'Authorization': f'Bearer {token}'}
    print("Auth successful!")

    # 2. Create Ticket
    print("\nTesting Ticket Creation...")
    ticket_data = {
        'title': 'Update Test Ticket',
        'description': 'This ticket will be updated.',
        'priority': 'LOW',
        'category': 'General'
    }
    r = requests.post(f'{BASE_URL}/tickets', json=ticket_data, headers=headers)
    if r.status_code != 201:
        print(f"Create Error: {r.text}")
        return
    
    ticket_id = r.json().get('ticket_id')
    print(f"Ticket Created: ID={ticket_id}")

    # 3. Update Ticket (Customer)
    print(f"\nTesting Ticket Update (Customer)...")
    update_data = {
        'title': 'UPDATED: Update Test Ticket',
        'description': 'This description has been successfully updated by the customer.'
    }
    r = requests.patch(f'{BASE_URL}/tickets/{ticket_id}', json=update_data, headers=headers)
    print(f"Update Status: {r.status_code}")
    if r.status_code == 200:
        print(f"Update Message: {r.json().get('message')}")
        print(f"Changes: {', '.join(r.json().get('changes', []))}")
    else:
        print(f"Update Error: {r.text}")
        return

    # 4. Verify History
    print(f"\nVerifying History for {ticket_id}...")
    r = requests.get(f'{BASE_URL}/tickets/{ticket_id}', headers=headers)
    if r.status_code == 200:
        data = r.json().get('ticket')
        print(f"Current Title: '{data['title']}'")
        print("History Entries:")
        for h in data.get('history', []):
            print(f"- {h['action']}: {h['details']}")
        
        if data['title'] == update_data['title']:
            print("\n✅ TICKET UPDATE VERIFIED SUCCESSFULLY!")
        else:
            print("\n❌ TICKET UPDATE FAILED (Title mismatch)")
    else:
        print(f"Get Error: {r.text}")

if __name__ == '__main__':
    test_flow()
