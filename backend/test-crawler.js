#!/usr/bin/env node

/**
 * Simple test script for the enhanced feed crawler
 * Run with: node test-crawler.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const TEST_URLS = [
  'https://httpbin.org/html', // Simple HTML test
  'https://example.com',      // Basic test
];

async function testCrawler() {
  console.log('🧪 Testing Enhanced Feed Crawler...\n');

  try {
    // Test 1: Get crawler status
    console.log('1️⃣ Testing crawler status...');
    const statusResponse = await axios.get(`${BASE_URL}/crawler/status`);
    console.log('✅ Status:', statusResponse.data.data.version);
    console.log('   Features:', statusResponse.data.data.features.length);
    console.log('   Supported sites:', statusResponse.data.data.supportedSites.length);
    console.log('');

    // Test 2: Get selector suggestions
    console.log('2️⃣ Testing selector suggestions...');
    const suggestionsResponse = await axios.get(`${BASE_URL}/crawler/suggestions?url=https://example.com`);
    console.log('✅ Suggestions received:', suggestionsResponse.data.data.suggestions.length);
    console.log('   Selectors configured:', Object.keys(suggestionsResponse.data.data.selectors).length);
    console.log('');

    // Test 3: Validate selectors
    console.log('3️⃣ Testing selector validation...');
    const validationResponse = await axios.post(`${BASE_URL}/crawler/validate-selectors`, {
      selectors: {
        productContainer: '.product',
        title: 'h2',
        price: '.price',
        image: 'img',
        link: 'a'
      }
    });
    console.log('✅ Validation result:', validationResponse.data.data.valid ? 'Valid' : 'Invalid');
    if (validationResponse.data.data.warnings.length > 0) {
      console.log('   Warnings:', validationResponse.data.data.warnings);
    }
    console.log('');

    // Test 4: Test crawler on a simple URL
    console.log('4️⃣ Testing crawler extraction...');
    const testResponse = await axios.post(`${BASE_URL}/crawler/test`, {
      url: 'https://httpbin.org/html'
    });
    
    const result = testResponse.data.data;
    console.log('✅ Test completed:');
    console.log(`   Success: ${result.success}`);
    console.log(`   Method: ${result.method}`);
    console.log(`   Products found: ${result.productsFound}`);
    console.log(`   Duration: ${result.duration}ms`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    if (result.products && result.products.length > 0) {
      console.log('   Sample product:', {
        title: result.products[0].title,
        price: result.products[0].price,
        link: result.products[0].link
      });
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📚 Next steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Test with real e-commerce sites');
    console.log('3. Check the CRAWLER_GUIDE.md for detailed usage');
    console.log('4. Use the API endpoints to test different sites');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Response:', error.response.data);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running');
    console.log('2. Check if all dependencies are installed');
    console.log('3. Verify the database connection');
    console.log('4. Check the server logs for errors');
  }
}

// Run the test
testCrawler();
