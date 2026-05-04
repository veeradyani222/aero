// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  'OPENAI_API_KEY',
  'DATAFORSEO_USERNAME',
  'DATAFORSEO_PASSWORD',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
];

console.log('🔍 Validating Environment Configuration...\n');

let allValid = true;
let missingVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = !!value && value.trim() !== '';
  console.log(`${isSet ? '✅' : '❌'} ${varName}: ${isSet ? 'SET' : 'MISSING'}`);
  if (!isSet) {
    allValid = false;
    missingVars.push(varName);
  }
});

console.log(`\n${allValid ? '✅ All required environment variables are set!' : '❌ Some environment variables are missing!'}`);

if (!allValid) {
  console.log('\n📝 Missing variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  
  console.log('\n🔧 Quick fixes:');
  console.log('1. Create a .env.local file in your project root');
  console.log('2. Add the missing environment variables');
  console.log('3. Restart your development server');
  console.log('4. See ENV_VARIABLES_SETUP.md for detailed setup instructions');
  
  console.log('\n📋 Example .env.local content:');
  console.log('# OpenAI (for ChatGPT Search)');
  console.log('OPENAI_API_KEY=sk-your_openai_api_key');
  console.log('');

  console.log('# DataForSEO (for Google AI Overview)');
  console.log('DATAFORSEO_USERNAME=your_dataforseo_username');
  console.log('DATAFORSEO_PASSWORD=your_dataforseo_password');
  console.log('');
  console.log('# Firebase Admin SDK');
  console.log('FIREBASE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com');
  console.log('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n"');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
}

// Additional validation for specific formats
if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
  console.log('\n⚠️  Warning: OPENAI_API_KEY should start with "sk-"');
}

if (process.env.FIREBASE_PRIVATE_KEY && !process.env.FIREBASE_PRIVATE_KEY.includes('BEGIN PRIVATE KEY')) {
  console.log('\n⚠️  Warning: FIREBASE_PRIVATE_KEY should include "BEGIN PRIVATE KEY"');
}

console.log('\n🌐 Next steps:');
console.log('1. Run: node validate-config.js (to re-check)');
console.log('2. Test: curl http://localhost:3001/api/debug-providers');
console.log('3. Start dev server: npm run dev');
console.log('4. Try processing a query again'); 