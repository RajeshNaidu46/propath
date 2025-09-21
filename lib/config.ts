// Configuration for BERT/NLP services and other API keys
export const config = {
  // Hugging Face API Key for BERT/NLP models
  // Get your free API key from: https://huggingface.co/settings/tokens
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || 'hf_demo_key',
  
  // Google Cloud NLP (optional - for enhanced analysis)
  GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_PRIVATE_KEY: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  
  // Application settings
  APP_NAME: "ProPath Career Intelligence",
  APP_VERSION: "1.0.0",
  
  // BERT Model configurations
  BERT_MODELS: {
    // Named Entity Recognition
    NER_MODEL: 'dbmdz/bert-large-cased-finetuned-conll03-english',
    
    // Sentiment Analysis
    SENTIMENT_MODEL: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
    
    // Text Classification
    CLASSIFICATION_MODEL: 'microsoft/DialoGPT-medium',
    
    // Token limits
    MAX_TOKENS: 512,
    MAX_CONTENT_LENGTH: 2000
  },
  
  // Analysis settings
  ANALYSIS: {
    MAX_SKILLS: 20,
    MAX_EXPERIENCE: 5,
    MAX_KEYWORDS: 15,
    CONFIDENCE_THRESHOLD: 0.7,
    PROCESSING_TIMEOUT: 30000 // 30 seconds
  }
}

// Validate required configuration
export function validateConfig() {
  const requiredKeys = ['HUGGINGFACE_API_KEY']
  const missingKeys = requiredKeys.filter(key => !config[key as keyof typeof config])
  
  if (missingKeys.length > 0) {
    console.warn(`Missing required configuration keys: ${missingKeys.join(', ')}`)
    console.warn('Please set these environment variables for full functionality')
    return false
  }
  
  return true
}

// Check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === 'development'

// Check if BERT/NLP services are available
export const isBERTAvailable = config.HUGGINGFACE_API_KEY !== 'hf_demo_key'

// Add debug logging
export const logBERTStatus = () => {
  console.log('🔍 BERT/NLP Service Status:')
  console.log('  - API Key Available:', isBERTAvailable ? '✅ Yes' : '❌ No')
  console.log('  - API Key:', config.HUGGINGFACE_API_KEY.substring(0, 10) + '...')
  console.log('  - Environment:', process.env.NODE_ENV)
  
  if (!isBERTAvailable) {
    console.warn('⚠️  BERT/NLP services are not available. Please set HUGGINGFACE_API_KEY in .env.local')
    console.warn('📖 See BERT_NLP_SETUP.md for setup instructions')
  }
}
