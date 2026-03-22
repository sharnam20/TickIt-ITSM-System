import requests
import json

BASE_URL = 'http://localhost:5000/api'
EMAIL = 'verify_test@example.com'
PASSWORD = 'password123'

def test_flow():
    # 1. Try Login or Register
    print(f"Testing Login for {EMAIL}...")
    login_data = {'email': EMAIL, 'password': PASSWORD}
    r = requests.post(f'{BASE_URL}/auth/login', json=login_data)
    
    if r.status_code == 401:
        print("User not found, registering...")
        reg_data = {
            'name': 'Verify Test User',
            'email': EMAIL,
            'password': PASSWORD,
            'role': 'CUSTOMER'
        }
        r_reg = requests.post(f'{BASE_URL}/auth/register', json=reg_data)
        if r_reg.status_code == 201:
            print("Registration successful! Attempting login again...")
            r = requests.post(f'{BASE_URL}/auth/login', json=login_data)
        else:
            print(f"Registration failed: {r_reg.text}")
            return
    
    if r.status_code != 200:
        print(f"Login still failed: {r.status_code} - {r.text}")
        return
    
    token = r.json().get('access_token')
    headers = {'Authorization': f'Bearer {token}'}
    print("Auth successful!")

    # 2. Create Ticket
    print("\nTesting Ticket Creation...")
    ticket_data = {
        'title': 'End-to-End System Test',
        'description': 'Verifying that the Week 3 ticket management flow is fully operational.',
        'priority': 'MEDIUM',
        'category': 'Technical'
    }
    r = requests.post(f'{BASE_URL}/tickets', json=ticket_data, headers=headers)
    print(f"Create Status: {r.status_code}")
    if r.status_code == 201:
        ticket_id = r.json().get('ticket_id')
        print(f"Ticket Created: ID={ticket_id}")
    else:
        print(f"Create Error: {r.text}")
        return

    # 3. List Tickets
    print("\nTesting Ticket Listing...")
    r = requests.get(f'{BASE_URL}/tickets', headers=headers)
    print(f"List Status: {r.status_code}")
    if r.status_code == 200:
        tickets = r.json().get('tickets', [])
        print(f"Found {len(tickets)} tickets. (Top ticket: {tickets[0]['title']})")
    else:
        print(f"List Error: {r.text}")

    # 4. Get Single Ticket
    print(f"\nTesting Get Ticket {ticket_id}...")
    r = requests.get(f'{BASE_URL}/tickets/{ticket_id}', headers=headers)
    print(f"Get Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json().get('ticket')
        print(f"Successfully fetched ticket: '{data['title']}'")
        print(f"SLA Due: {data['sla_due_at']}")
        print(f"History entries: {len(data.get('history', []))}")
        print("\n✅ WEEK 3 SYSTEM VERIFIED SUCCESSFULLY!")
    else:
        print(f"Get Error: {r.text}")

if __name__ == '__main__':
    test_flow()
