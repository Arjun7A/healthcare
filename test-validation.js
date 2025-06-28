// Test script for symptom validation
import { validateSymptoms } from './src/lib/aiService.js';

const testCases = [
  // Should be valid (legitimate medical concerns)
  { input: "I have a headache and feel dizzy", expected: true, description: "Basic symptoms" },
  { input: "stomach pain and nausea after eating", expected: true, description: "Digestive symptoms" },
  { input: "feeling anxious and having trouble sleeping", expected: true, description: "Mental health symptoms" },
  { input: "chest pain when breathing deeply", expected: true, description: "Respiratory symptoms" },
  { input: "my knee hurts when I walk", expected: true, description: "Joint pain" },
  { input: "rash on my arm that's itchy", expected: true, description: "Skin condition" },
  
  // Emergency cases (should be valid but flagged)
  { input: "severe chest pain", expected: true, description: "Emergency case", isEmergency: true },
  { input: "difficulty breathing", expected: true, description: "Emergency case", isEmergency: true },
  
  // Should be invalid (inappropriate content)
  { input: "fuck this shit", expected: false, description: "Profanity" },
  { input: "aaaaaaa bbbbbbb", expected: false, description: "Spam pattern" },
  { input: "javascript programming help", expected: false, description: "Non-medical topic" },
  { input: "lol wtf hahaha", expected: false, description: "Non-medical spam" },
  { input: "buy now discount offer", expected: false, description: "Commercial spam" },
  { input: "hi", expected: false, description: "Too short" },
  
  // Borderline cases (should be valid - medical but casual)
  { input: "not feeling well today", expected: true, description: "Casual but medical" },
  { input: "something wrong with my back", expected: true, description: "Casual description" },
  { input: "feeling tired all the time", expected: true, description: "Fatigue description" },
];

console.log("🧪 Testing symptom validation...\n");

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  try {
    const result = validateSymptoms(testCase.input);
    const isValidMatch = result.isValid === testCase.expected;
    const isEmergencyMatch = !testCase.isEmergency || result.isEmergency === testCase.isEmergency;
    
    if (isValidMatch && isEmergencyMatch) {
      console.log(`✅ Test ${index + 1}: ${testCase.description}`);
      console.log(`   Input: "${testCase.input}"`);
      console.log(`   Expected: ${testCase.expected}, Got: ${result.isValid}`);
      if (testCase.isEmergency) {
        console.log(`   Emergency: ${result.isEmergency}`);
      }
      passed++;
    } else {
      console.log(`❌ Test ${index + 1}: ${testCase.description}`);
      console.log(`   Input: "${testCase.input}"`);
      console.log(`   Expected: ${testCase.expected}, Got: ${result.isValid}`);
      if (testCase.isEmergency) {
        console.log(`   Expected Emergency: ${testCase.isEmergency}, Got: ${result.isEmergency}`);
      }
      if (result.message) {
        console.log(`   Message: ${result.message}`);
      }
      failed++;
    }
    console.log("");
  } catch (error) {
    console.log(`💥 Test ${index + 1} crashed: ${testCase.description}`);
    console.log(`   Error: ${error.message}`);
    failed++;
    console.log("");
  }
});

console.log(`📊 Results: ${passed} passed, ${failed} failed`);
console.log(`Success rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
