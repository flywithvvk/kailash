#!/usr/bin/env python3
"""
Add Prajapati and other missing departments to production database
Run: python add_prajapati.py
"""

import requests
import json

# Production API URL
API_URL = "https://api.kailash-ai.in"

# Login credentials
LOGIN_DATA = {
    "aegis_code": "<REDACTED_AEGIS_CODE>",
    "password": "<REDACTED_PASSWORD>",
    "two_factor_code": "123456"
}

# New departments to add
NEW_DEPARTMENTS = [
    {
        "id": "dept-021",
        "name": "PRAJAPATI",
        "description": "Creator & Builder - Project Management",
        "deity": "Lord Prajapati",
        "color": "#E67E22",
        "icon": "hammer",
        "workload": 6,
        "status": "active",
        "sub_agents": 3
    },
    {
        "id": "dept-022",
        "name": "SHIV",
        "description": "Transformation & Auto-Rectification",
        "deity": "Lord Shiva",
        "color": "#3498DB",
        "icon": "refresh-cw",
        "workload": 8,
        "status": "active",
        "sub_agents": 4
    },
    {
        "id": "dept-023",
        "name": "PARVATI",
        "description": "Harmony & Workload Balance",
        "deity": "Goddess Parvati",
        "color": "#E91E63",
        "icon": "balance-scale",
        "workload": 5,
        "status": "active",
        "sub_agents": 3
    },
    {
        "id": "dept-024",
        "name": "CHITRAGUPTA",
        "description": "Records & Documentation",
        "deity": "Lord Chitragupta",
        "color": "#607D8B",
        "icon": "file-text",
        "workload": 4,
        "status": "active",
        "sub_agents": 2
    },
    {
        "id": "dept-025",
        "name": "ASHWINI KUMARAS",
        "description": "Health Monitoring & Diagnostics",
        "deity": "Ashwini Kumaras",
        "color": "#00BCD4",
        "icon": "activity",
        "workload": 6,
        "status": "active",
        "sub_agents": 3
    },
    {
        "id": "dept-026",
        "name": "DHANVANTARI",
        "description": "System Health & Recovery",
        "deity": "Lord Dhanvantari",
        "color": "#4CAF50",
        "icon": "heart-pulse",
        "workload": 7,
        "status": "active",
        "sub_agents": 3
    },
    {
        "id": "dept-027",
        "name": "KALI",
        "description": "Destruction of Errors & Bugs",
        "deity": "Goddess Kali",
        "color": "#212121",
        "icon": "x-circle",
        "workload": 9,
        "status": "active",
        "sub_agents": 4
    }
]

def main():
    print("=" * 70)
    print("ADDING PRAJAPATI AND NEW DEPARTMENTS TO PRODUCTION")
    print("=" * 70)
    
    # Step 1: Login
    print("\n1. Logging in...")
    try:
        response = requests.post(f"{API_URL}/api/auth/login", json=LOGIN_DATA, timeout=10)
        if response.status_code != 200:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return
        
        token = response.json().get("access_token")
        if not token:
            print("❌ No access token received")
            return
        
        print("✅ Login successful")
        headers = {"Authorization": f"Bearer {token}"}
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    # Step 2: Check existing departments
    print("\n2. Checking existing departments...")
    try:
        response = requests.get(f"{API_URL}/api/departments", headers=headers, timeout=10)
        if response.status_code == 200:
            existing = response.json()
            existing_names = [d.get("name") for d in existing]
            print(f"✅ Found {len(existing)} existing departments")
        else:
            print(f"⚠️  Could not fetch departments: {response.status_code}")
            existing_names = []
    except Exception as e:
        print(f"⚠️  Error fetching departments: {e}")
        existing_names = []
    
    # Step 3: Add new departments
    print("\n3. Adding new departments...")
    added = 0
    skipped = 0
    
    for dept in NEW_DEPARTMENTS:
        if dept["name"] in existing_names:
            print(f"⏭️  {dept['name']}: Already exists")
            skipped += 1
            continue
        
        try:
            # Try to add via API (if endpoint exists)
            response = requests.post(
                f"{API_URL}/api/departments",
                headers=headers,
                json=dept,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ {dept['name']}: Added successfully")
                added += 1
            else:
                print(f"❌ {dept['name']}: Failed ({response.status_code})")
                print(f"   Response: {response.text[:100]}")
        
        except Exception as e:
            print(f"❌ {dept['name']}: Error - {e}")
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"✅ Added: {added}")
    print(f"⏭️  Skipped: {skipped}")
    print(f"❌ Failed: {len(NEW_DEPARTMENTS) - added - skipped}")
    
    if added > 0:
        print("\n🎉 Prajapati and new departments added successfully!")
    elif skipped == len(NEW_DEPARTMENTS):
        print("\n✅ All departments already exist in production")
    else:
        print("\n⚠️  Some departments could not be added")
        print("   You may need to add them directly via MongoDB")

if __name__ == "__main__":
    main()
