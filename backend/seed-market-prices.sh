#!/bin/bash

# Seed Market Prices
API_URL="http://localhost:5000/api/v1"

echo "Seeding Market Price Data..."

# Get a farmer token first
FARMER=$(curl -s -X POST ${API_URL}/auth/register \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Admin Farmer\",
        \"email\": \"admin.farmer$(date +%s)@agrismart.com\",
        \"password\": \"admin123\",
        \"role\": \"Farmer\",
        \"location\": \"National\"
    }")

TOKEN=$(echo $FARMER | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Seed market prices
curl -s -X POST ${API_URL}/market-prices \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "cropName": "Maize",
        "category": "Grains",
        "averagePrice": 45,
        "unit": "kg",
        "region": "National",
        "priceRange": {"min": 40, "max": 50}
    }' > /dev/null

curl -s -X POST ${API_URL}/market-prices \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "cropName": "Beans",
        "category": "Legumes",
        "averagePrice": 120,
        "unit": "kg",
        "region": "National",
        "priceRange": {"min": 100, "max": 140}
    }' > /dev/null

curl -s -X POST ${API_URL}/market-prices \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "cropName": "Cabbage",
        "category": "Vegetables",
        "averagePrice": 30,
        "unit": "piece",
        "region": "National",
        "priceRange": {"min": 25, "max": 35}
    }' > /dev/null

curl -s -X POST ${API_URL}/market-prices \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "cropName": "Milk",
        "category": "Dairy",
        "averagePrice": 50,
        "unit": "liter",
        "region": "National",
        "priceRange": {"min": 45, "max": 55}
    }' > /dev/null

echo "Market prices seeded successfully!"

# Display seeded data
echo ""
echo "=== Market Prices ==="
curl -s ${API_URL}/market-prices | python3 -m json.tool
