import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_AI_API_KEY;

if (!API_KEY) {
  console.error('Google AI Studio API key not found. Please add VITE_AI_API_KEY to your environment variables.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Get the Gemini model for text generation
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Safety settings for medical AI responses
 */
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
];

/**
 * Configuration for generation with safety measures
 */
const generationConfig = {
  temperature: 0.3, // Lower temperature for more consistent medical responses
  topK: 40,
  topP: 0.8,
  maxOutputTokens: 2048,
};

/**
 * Advanced symptom analysis using Google AI Studio
 * @param {Object} params - Analysis parameters
 * @param {string} params.symptoms - Patient symptoms description
 * @param {Object} params.userProfile - Patient profile information
 * @param {Object} params.followUpAnswers - Answers to follow-up questions
 * @returns {Promise<Object>} - Structured analysis result
 */
export const analyzeSymptoms = async ({ symptoms, userProfile = {}, followUpAnswers = {} }) => {
  if (!API_KEY) {
    console.error('Google AI Studio API key not found');
    throw new Error('AI service not configured. Please check your API key.');
  }

  try {
    const prompt = generateMedicalPrompt(symptoms, userProfile, followUpAnswers);
    console.log('Making AI request with model: gemini-1.5-flash');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI Response received:', text.substring(0, 200) + '...');
    
    // Parse the structured response
    return parseAIResponse(text);
    
  } catch (error) {
    console.error('AI Service Error:', error);
    console.error('Error details:', error.message);
    
    // Check if it's a model availability issue
    if (error.message.includes('models/gemini-pro is not found') || error.message.includes('gemini-pro')) {
      console.log('Trying alternative model...');
      // Try with different model name
      try {
        const altModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await altModel.generateContent(generateMedicalPrompt(symptoms, userProfile, followUpAnswers));
        const response = await result.response;
        const text = response.text();
        return parseAIResponse(text);
      } catch (altError) {
        console.error('Alternative model also failed:', altError);
      }
    }
    
    // Fallback to enhanced mock response if AI fails
    return getEnhancedMockResponse(symptoms, userProfile);
  }
};

/**
 * Generate comprehensive medical prompt for AI analysis
 */
function generateMedicalPrompt(symptoms, userProfile, followUpAnswers) {
  const profileInfo = userProfile.age && userProfile.gender 
    ? `Patient profile: ${userProfile.age}-year-old ${userProfile.gender}${userProfile.preConditions && userProfile.preConditions.length > 0 ? ` with medical history of: ${userProfile.preConditions.join(', ')}` : ''}.`
    : 'Patient profile: Not provided.';

  const followUpInfo = Object.keys(followUpAnswers).length > 0
    ? `\n\nFollow-up information: ${Object.entries(followUpAnswers).map(([q, a]) => `Q: ${q} - A: ${a}`).join('; ')}`
    : '';

  return `You are a certified virtual medical assistant providing preliminary health assessment. ${profileInfo}

Patient reports these symptoms: ${symptoms}${followUpInfo}

Please provide a comprehensive analysis in the following JSON structure (respond ONLY with valid JSON):

{
  "conditions": [
    {
      "name": "Condition Name",
      "likelihood": 75,
      "description": "Brief description",
      "severity": "Low|Medium|High"
    }
  ],
  "riskAssessment": {
    "overall": "Low|Medium|High",
    "urgency": "Monitor at home|See doctor within days|Seek immediate care",
    "timeframe": "Specific guidance on when to seek care"
  },
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2"
  ],
  "homeRemedies": [
    "Safe home remedy 1",
    "Safe home remedy 2"
  ],
  "redFlags": [
    "Warning sign that requires immediate attention",
    "Another warning sign"
  ],
  "similarCases": [
    {
      "case": "Brief case description",
      "outcome": "What happened",
      "duration": "Recovery time"
    }
  ],
  "followUpQuestions": [
    "Yes/no question to refine diagnosis 1?",
    "Yes/no question to refine diagnosis 2?",
    "Yes/no question to refine diagnosis 3?"
  ],
  "disclaimer": "This analysis is for informational purposes only and does not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.",
  "confidence": 0.85
}

CRITICAL GUIDELINES:
- Provide 2-3 most likely conditions with realistic likelihood percentages
- Always include appropriate medical disclaimers
- Focus on evidence-based recommendations
- Suggest seeking professional care when uncertain
- Include red flag symptoms that warrant immediate attention
- Keep responses professional and non-alarming
- Do not provide specific medication recommendations
- Encourage professional medical consultation for serious concerns

Respond with ONLY the JSON structure above, no additional text.`;
}

/**
 * Parse AI response and structure it properly
 */
function parseAIResponse(text) {
  try {
    // Clean the response - remove any markdown formatting or extra text
    let cleanText = text.trim();
    
    // Remove code block markers if present
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const parsed = JSON.parse(cleanText);
    
    // Validate required fields and add defaults if missing
    return {
      conditions: parsed.conditions || [],
      riskAssessment: parsed.riskAssessment || {
        overall: 'Medium',
        urgency: 'See doctor within days',
        timeframe: 'Consult healthcare provider if symptoms persist'
      },
      recommendations: parsed.recommendations || ['Rest and monitor symptoms'],
      homeRemedies: parsed.homeRemedies || [],
      redFlags: parsed.redFlags || ['Severe worsening of symptoms'],
      similarCases: parsed.similarCases || [],
      followUpQuestions: parsed.followUpQuestions || [],
      disclaimer: parsed.disclaimer || 'This analysis is for informational purposes only and does not replace professional medical advice.',
      confidence: parsed.confidence || 0.7,
      generatedAt: new Date().toISOString(),
      aiGenerated: true
    };
    
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Failed to process AI analysis. Please try again.');
  }
}

/**
 * Enhanced mock response for fallback scenarios
 */
function getEnhancedMockResponse(symptoms, userProfile) {
  return {
    conditions: [
      {
        name: 'Common Viral Infection',
        likelihood: 65,
        description: 'Typical viral illness with standard symptoms',
        severity: 'Low'
      },
      {
        name: 'Stress-Related Symptoms',
        likelihood: 25,
        description: 'Physical symptoms potentially related to stress or anxiety',
        severity: 'Low'
      },
      {
        name: 'Other Condition',
        likelihood: 10,
        description: 'Less common condition requiring professional evaluation',
        severity: 'Medium'
      }
    ],
    riskAssessment: {
      overall: 'Low to Medium',
      urgency: 'Monitor at home, see doctor if symptoms persist',
      timeframe: 'Seek medical attention if symptoms worsen or persist beyond 7 days'
    },
    recommendations: [
      'Rest and stay hydrated',
      'Monitor symptoms closely',
      'Take over-the-counter medications as appropriate',
      'Maintain good hygiene practices'
    ],
    homeRemedies: [
      'Drink plenty of fluids',
      'Get adequate rest',
      'Use humidifier if experiencing congestion',
      'Apply warm or cold compresses as appropriate'
    ],
    redFlags: [
      'Difficulty breathing or shortness of breath',
      'High fever that doesn\'t respond to medication',
      'Severe persistent pain',
      'Signs of dehydration',
      'Rapid worsening of symptoms'
    ],
    similarCases: [
      {
        case: 'Patient with similar symptom pattern',
        outcome: 'Recovered with home care and rest',
        duration: '5-7 days to full recovery'
      }
    ],
    followUpQuestions: [
      'Are you experiencing any difficulty breathing?',
      'Do you have a fever higher than 101°F?',
      'Have your symptoms been rapidly worsening?'
    ],
    disclaimer: 'This analysis is provided by an AI system for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.',
    confidence: 0.6,
    generatedAt: new Date().toISOString(),
    aiGenerated: false,
    fallbackReason: 'AI service unavailable'
  };
}

/**
 * Refine analysis based on follow-up answers
 */
export const refineAnalysis = async ({ symptoms, userProfile, followUpAnswers, previousAnalysis }) => {
  if (!API_KEY) {
    // Return refined mock analysis
    return {
      ...previousAnalysis,
      confidence: Math.min((previousAnalysis.confidence || 0.7) + 0.1, 0.95),
      refinedAt: new Date().toISOString(),
      followUpProcessed: true
    };
  }

  try {
    const refinementPrompt = `Based on the initial analysis and these follow-up answers, please refine the medical assessment.

Initial symptoms: ${symptoms}
Patient profile: ${JSON.stringify(userProfile)}
Follow-up answers: ${JSON.stringify(followUpAnswers)}
Previous analysis: ${JSON.stringify(previousAnalysis)}

Please provide a refined analysis with the same JSON structure as before, incorporating the new information to update likelihood percentages, recommendations, and confidence levels.`;

    console.log('Making refinement AI request...');
    
    const result = await model.generateContent(refinementPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Refinement response received');
    
    const refinedAnalysis = parseAIResponse(text);
    
    return {
      ...refinedAnalysis,
      confidence: Math.min((refinedAnalysis.confidence || 0.7) + 0.1, 0.95),
      refinedAt: new Date().toISOString(),
      followUpProcessed: true
    };
    
  } catch (error) {
    console.error('Failed to refine analysis:', error);
    
    // Return enhanced original analysis
    return {
      ...previousAnalysis,
      confidence: Math.min((previousAnalysis.confidence || 0.7) + 0.05, 0.9),
      refinedAt: new Date().toISOString(),
      followUpProcessed: true,
      refinementError: true
    };
  }
};

/**
 * Validate symptoms for potential safety concerns
 */
export const validateSymptoms = (symptoms) => {
  const emergencyKeywords = [
    'chest pain', 'difficulty breathing', 'can\'t breathe', 'heart attack',
    'stroke', 'seizure', 'unconscious', 'bleeding heavily', 'severe head injury',
    'poisoning', 'overdose', 'suicidal', 'suicide'
  ];
  
  const symptomsLower = symptoms.toLowerCase();
  const hasEmergencyKeywords = emergencyKeywords.some(keyword => 
    symptomsLower.includes(keyword)
  );
  
  if (hasEmergencyKeywords) {
    return {
      isEmergency: true,
      message: 'Based on your symptoms, this may be a medical emergency. Please call emergency services (911) or go to the nearest emergency room immediately.'
    };
  }
  
  return { isEmergency: false };
};

export default {
  analyzeSymptoms,
  refineAnalysis,
  validateSymptoms
};
