#!/usr/bin/env python3
"""Quick database seeding for testing"""
import asyncio
import sys
import os
from datetime import datetime
import uuid

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.core.mongodb import MongoD
import bcrypt

async def seed():
    await MongoD.connect_db()
    db = MongoD.get_database()
    
    # Create test user
    password_hash = bcrypt.hashpw("Vivek@#2024494".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user_data = {
        "id": str(uuid.uuid4()),
        "email": "vivek@go4garage.in",
        "aegis_code": "V0994J",
        "full_name": "Vivek Kumar",
        "hashed_password": password_hash,
        "is_admin": True,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Check if user exists
    existing = await db.users.find_one({"aegis_code": "V0994J"})
    if not existing:
        await db.users.insert_one(user_data)
        print("✓ Created user: V0994J / Vivek@#2024494")
    else:
        print("✓ User already exists")
    
    # Create sample market data for testing V2 automobile endpoints
    market_data = [
        {"service_type": "oil_change", "vehicle_type": "sedan", "price": 2500, "region": "Delhi", "created_at": datetime.utcnow()},
        {"service_type": "oil_change", "vehicle_type": "sedan", "price": 2800, "region": "Mumbai", "created_at": datetime.utcnow()},
        {"service_type": "oil_change", "vehicle_type": "suv", "price": 3500, "region": "Delhi", "created_at": datetime.utcnow()},
        {"service_type": "brake_service", "vehicle_type": "sedan", "price": 4500, "region": "Delhi", "created_at": datetime.utcnow()},
        {"service_type": "brake_service", "vehicle_type": "sedan", "price": 5000, "region": "Mumbai", "created_at": datetime.utcnow()},
    ]
    
    count = await db.market_prices.count_documents({})
    if count == 0:
        await db.market_prices.insert_many(market_data)
        print(f"✓ Created {len(market_data)} market price entries")
    else:
        print(f"✓ Market data already exists ({count} entries)")
    
    await MongoD.close_db()
    print("\n✓ Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
