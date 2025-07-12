/**
 * Real Service Integration Test
 * Tests the actual unified tracking services with real environment
 */

// Load environment variables
require('dotenv').config();

// Mock browser environment for Node.js
global.window = {
  location: {
    href: 'https://truckdriver.help/test',
    pathname: '/test',
    search: '?utm_source=test&utm_medium=automated_test',
  },
  navigator: {
    userAgent: 'TestAgent/1.0 (Node.js Test)',
    language: 'en-US',
  },
  screen: { width: 1920, height: 1080 },
  addEventListener: () => {},
  removeEventListener: () => {},
  performance: {
    timing: {
      navigationStart: Date.now() - 5000,
      loadEventEnd: Date.now(),
    },
  },
};

global.document = {
  referrer: 'https://google.com/search?q=cdl+test',
  title: 'CDL Help - Test Page',
  addEventListener: () => {},
  removeEventListener: () => {},
  hidden: false,
  createElement: () => ({ style: {}, appendChild: () => {} }),
  head: { appendChild: () => {} },
};

global.localStorage = {
  data: {},
  getItem: function (key) {
    return this.data[key] || null;
  },
  setItem: function (key, value) {
    this.data[key] = value;
  },
  removeItem: function (key) {
    delete this.data[key];
  },
  clear: function () {
    this.data = {};
  },
};

global.sessionStorage = {
  data: {},
  getItem: function (key) {
    return this.data[key] || null;
  },
  setItem: function (key, value) {
    this.data[key] = value;
  },
  removeItem: function (key) {
    delete this.data[key];
  },
  clear: function () {
    this.data = {};
  },
};

// Mock crypto for UUID generation
global.crypto = {
  randomUUID: () =>
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
};

// Real fetch for API calls
global.fetch = require('node-fetch');

console.log('🧪 Testing Real Unified Tracking Services');
console.log('==========================================');

async function testBackendAPI() {
  console.log('\n📡 Testing Backend API Connectivity...');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.cdlhelp.app';

  try {
    // Test unified conversion endpoint
    const testEvent = {
      event_name: 'test_deployment_verification',
      user_data: {
        unified_user_id: 'cdlh_deployment_test_' + Date.now(),
        client_ip_address: '127.0.0.1',
        client_user_agent: 'TestAgent/1.0',
        utm_source: 'deployment_test',
        utm_medium: 'automated_test',
      },
      custom_data: {
        test_type: 'deployment_verification',
        timestamp: Date.now(),
        environment: 'test',
      },
      platform: 'test',
      skip_deduplication: true,
    };

    console.log('📤 Sending test event to backend...');

    const response = await fetch(`${backendUrl}/api/v2/meta/unified-conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TestAgent/1.0',
      },
      body: JSON.stringify(testEvent),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Backend API test successful:', {
        status: response.status,
        success: result.success,
        unified_user_id: result.unified_user_id,
      });
      return true;
    } else {
      console.log(`❌ Backend API test failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log('Error details:', errorText.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('❌ Backend API connectivity error:', error.message);
    return false;
  }
}

async function testDeduplicationEndpoint() {
  console.log('\n📊 Testing Deduplication Status Endpoint...');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.cdlhelp.app';

  try {
    const response = await fetch(`${backendUrl}/api/v2/meta/deduplication-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Deduplication endpoint test successful:', {
        status: response.status,
        success: result.success,
        stats_available: result.deduplication_stats ? result.deduplication_stats.length : 0,
      });
      return true;
    } else {
      console.log(`❌ Deduplication endpoint test failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Deduplication endpoint error:', error.message);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('\n🔧 Testing Environment Configuration...');

  const requiredEnvVars = ['NEXT_PUBLIC_BACKEND_URL'];

  let allSet = true;

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    if (value) {
      console.log(`✅ ${envVar}: ${value}`);
    } else {
      console.log(`❌ ${envVar}: Not set`);
      allSet = false;
    }
  }

  return allSet;
}

async function runRealServiceTests() {
  console.log('🚀 Starting Real Service Integration Tests\n');

  const results = {
    envConfig: false,
    backendAPI: false,
    deduplication: false,
  };

  // Test 1: Environment Configuration
  console.log('📋 Test 1: Environment Configuration');
  console.log('=====================================');
  results.envConfig = await testEnvironmentVariables();

  // Test 2: Backend API Integration
  console.log('\n📋 Test 2: Backend API Integration');
  console.log('=====================================');
  results.backendAPI = await testBackendAPI();

  // Test 3: Deduplication Monitoring
  console.log('\n📋 Test 3: Deduplication Monitoring');
  console.log('=====================================');
  results.deduplication = await testDeduplicationEndpoint();

  // Summary
  console.log('\n📋 Real Service Test Summary');
  console.log('=====================================');

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log(`Results: ${passedTests}/${totalTests} tests passed`);
  console.log('');

  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  if (passedTests === totalTests) {
    console.log(
      '\n🎉 All real service tests passed! The unified tracking system is fully operational.'
    );
  } else {
    console.log('\n⚠️  Some tests failed. Please check the configuration and try again.');
  }

  return passedTests === totalTests;
}

// Run the tests
if (require.main === module) {
  runRealServiceTests().catch(console.error);
}

module.exports = { runRealServiceTests };
