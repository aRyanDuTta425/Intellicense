#!/bin/bash

# Base URL
BASE_URL="https://digital-rights-tool-backend.aryandutta425.workers.dev"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Generate unique email
TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@example.com"
TEST_PASSWORD="test123456"
TEST_NAME="Test User"

echo "Starting API tests..."
echo "Using test email: $TEST_EMAIL"

# 1. Register a new user
echo -e "\n${GREEN}1. Testing user registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"$TEST_NAME\"}")

echo "Register response: $REGISTER_RESPONSE"

# Extract token from register response
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo -e "${RED}Failed to get token from registration${NC}"
  exit 1
fi

# 2. Login with the user
echo -e "\n${GREEN}2. Testing user login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

echo "Login response: $LOGIN_RESPONSE"

# Extract token from login response
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo -e "${RED}Failed to get token from login${NC}"
  exit 1
fi

# 3. Upload a file
echo -e "\n${GREEN}3. Testing file upload${NC}"
# Create a test file
echo "This is a test article content." > test.txt

UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/uploads" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.txt" \
  -F "fileType=ARTICLE")

echo "Upload response: $UPLOAD_RESPONSE"

# Extract upload ID
UPLOAD_ID=$(echo $UPLOAD_RESPONSE | jq -r '.id')
if [ -z "$UPLOAD_ID" ] || [ "$UPLOAD_ID" = "null" ]; then
  echo -e "${RED}Failed to get upload ID${NC}"
  exit 1
fi

# 4. Get the uploaded file
echo -e "\n${GREEN}4. Testing get upload${NC}"
GET_UPLOAD_RESPONSE=$(curl -s -X GET "$BASE_URL/api/uploads/$UPLOAD_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Get upload response: $GET_UPLOAD_RESPONSE"

# 5. Analyze the content
echo -e "\n${GREEN}5. Testing content analysis${NC}"
ANALYZE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/analyses/$UPLOAD_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Analyze response: $ANALYZE_RESPONSE"

# Extract analysis ID
ANALYSIS_ID=$(echo $ANALYZE_RESPONSE | jq -r '.id')
if [ -z "$ANALYSIS_ID" ] || [ "$ANALYSIS_ID" = "null" ]; then
  echo -e "${RED}Failed to get analysis ID${NC}"
  exit 1
fi

# 6. Get the analysis
echo -e "\n${GREEN}6. Testing get analysis${NC}"
GET_ANALYSIS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/analyses/$ANALYSIS_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Get analysis response: $GET_ANALYSIS_RESPONSE"

# 7. Get all analyses
echo -e "\n${GREEN}7. Testing get all analyses${NC}"
GET_ALL_ANALYSES_RESPONSE=$(curl -s -X GET "$BASE_URL/api/analyses" \
  -H "Authorization: Bearer $TOKEN")

echo "Get all analyses response: $GET_ALL_ANALYSES_RESPONSE"

# 8. Delete the analysis
echo -e "\n${GREEN}8. Testing delete analysis${NC}"
DELETE_ANALYSIS_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/analyses/$ANALYSIS_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Delete analysis response: $DELETE_ANALYSIS_RESPONSE"

# 9. Delete the upload
echo -e "\n${GREEN}9. Testing delete upload${NC}"
DELETE_UPLOAD_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/uploads/$UPLOAD_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Delete upload response: $DELETE_UPLOAD_RESPONSE"

# Clean up
rm test.txt

echo -e "\n${GREEN}All tests completed!${NC}" 