#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:5000/api/v1"

echo -e "${YELLOW}=== AgriSmart API Test Suite ===${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
HEALTH=$(curl -s -X GET ${API_URL}/health)
if echo $HEALTH | grep -q "success"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo $HEALTH | python3 -m json.tool
else
    echo -e "${RED}✗ Health check failed${NC}"
fi
echo ""

# Test 2: Register Farmer
echo -e "${YELLOW}Test 2: Register Farmer${NC}"
FARMER_REG=$(curl -s -X POST ${API_URL}/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "name": "John Farmer",
        "email": "john.farmer@agrismart.com",
        "password": "farmer123",
        "role": "Farmer",
        "location": "Nairobi, Kenya",
        "phone": "+254712345678"
    }')

if echo $FARMER_REG | grep -q "success"; then
    echo -e "${GREEN}✓ Farmer registration passed${NC}"
    FARMER_TOKEN=$(echo $FARMER_REG | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "Token saved: ${FARMER_TOKEN:0:30}..."
else
    echo -e "${RED}✗ Farmer registration failed${NC}"
    echo $FARMER_REG | python3 -m json.tool
fi
echo ""

# Test 3: Register Buyer
echo -e "${YELLOW}Test 3: Register Buyer${NC}"
BUYER_REG=$(curl -s -X POST ${API_URL}/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Jane Buyer",
        "email": "jane.buyer@agrismart.com",
        "password": "buyer123",
        "role": "Buyer",
        "location": "Mombasa, Kenya"
    }')

if echo $BUYER_REG | grep -q "success"; then
    echo -e "${GREEN}✓ Buyer registration passed${NC}"
    BUYER_TOKEN=$(echo $BUYER_REG | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo -e "${RED}✗ Buyer registration failed${NC}"
    echo $BUYER_REG | python3 -m json.tool
fi
echo ""

# Test 4: Login Farmer
echo -e "${YELLOW}Test 4: Login Farmer${NC}"
FARMER_LOGIN=$(curl -s -X POST ${API_URL}/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "john.farmer@agrismart.com",
        "password": "farmer123"
    }')

if echo $FARMER_LOGIN | grep -q "success"; then
    echo -e "${GREEN}✓ Farmer login passed${NC}"
    FARMER_TOKEN=$(echo $FARMER_LOGIN | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo -e "${RED}✗ Farmer login failed${NC}"
    echo $FARMER_LOGIN | python3 -m json.tool
fi
echo ""

# Test 5: Get Profile (Protected Route)
echo -e "${YELLOW}Test 5: Get User Profile (Protected)${NC}"
PROFILE=$(curl -s -X GET ${API_URL}/auth/me \
    -H "Authorization: Bearer $FARMER_TOKEN")

if echo $PROFILE | grep -q "success"; then
    echo -e "${GREEN}✓ Protected route access passed${NC}"
    echo $PROFILE | python3 -m json.tool
else
    echo -e "${RED}✗ Protected route access failed${NC}"
    echo $PROFILE | python3 -m json.tool
fi
echo ""

# Test 6: Invalid Login
echo -e "${YELLOW}Test 6: Invalid Login (Should Fail)${NC}"
INVALID_LOGIN=$(curl -s -X POST ${API_URL}/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "john.farmer@agrismart.com",
        "password": "wrongpassword"
    }')

if echo $INVALID_LOGIN | grep -q "error"; then
    echo -e "${GREEN}✓ Invalid login correctly rejected${NC}"
else
    echo -e "${RED}✗ Invalid login test failed${NC}"
fi
echo ""

echo -e "${YELLOW}=== All Tests Complete ===${NC}"
