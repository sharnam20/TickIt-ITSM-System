import requests
import json

BASE_URL = "http://localhost:5000/api/auth"

# Test 1: Health / Basic Connectivity (Simulated by trying a known user)
# We'll try to login as the Manager we know exists
payload = {
    "email": "23cs089@charusat.edu.in",
    "password": "admin"  # Checking with 'admin' first, then 'admin123'
}

print(f"Testing Login for {payload['email']}...")

try:
    response = requests.post(f"{BASE_URL}/login", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Connection Error: {e}")

# Test 2: Try with 'admin123' if the first one failed (common password used in this project)
payload['password'] = "admin123"
print(f"\nRetrying with password 'admin123'...")
try:
    response = requests.post(f"{BASE_URL}/login", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Connection Error: {e}")
