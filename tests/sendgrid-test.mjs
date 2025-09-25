#!/usr/bin/env node

// SendGrid API Test
// Tests if the SendGrid API key is working correctly

import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY environment variable not set');
  console.log('Please set: export SENDGRID_API_KEY=your_api_key');
  process.exit(1);
}

console.log('🔍 Testing SendGrid API Configuration...\n');

// Set API key
sgMail.setApiKey(SENDGRID_API_KEY);

// Test email configuration
const testEmail = {
  to: 'admin@liteckyeditingservices.com',
  from: 'hello@liteckyeditingservices.com', // Must be verified sender
  subject: 'SendGrid API Test - Litecky Editing Services',
  text: 'This is a test email to verify SendGrid API integration is working correctly.',
  html: `
    <h2>SendGrid API Test</h2>
    <p>This is a test email to verify SendGrid API integration is working correctly.</p>
    <p><strong>Service:</strong> Litecky Editing Services</p>
    <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    <hr>
    <p><em>This is an automated test email.</em></p>
  `
};

async function testSendGridAPI() {
  try {
    console.log('📧 Testing email send...');
    console.log(`   To: ${testEmail.to}`);
    console.log(`   From: ${testEmail.from}`);
    console.log(`   Subject: ${testEmail.subject}`);

    // Test the API by sending a test email
    const response = await sgMail.send(testEmail);

    console.log('\n✅ SendGrid API test successful!');
    console.log(`   Status Code: ${response[0].statusCode}`);
    console.log(`   Message ID: ${response[0].headers['x-message-id']}`);
    console.log(`   Response: ${response[0].body || 'Email sent successfully'}`);

    return true;

  } catch (error) {
    console.error('\n❌ SendGrid API test failed!');
    console.error(`   Error: ${error.message}`);

    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Body: ${JSON.stringify(error.response.body, null, 2)}`);
    }

    // Common error scenarios
    if (error.message.includes('401')) {
      console.error('\n💡 This looks like an authentication error.');
      console.error('   Check that the SendGrid API key is correct and has proper permissions.');
    } else if (error.message.includes('403')) {
      console.error('\n💡 This looks like a permissions error.');
      console.error('   Check that the API key has permission to send emails.');
    } else if (error.message.includes('sender identity')) {
      console.error('\n💡 This looks like a sender verification error.');
      console.error('   Make sure hello@liteckyeditingservices.com is a verified sender in SendGrid.');
    }

    return false;
  }
}

// Run the test
testSendGridAPI()
  .then(success => {
    if (success) {
      console.log('\n🎉 SendGrid integration is ready for production use!');
      process.exit(0);
    } else {
      console.log('\n⚠️  SendGrid integration needs configuration before use.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });