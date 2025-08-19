#!/bin/bash

# URL Validation Script for CDLHelp Website
# Tests for common 404 errors and validates fixes

echo "========================================"
echo "CDLHelp URL Validation Script"
echo "========================================"
echo ""

BASE_URL="https://www.cdlhelp.com"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test a URL
test_url() {
    local url=$1
    local expected_code=$2
    local description=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Make the request and get the response code
    response=$(curl -s -o /dev/null -w "%{http_code}" -L "$url")
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓${NC} $description"
        echo "  URL: $url"
        echo "  Expected: $expected_code, Got: $response"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗${NC} $description"
        echo "  URL: $url"
        echo "  Expected: $expected_code, Got: $response"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

echo "Testing Duplicate Language Path Fixes..."
echo "----------------------------------------"

# Test duplicate locale paths (should redirect to fixed version)
for locale in ar ko pt tr zh uk ru; do
    test_url "$BASE_URL/$locale/terms-conditions/$locale/terms-conditions" "301" "Duplicate $locale path should redirect"
    test_url "$BASE_URL/$locale/privacy-policy/$locale/privacy-policy" "301" "Duplicate $locale privacy path should redirect"
done

echo "Testing Self-Referencing Path Fixes..."
echo "----------------------------------------"

# Test self-referencing paths (should redirect to fixed version)
test_url "$BASE_URL/contact/contact" "301" "Self-referencing /contact/contact should redirect"
test_url "$BASE_URL/privacy-policy/privacy-policy" "301" "Self-referencing /privacy-policy/privacy-policy should redirect"
test_url "$BASE_URL/terms-conditions/terms-conditions" "301" "Self-referencing /terms-conditions/terms-conditions should redirect"
test_url "$BASE_URL/about/about" "301" "Self-referencing /about/about should redirect"
test_url "$BASE_URL/download/download" "301" "Self-referencing /download/download should redirect"
test_url "$BASE_URL/blog/blog" "301" "Self-referencing /blog/blog should redirect"

echo "Testing Correct Locale URLs..."
echo "----------------------------------------"

# Test that correct locale URLs work
for locale in ar ko pt tr zh uk ru; do
    test_url "$BASE_URL/$locale/terms-conditions" "200" "Correct $locale/terms-conditions should work"
done

echo "Testing English (Default Locale) URLs..."
echo "----------------------------------------"

# Test English URLs (no locale prefix)
test_url "$BASE_URL/terms-conditions" "200" "English /terms-conditions should work"
test_url "$BASE_URL/privacy-policy" "200" "English /privacy-policy should work"
test_url "$BASE_URL/contact" "200" "English /contact should work"
test_url "$BASE_URL/about" "200" "English /about should work"

# Test that /en/ redirects to root
test_url "$BASE_URL/en/terms-conditions" "301" "/en/terms-conditions should redirect to /terms-conditions"

echo "Testing School Pages..."
echo "----------------------------------------"

# Test some school pages that were returning 404
test_url "$BASE_URL/schools/florida" "200" "State page /schools/florida should work"
test_url "$BASE_URL/schools/texas" "200" "State page /schools/texas should work"
test_url "$BASE_URL/schools/florida/miami" "200" "City page /schools/florida/miami should work"

echo "Testing Sitemap Access..."
echo "----------------------------------------"

# Test sitemap URLs
test_url "$BASE_URL/sitemap-index.xml" "200" "Sitemap index should be accessible"
test_url "$BASE_URL/sitemap.xml" "200" "Main sitemap should be accessible"
test_url "$BASE_URL/sitemap-en.xml" "200" "English sitemap should be accessible"
test_url "$BASE_URL/sitemap-ru.xml" "200" "Russian sitemap should be accessible"

echo "========================================"
echo "Test Results Summary"
echo "========================================"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed!${NC}"
    exit 0
else
    IMPROVEMENT_PERCENTAGE=$(echo "scale=2; ($PASSED_TESTS * 100) / $TOTAL_TESTS" | bc)
    echo -e "\nSuccess Rate: ${IMPROVEMENT_PERCENTAGE}%"
    
    # Calculate estimated fixed errors based on original 1000 errors
    ESTIMATED_FIXED=$(echo "scale=0; (1000 * $PASSED_TESTS) / $TOTAL_TESTS" | bc)
    echo -e "Estimated errors fixed: ~${ESTIMATED_FIXED} out of 1000 original errors"
    exit 1
fi