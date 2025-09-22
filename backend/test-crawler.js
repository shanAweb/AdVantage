#!/usr/bin/env node

/**
 * Simple test script for the enhanced feed crawler
 * Run with: node test-crawler.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testCrawler() {
  console.log('🧪 Testing Enhanced Feed Crawler...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test 2: Create a test feed
    console.log('\n2. Creating test feed...');
    const feedData = {
      name: 'Test Feed',
      siteUrl: 'https://example.com',
      country: 'US',
      currency: 'USD',
      selectorConfig: {
        productTitle: '.product-title',
        productPrice: '.price',
        productLink: 'a',
        productImage: 'img'
      }
    };

    const createResponse = await axios.post(`${BASE_URL}/feeds`, feedData);
    console.log('✅ Feed created:', createResponse.data);

    const feedId = createResponse.data.data.id;

    // Test 3: Test crawler with the feed
    console.log('\n3. Testing crawler...');
    const crawlResponse = await axios.post(`${BASE_URL}/feeds/${feedId}/crawl`);
    console.log('✅ Crawl initiated:', crawlResponse.data);

    // Test 4: Get feed status
    console.log('\n4. Checking feed status...');
    const statusResponse = await axios.get(`${BASE_URL}/feeds/${feedId}`);
    console.log('✅ Feed status:', statusResponse.data);

    // Test 5: Test selector validation
    console.log('\n5. Testing selector validation...');
    const validationResponse = await axios.post(`${BASE_URL}/crawler/validate-selectors`, {
      selectors: feedData.selectorConfig
    });
    console.log('✅ Selector validation:', validationResponse.data);

    // Test 6: Test performance metrics
    console.log('\n6. Testing performance metrics...');
    const metricsResponse = await axios.get(`${BASE_URL}/crawler/performance/${feedId}`);
    console.log('✅ Performance metrics:', metricsResponse.data);

    console.log('\n🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run tests
testCrawler();


