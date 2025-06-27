// Simple test to verify AI service
import { analyzeSymptoms, validateSymptoms } from './src/lib/aiService.js';

// Test emergency validation
console.log('Testing emergency validation:');
const emergencyTest = validateSymptoms('I have severe chest pain and difficulty breathing');
console.log('Emergency test result:', emergencyTest);

const normalTest = validateSymptoms('I have a mild headache and feeling tired');
console.log('Normal test result:', normalTest);

// Test AI analysis (this will use fallback if AI fails)
console.log('\nTesting AI analysis:');
analyzeSymptoms({
  symptoms: 'mild headache and fatigue for 2 days',
  userProfile: { age: 30, gender: 'female' },
  followUpAnswers: {}
}).then(result => {
  console.log('Analysis result:', {
    conditions: result.conditions?.length || 0,
    confidence: result.confidence,
    aiGenerated: result.aiGenerated,
    fallbackReason: result.fallbackReason
  });
}).catch(error => {
  console.error('Analysis error:', error.message);
});
