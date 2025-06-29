#!/bin/bash

# Test script for legacy URL redirects
# Run this after starting your Next.js dev server

echo "Testing legacy URL redirects..."
echo "================================"

# Base URL - update this if you're using a different port
BASE_URL="http://localhost:3000"

# Array of legacy URLs to test
declare -a legacy_urls=(
    "/dalnoboishik"
    "/permit"
    "/kak-ispolzovat-cdl-help"
    "/faq"
    "/cdl-shkola"
    "/o-shkolax"
    "/kak-poluchit-cdl"
)

# Expected redirects
declare -A expected_redirects=(
    ["/dalnoboishik"]="/ru/kak-stat-dalnoboishikom"
    ["/permit"]="/ru/kak-poluchit-cdl-permit"
    ["/kak-ispolzovat-cdl-help"]="/ru/kak-ispolzovat-cdlhelp"
    ["/faq"]="/ru/chasto-zadavaemye-voprosy"
    ["/cdl-shkola"]="/ru/o-cdl-shkolakh"
    ["/o-shkolax"]="/ru/o-cdl-shkolakh"
    ["/kak-poluchit-cdl"]="/ru/kak-poluchit-cdl"
)

# Test each redirect
for url in "${legacy_urls[@]}"
do
    echo -n "Testing $url ... "
    
    # Follow redirects and get the final URL
    final_url=$(curl -Ls -o /dev/null -w %{url_effective} "$BASE_URL$url")
    
    # Extract path from final URL
    final_path=${final_url#$BASE_URL}
    
    # Check if redirect matches expected
    expected="${expected_redirects[$url]}"
    
    if [ "$final_path" = "$expected" ]; then
        echo "✅ OK (redirected to $final_path)"
    else
        echo "❌ FAILED (expected $expected, got $final_path)"
    fi
done

echo "================================"
echo "Test complete!"