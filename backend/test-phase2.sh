#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:5000/api/v1"

echo -e "${YELLOW}=== AgriSmart Phase 2: Product & Market Price API Tests ===${NC}\n"

# Variables to store tokens
FARMER_TOKEN=""
BUYER_TOKEN=""
PRODUCT_ID=""

# Test 1: Register Farmer
echo -e "${BLUE}Test 1: Register Farmer${NC}"
FARMER_REG=$(curl -s -X POST ${API_URL}/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Alice Farmer",
        "email": "alice.farmer@agrismart.com",
        "password": "farmer123",
        "role": "Farmer",
        "location": "Nakuru, Kenya",
        "phone": "+254723456789"
    }')

if echo $FARMER_REG | grep -q "success"; then
    echo -e "${GREEN}✓ Farmer registration passed${NC}"
    FARMER_TOKEN=$(echo $FARMER_REG | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo -e "${RED}✗ Farmer registration failed${NC}"
fi
echo ""

# Test 2: Register Buyer
echo -e "${BLUE}Test 2: Register Buyer${NC}"
BUYER_REG=$(curl -s -X POST ${API_URL}/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Bob Buyer",
        "email": "bob.buyer@agrismart.com",
        "password": "buyer123",
        "role": "Buyer",
        "location": "Nairobi, Kenya"
    }')

if echo $BUYER_REG | grep -q "success"; then
    echo -e "${GREEN}✓ Buyer registration passed${NC}"
    BUYER_TOKEN=$(echo $BUYER_REG | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo -e "${RED}✗ Buyer registration failed${NC}"
fi
echo ""

# Test 3: Farmer Creates Product
echo -e "${BLUE}Test 3: Farmer Creates Product${NC}"
CREATE_PRODUCT=$(curl -s -X POST ${API_URL}/products \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $FARMER_TOKEN" \
    -d '{
        "name": "Fresh Tomatoes",
        "description": "Organic tomatoes freshly harvested from my farm",
        "category": "Vegetables",
        "price": 120,
        "unit": "kg",
        "quantity": 500,
        "location": "Nakuru, Kenya"
    }')

if echo $CREATE_PRODUCT | grep -q "success"; then
    echo -e "${GREEN}✓ Product creation passed${NC}"
    PRODUCT_ID=$(echo $CREATE_PRODUCT | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Product ID: $PRODUCT_ID"
else
    echo -e "${RED}✗ Product creation failed${NC}"
    echo $CREATE_PRODUCT | python3 -m json.tool
fi
echo ""

# Test 4: Buyer Tries to Create Product (Should Fail)
echo -e "${BLUE}Test 4: Buyer Tries to Create Product (Should Fail)${NC}"
BUYER_CREATE=$(curl -s -X POST ${API_URL}/products \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $BUYER_TOKEN" \
    -d '{
        "name": "Test Product",
        "description": "This should fail",
        "category": "Grains",
        "price": 100,
        "unit": "kg",
        "quantity": 100,
        "location": "Nairobi"
    }')

if echo $BUYER_CREATE | grep -q "Only farmers can create products"; then
    echo -e "${GREEN}✓ Authorization check passed (Buyer correctly blocked)${NC}"
else
    echo -e "${RED}✗ Authorization check failed${NC}"
    echo $BUYER_CREATE | python3 -m json.tool
fi
echo ""

# Test 5: Get All Products (Public)
echo -e "${BLUE}Test 5: Get All Products (Public)${NC}"
ALL_PRODUCTS=$(curl -s -X GET ${API_URL}/products)

if echo $ALL_PRODUCTS | grep -q "success"; then
    echo -e "${GREEN}✓ Get all products passed${NC}"
    PRODUCT_COUNT=$(echo $ALL_PRODUCTS | grep -o '"results":[0-9]*' | cut -d':' -f2)
    echo "Found $PRODUCT_COUNT product(s)"
else
    echo -e "${RED}✗ Get all products failed${NC}"
fi
echo ""

# Test 6: Get Product by ID (Public)
echo -e "${BLUE}Test 6: Get Product by ID${NC}"
if [ ! -z "$PRODUCT_ID" ]; then
    PRODUCT_DETAIL=$(curl -s -X GET ${API_URL}/products/$PRODUCT_ID)
    
    if echo $PRODUCT_DETAIL | grep -q "success"; then
        echo -e "${GREEN}✓ Get product by ID passed${NC}"
    else
        echo -e "${RED}✗ Get product by ID failed${NC}"
    fi
else
    echo -e "${YELLOW}⊘ Skipped (no product ID)${NC}"
fi
echo ""

# Test 7: Farmer Updates Own Product
echo -e "${BLUE}Test 7: Farmer Updates Own Product${NC}"
if [ ! -z "$PRODUCT_ID" ]; then
    UPDATE_PRODUCT=$(curl -s -X PUT ${API_URL}/products/$PRODUCT_ID \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $FARMER_TOKEN" \
        -d '{
            "price": 150,
            "quantity": 450
        }')
    
    if echo $UPDATE_PRODUCT | grep -q "success"; then
        echo -e "${GREEN}✓ Product update passed${NC}"
    else
        echo -e "${RED}✗ Product update failed${NC}"
        echo $UPDATE_PRODUCT | python3 -m json.tool
    fi
else
    echo -e "${YELLOW}⊘ Skipped (no product ID)${NC}"
fi
echo ""

# Test 8: Buyer Tries to Update Product (Should Fail)
echo -e "${BLUE}Test 8: Buyer Tries to Update Product (Should Fail)${NC}"
if [ ! -z "$PRODUCT_ID" ]; then
    BUYER_UPDATE=$(curl -s -X PUT ${API_URL}/products/$PRODUCT_ID \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $BUYER_TOKEN" \
        -d '{
            "price": 50
        }')
    
    if echo $BUYER_UPDATE | grep -q "Access denied"; then
        echo -e "${GREEN}✓ Authorization check passed (Buyer correctly blocked)${NC}"
    else
        echo -e "${RED}✗ Authorization check failed${NC}"
        echo $BUYER_UPDATE | python3 -m json.tool
    fi
else
    echo -e "${YELLOW}⊘ Skipped (no product ID)${NC}"
fi
echo ""

# Test 9: Filter Products by Category
echo -e "${BLUE}Test 9: Filter Products by Category${NC}"
FILTER_PRODUCTS=$(curl -s -X GET "${API_URL}/products?category=Vegetables")

if echo $FILTER_PRODUCTS | grep -q "success"; then
    echo -e "${GREEN}✓ Product filtering passed${NC}"
else
    echo -e "${RED}✗ Product filtering failed${NC}"
fi
echo ""

# Test 10: Create Market Price
echo -e "${BLUE}Test 10: Create Market Price${NC}"
CREATE_PRICE=$(curl -s -X POST ${API_URL}/market-prices \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $FARMER_TOKEN" \
    -d '{
        "cropName": "Tomatoes",
        "category": "Vegetables",
        "averagePrice": 130,
        "unit": "kg",
        "region": "National",
        "priceRange": {
            "min": 100,
            "max": 160
        }
    }')

if echo $CREATE_PRICE | grep -q "success"; then
    echo -e "${GREEN}✓ Market price creation passed${NC}"
else
    echo -e "${RED}✗ Market price creation failed${NC}"
    echo $CREATE_PRICE | python3 -m json.tool
fi
echo ""

# Test 11: Get All Market Prices (Public)
echo -e "${BLUE}Test 11: Get All Market Prices${NC}"
ALL_PRICES=$(curl -s -X GET ${API_URL}/market-prices)

if echo $ALL_PRICES | grep -q "success"; then
    echo -e "${GREEN}✓ Get market prices passed${NC}"
    echo $ALL_PRICES | python3 -m json.tool
else
    echo -e "${RED}✗ Get market prices failed${NC}"
fi
echo ""

# Test 12: Get Market Price by Crop Name
echo -e "${BLUE}Test 12: Get Market Price by Crop Name${NC}"
CROP_PRICE=$(curl -s -X GET ${API_URL}/market-prices/Tomatoes)

if echo $CROP_PRICE | grep -q "success"; then
    echo -e "${GREEN}✓ Get market price by crop passed${NC}"
else
    echo -e "${RED}✗ Get market price by crop failed${NC}"
fi
echo ""

# Test 13: Get Farmer's Products
echo -e "${BLUE}Test 13: Get Farmer's Own Products${NC}"
MY_PRODUCTS=$(curl -s -X GET ${API_URL}/products/farmer/my-products \
    -H "Authorization: Bearer $FARMER_TOKEN")

if echo $MY_PRODUCTS | grep -q "success"; then
    echo -e "${GREEN}✓ Get farmer's products passed${NC}"
else
    echo -e "${RED}✗ Get farmer's products failed${NC}"
fi
echo ""

# Test 14: Search Products
echo -e "${BLUE}Test 14: Search Products by Name${NC}"
SEARCH_PRODUCTS=$(curl -s -X GET "${API_URL}/products?search=tomato")

if echo $SEARCH_PRODUCTS | grep -q "success"; then
    echo -e "${GREEN}✓ Product search passed${NC}"
else
    echo -e "${RED}✗ Product search failed${NC}"
fi
echo ""

echo -e "${YELLOW}=== All Phase 2 Tests Complete ===${NC}"
echo -e "\n${GREEN}Phase 2: Marketplace Core Models & CRUD - Testing Complete!${NC}"
