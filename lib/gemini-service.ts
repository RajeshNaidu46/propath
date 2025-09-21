// Gemini AI Service for ProPath Chatbot
// Client uses server API route to call Gemini securely

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    type?: 'resume_analysis' | 'career_advice' | 'skill_assessment' | 'general'
    userId?: string
    sessionId?: string
    userProfile?: UserProfile
    conversationContext?: ConversationContext
  }
}

export interface UserProfile {
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  currentRole?: string
  targetRole?: string
  industry?: string
  skills?: string[]
  goals?: string[]
  timeline?: string
  location?: string
  education?: string
}

export interface ConversationContext {
  topics?: string[]
  preferences?: string[]
  painPoints?: string[]
  interests?: string[]
  lastQuestions?: string[]
  mood?: 'motivated' | 'frustrated' | 'confident' | 'uncertain' | 'excited'
}

export interface ChatResponse {
  content: string
  suggestions?: string[]
  actions?: {
    type: 'upload_resume' | 'take_assessment' | 'view_courses' | 'analyze_skills'
    label: string
    description: string
  }[]
  confidence: number
}

export class GeminiChatService {
  private static instance: GeminiChatService
  private chatHistory: Map<string, ChatMessage[]> = new Map()
  private userProfiles: Map<string, UserProfile> = new Map()
  private conversationContexts: Map<string, ConversationContext> = new Map()

  private constructor() {}

  public static getInstance(): GeminiChatService {
    if (!GeminiChatService.instance) {
      GeminiChatService.instance = new GeminiChatService()
    }
    return GeminiChatService.instance
  }

  /**
   * Initialize a new chat session
   */
  async startChat(sessionId: string, userId?: string): Promise<string> {
    // Initialize user profile and conversation context
    if (!this.userProfiles.has(sessionId)) {
      this.userProfiles.set(sessionId, {
        experienceLevel: 'beginner',
        goals: [],
        skills: [],
        timeline: '6 months'
      })
    }

    if (!this.conversationContexts.has(sessionId)) {
      this.conversationContexts.set(sessionId, {
        topics: [],
        preferences: [],
        painPoints: [],
        interests: [],
        lastQuestions: [],
        mood: 'motivated'
      })
    }

    const welcomeMessage = `👋 Welcome to ProPath! I'm your AI career assistant. I can help you with:

🎯 Resume analysis and optimization
📚 Skill gap assessment
🚀 Career guidance and planning
💼 Job search strategies
📖 Learning path recommendations

To provide you with the most personalized guidance, I'd love to learn a bit about you:
• What's your current experience level?
• What career goals are you working towards?
• What industry interests you most?

What would you like to work on today?`

    const initialMessage: ChatMessage = {
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date(),
      metadata: {
        type: 'general',
        userId,
        sessionId,
        userProfile: this.userProfiles.get(sessionId),
        conversationContext: this.conversationContexts.get(sessionId)
      }
    }

    this.chatHistory.set(sessionId, [initialMessage])
    return welcomeMessage
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(
    message: string,
    sessionId: string,
    userId?: string
  ): Promise<ChatResponse> {
    try {
      // Update user profile and conversation context based on the message
      this.updateUserProfile(sessionId, message)
      this.updateConversationContext(sessionId, message)

      // Add user message to history
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date(),
        metadata: { 
          userId, 
          sessionId,
          userProfile: this.userProfiles.get(sessionId),
          conversationContext: this.conversationContexts.get(sessionId)
        }
      }

      const sessionHistory = this.chatHistory.get(sessionId) || []
      sessionHistory.push(userMessage)

      // Call server API for response
      const systemPrompt = this.createSystemPrompt(message, sessionHistory, sessionId)
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: systemPrompt,
          history: sessionHistory.map(m => ({ role: m.role, content: m.content }))
        })
      })
      if (!resp.ok) throw new Error('Chat API request failed')
      const data = await resp.json()
      const aiContent = data.content || "I'm sorry, I couldn't generate a response."

      // Add AI response to history
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        metadata: { 
          userId, 
          sessionId,
          userProfile: this.userProfiles.get(sessionId),
          conversationContext: this.conversationContexts.get(sessionId)
        }
      }
      sessionHistory.push(aiMessage)
      this.chatHistory.set(sessionId, sessionHistory)

      // Generate contextual suggestions and actions
      const suggestions = this.generateSuggestions(message, aiContent, sessionId)
      const actions = this.generateActions(message, aiContent, sessionId)

      return {
        content: aiContent,
        suggestions,
        actions,
        confidence: 0.95
      }

    } catch (error) {
      console.error('Gemini API Error:', error)
      return {
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        confidence: 0.1
      }
    }
  }

  /**
   * Create context-aware system prompt
   */
  private createSystemPrompt(message: string, history: ChatMessage[], sessionId: string): string {
    const recentContext = history.slice(-6).map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n')

    const userProfile = this.userProfiles.get(sessionId)
    const conversationContext = this.conversationContexts.get(sessionId)

    let profileContext = ''
    if (userProfile) {
      profileContext = `
USER PROFILE:
• Experience Level: ${userProfile.experienceLevel || 'Not specified'}
• Current Role: ${userProfile.currentRole || 'Not specified'}
• Target Role: ${userProfile.targetRole || 'Not specified'}
• Industry: ${userProfile.industry || 'Not specified'}
• Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
• Goals: ${userProfile.goals?.join(', ') || 'Not specified'}
• Timeline: ${userProfile.timeline || 'Not specified'}
• Location: ${userProfile.location || 'Not specified'}
• Education: ${userProfile.education || 'Not specified'}

CONVERSATION CONTEXT:
• Topics Discussed: ${conversationContext?.topics?.join(', ') || 'None yet'}
• User Preferences: ${conversationContext?.preferences?.join(', ') || 'None yet'}
• Pain Points: ${conversationContext?.painPoints?.join(', ') || 'None yet'}
• Interests: ${conversationContext?.interests?.join(', ') || 'None yet'}
• User Mood: ${conversationContext?.mood || 'Not detected'}
• Recent Questions: ${conversationContext?.lastQuestions?.slice(-3).join(' | ') || 'None yet'}
`
    }

    return `You are ProPath, an AI career intelligence assistant powered by Google Gemini. You help users with:

🎯 Resume analysis and ATS optimization
📚 Skill assessment and gap analysis  
🚀 Career planning and guidance
💼 Job search strategies
📖 Learning path recommendations
🔍 Industry insights and trends
💡 Interview preparation tips
📊 Salary negotiation advice

${profileContext}

Context from recent conversation:
${recentContext}

User's current message: ${message}

IMPORTANT INSTRUCTIONS FOR TAILORED RESPONSES:

1. **PERSONALIZE EVERYTHING**: Use the user's profile information to tailor your response specifically to their situation, experience level, goals, and industry.

2. **CONTEXT-AWARE**: Reference previous topics discussed, user preferences, and pain points to show you understand their journey.

3. **EXPERIENCE-LEVEL APPROPRIATE**: 
   - Beginner: Focus on fundamentals, basic concepts, and getting started
   - Intermediate: Emphasize skill building, practical projects, and next steps
   - Advanced: Discuss advanced techniques, industry trends, and leadership
   - Expert: Focus on innovation, thought leadership, and strategic thinking

4. **GOAL-ORIENTED**: Always connect your advice to their specific career goals and timeline.

5. **INDUSTRY-SPECIFIC**: Provide insights and examples relevant to their industry or target industry.

6. **LOCATION-AWARE**: Consider their location for job market insights, salary expectations, and networking opportunities.

7. **EMOTIONAL INTELLIGENCE**: Adapt your tone based on their mood - be encouraging if they're frustrated, celebratory if they're excited, etc.

8. **STRUCTURED ROADMAPS**: When career planning is requested, provide detailed, personalized roadmaps with:
   - Clear milestones and timelines based on their experience level
   - Specific skills relevant to their goals and industry
   - Recommended resources appropriate for their learning style
   - Actionable next steps they can take immediately
   - Expected outcomes aligned with their timeline

9. **FOLLOW-UP QUESTIONS**: Ask relevant follow-up questions to gather more context and provide even better guidance.

10. **CONSISTENCY**: Maintain consistency with previous advice while building upon it.

Remember: You're not just giving generic career advice - you're providing a personalized career development experience tailored specifically to this individual's unique situation, goals, and preferences. Make every response feel like it was written just for them.`
  }

  /**
   * Update user profile based on message content
   */
  private updateUserProfile(sessionId: string, message: string): void {
    const profile = this.userProfiles.get(sessionId) || {}
    const lowerMessage = message.toLowerCase()

    // Detect experience level
    if (lowerMessage.includes('beginner') || lowerMessage.includes('just starting') || lowerMessage.includes('new to')) {
      profile.experienceLevel = 'beginner'
    } else if (lowerMessage.includes('intermediate') || lowerMessage.includes('some experience') || lowerMessage.includes('learning')) {
      profile.experienceLevel = 'intermediate'
    } else if (lowerMessage.includes('advanced') || lowerMessage.includes('experienced') || lowerMessage.includes('professional')) {
      profile.experienceLevel = 'advanced'
    } else if (lowerMessage.includes('expert') || lowerMessage.includes('senior') || lowerMessage.includes('lead')) {
      profile.experienceLevel = 'expert'
    }

    // Detect current role
    if (lowerMessage.includes('i am a') || lowerMessage.includes('i work as') || lowerMessage.includes('current role')) {
      const roleMatch = message.match(/(?:i am a|i work as|current role)[:\s]+([^.]+)/i)
      if (roleMatch) {
        profile.currentRole = roleMatch[1].trim()
      }
    }

    // Detect target role
    if (lowerMessage.includes('want to become') || lowerMessage.includes('target role') || lowerMessage.includes('aspiring')) {
      const targetMatch = message.match(/(?:want to become|target role|aspiring)[:\s]+([^.]+)/i)
      if (targetMatch) {
        profile.targetRole = targetMatch[1].trim()
      }
    }

    // Detect industry
    if (lowerMessage.includes('tech') || lowerMessage.includes('technology')) {
      profile.industry = 'Technology'
    } else if (lowerMessage.includes('finance') || lowerMessage.includes('banking')) {
      profile.industry = 'Finance'
    } else if (lowerMessage.includes('healthcare') || lowerMessage.includes('medical')) {
      profile.industry = 'Healthcare'
    } else if (lowerMessage.includes('marketing') || lowerMessage.includes('advertising')) {
      profile.industry = 'Marketing'
    } else if (lowerMessage.includes('education') || lowerMessage.includes('teaching')) {
      profile.industry = 'Education'
    }

    // Detect skills
    const skillKeywords = ['python', 'javascript', 'react', 'node', 'sql', 'aws', 'machine learning', 'data analysis', 'project management', 'leadership']
    const detectedSkills = skillKeywords.filter(skill => lowerMessage.includes(skill))
    if (detectedSkills.length > 0) {
      profile.skills = [...(profile.skills || []), ...detectedSkills]
    }

    // Detect goals
    if (lowerMessage.includes('career change') || lowerMessage.includes('switch careers')) {
      profile.goals = [...(profile.goals || []), 'Career Change']
    }
    if (lowerMessage.includes('promotion') || lowerMessage.includes('advance')) {
      profile.goals = [...(profile.goals || []), 'Career Advancement']
    }
    if (lowerMessage.includes('learn') || lowerMessage.includes('skill development')) {
      profile.goals = [...(profile.goals || []), 'Skill Development']
    }

    // Detect timeline
    if (lowerMessage.includes('3 months') || lowerMessage.includes('quarter')) {
      profile.timeline = '3 months'
    } else if (lowerMessage.includes('6 months') || lowerMessage.includes('half year')) {
      profile.timeline = '6 months'
    } else if (lowerMessage.includes('1 year') || lowerMessage.includes('year')) {
      profile.timeline = '1 year'
    }

    // Detect location
    if (lowerMessage.includes('remote') || lowerMessage.includes('work from home')) {
      profile.location = 'Remote'
    } else if (lowerMessage.includes('us') || lowerMessage.includes('united states')) {
      profile.location = 'United States'
    } else if (lowerMessage.includes('europe') || lowerMessage.includes('eu')) {
      profile.location = 'Europe'
    }

    this.userProfiles.set(sessionId, profile)
  }

  /**
   * Update conversation context based on message content
   */
  private updateConversationContext(sessionId: string, message: string): void {
    const context = this.conversationContexts.get(sessionId) || {}
    const lowerMessage = message.toLowerCase()

    // Update topics
    const topics = ['resume', 'interview', 'skills', 'career change', 'salary', 'networking', 'learning', 'job search']
    const detectedTopics = topics.filter(topic => lowerMessage.includes(topic))
    if (detectedTopics.length > 0) {
      context.topics = [...(context.topics || []), ...detectedTopics]
    }

    // Update preferences
    if (lowerMessage.includes('prefer') || lowerMessage.includes('like') || lowerMessage.includes('enjoy')) {
      const preferenceMatch = message.match(/(?:prefer|like|enjoy)[:\s]+([^.]+)/i)
      if (preferenceMatch) {
        context.preferences = [...(context.preferences || []), preferenceMatch[1].trim()]
      }
    }

    // Update pain points
    if (lowerMessage.includes('struggle') || lowerMessage.includes('difficulty') || lowerMessage.includes('challenge') || lowerMessage.includes('problem')) {
      const painMatch = message.match(/(?:struggle|difficulty|challenge|problem)[:\s]+([^.]+)/i)
      if (painMatch) {
        context.painPoints = [...(context.painPoints || []), painMatch[1].trim()]
      }
    }

    // Update interests
    if (lowerMessage.includes('interested in') || lowerMessage.includes('passionate about') || lowerMessage.includes('love')) {
      const interestMatch = message.match(/(?:interested in|passionate about|love)[:\s]+([^.]+)/i)
      if (interestMatch) {
        context.interests = [...(context.interests || []), interestMatch[1].trim()]
      }
    }

    // Update mood
    if (lowerMessage.includes('frustrated') || lowerMessage.includes('stuck') || lowerMessage.includes('confused')) {
      context.mood = 'frustrated'
    } else if (lowerMessage.includes('excited') || lowerMessage.includes('motivated') || lowerMessage.includes('inspired')) {
      context.mood = 'excited'
    } else if (lowerMessage.includes('uncertain') || lowerMessage.includes('unsure') || lowerMessage.includes('doubt')) {
      context.mood = 'uncertain'
    } else if (lowerMessage.includes('confident') || lowerMessage.includes('ready') || lowerMessage.includes('prepared')) {
      context.mood = 'confident'
    }

    // Update recent questions
    context.lastQuestions = [...(context.lastQuestions || []), message].slice(-5)

    this.conversationContexts.set(sessionId, context)
  }

  /**
   * Generate contextual suggestions based on conversation
   */
  private generateSuggestions(message: string, aiResponse: string, sessionId: string): string[] {
    const suggestions: string[] = []
    const lowerMessage = message.toLowerCase()
    const lowerResponse = aiResponse.toLowerCase()

    if (lowerMessage.includes('resume') || lowerMessage.includes('cv') || lowerMessage.includes('ats')) {
      suggestions.push('📄 Upload resume for AI analysis')
      suggestions.push('🎯 Get ATS optimization tips')
      suggestions.push('📊 View resume score breakdown')
    }

    if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('assessment') || lowerMessage.includes('roadmap')) {
      suggestions.push('🧠 Take skills assessment')
      suggestions.push('🗺️ Get detailed learning roadmap')
      suggestions.push('📚 Explore learning courses')
      suggestions.push('🔍 Analyze skill gaps')
    }

    if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('path') || lowerMessage.includes('plan')) {
      suggestions.push('🗺️ Get detailed career roadmap')
      suggestions.push('🚀 Career path guidance')
      suggestions.push('📊 View market insights')
      suggestions.push('💼 Job search strategies')
    }

    if (lowerMessage.includes('interview') || lowerMessage.includes('prepare') || lowerMessage.includes('questions')) {
      suggestions.push('🎤 Practice interview questions')
      suggestions.push('💡 Get preparation tips')
      suggestions.push('📝 Mock interview sessions')
    }

    if (lowerMessage.includes('salary') || lowerMessage.includes('negotiate') || lowerMessage.includes('pay')) {
      suggestions.push('💰 Salary negotiation tips')
      suggestions.push('📊 Market rate insights')
      suggestions.push('💼 Compensation strategies')
    }

    if (lowerMessage.includes('data') || lowerMessage.includes('tech') || lowerMessage.includes('programming')) {
      suggestions.push('🐍 Python learning path')
      suggestions.push('📊 Data science roadmap')
      suggestions.push('💻 Web development track')
      suggestions.push('🤖 AI/ML learning journey')
    }

    if (lowerMessage.includes('business') || lowerMessage.includes('management') || lowerMessage.includes('marketing')) {
      suggestions.push('📈 Business analytics path')
      suggestions.push('🎯 Digital marketing roadmap')
      suggestions.push('💼 Project management track')
      suggestions.push('📊 Finance learning path')
    }

    // Default suggestions if no specific category matches
    if (suggestions.length === 0) {
      suggestions.push('🗺️ Get career roadmap')
      suggestions.push('🧠 Assess your skills')
      suggestions.push('📚 Explore learning paths')
    }

    return suggestions.slice(0, 4)
  }

  /**
   * Generate actionable next steps
   */
  private generateActions(message: string, aiResponse: string, sessionId: string): ChatResponse['actions'] {
    const actions: ChatResponse['actions'] = []
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('resume') || lowerMessage.includes('cv') || lowerMessage.includes('ats')) {
      actions.push({
        type: 'upload_resume',
        label: '📄 Upload Resume',
        description: 'Get AI-powered analysis and optimization'
      })
    }

    if (lowerMessage.includes('skill') || lowerMessage.includes('assess') || lowerMessage.includes('gap') || lowerMessage.includes('roadmap')) {
      actions.push({
        type: 'take_assessment',
        label: '🧠 Take Assessment',
        description: 'Evaluate your current skills'
      })
      actions.push({
        type: 'view_courses',
        label: '🗺️ Get Learning Roadmap',
        description: 'Detailed step-by-step learning path'
      })
    }

    if (lowerMessage.includes('learn') || lowerMessage.includes('course') || lowerMessage.includes('training') || lowerMessage.includes('path')) {
      actions.push({
        type: 'view_courses',
        label: '📚 Browse Courses',
        description: 'Find relevant learning paths'
      })
      actions.push({
        type: 'analyze_skills',
        label: '🗺️ Career Roadmap',
        description: 'Get personalized career planning'
      })
    }

    if (lowerMessage.includes('analyze') || lowerMessage.includes('career') || lowerMessage.includes('plan') || lowerMessage.includes('guidance')) {
      actions.push({
        type: 'analyze_skills',
        label: '🔍 Analyze Skills',
        description: 'Identify skill gaps and opportunities'
      })
      actions.push({
        type: 'view_courses',
        label: '🗺️ Career Roadmap',
        description: 'Get detailed career planning guide'
      })
    }

    // Always provide at least one action
    if (actions.length === 0) {
      actions.push({
        type: 'view_courses',
        label: '🗺️ Get Career Roadmap',
        description: 'Start your career planning journey'
      })
    }

    return actions.slice(0, 2)
  }

  /**
   * Get chat history for a session
   */
  getChatHistory(sessionId: string): ChatMessage[] {
    return this.chatHistory.get(sessionId) || []
  }

  /**
   * Clear chat history for a session
   */
  clearChatHistory(sessionId: string): void {
    this.chatHistory.delete(sessionId)
    this.userProfiles.delete(sessionId)
    this.conversationContexts.delete(sessionId)
  }

  /**
   * Get user profile for a session
   */
  getUserProfile(sessionId: string): UserProfile | undefined {
    return this.userProfiles.get(sessionId)
  }

  /**
   * Get conversation context for a session
   */
  getConversationContext(sessionId: string): ConversationContext | undefined {
    return this.conversationContexts.get(sessionId)
  }

  /**
   * Update user profile manually
   */
  updateUserProfileManually(sessionId: string, profile: Partial<UserProfile>): void {
    const currentProfile = this.userProfiles.get(sessionId) || {}
    this.userProfiles.set(sessionId, { ...currentProfile, ...profile })
  }

  /**
   * Analyze resume text using Gemini
   */
  async analyzeResumeText(resumeText: string, jobTitle?: string): Promise<ChatResponse> {
    try {
      const prompt = `Analyze this resume and provide insights:

Resume Text: ${resumeText.substring(0, 2000)}${resumeText.length > 2000 ? '...' : ''}
${jobTitle ? `Target Job: ${jobTitle}` : ''}

Please provide:
1. Key strengths (2-3 points)
2. Areas for improvement (2-3 points)  
3. Skills assessment
4. ATS optimization score (1-10)
5. Specific recommendations

Format as a helpful, actionable response.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const content = response.text()

      return {
        content,
        suggestions: [
          'Upload full resume for detailed analysis',
          'Get ATS optimization tips',
          'View skill gap analysis'
        ],
        actions: [
          {
            type: 'upload_resume',
            label: '📄 Full Resume Analysis',
            description: 'Get comprehensive AI analysis'
          }
        ],
        confidence: 0.9
      }

    } catch (error) {
      console.error('Resume analysis error:', error)
      return {
        content: "I'm having trouble analyzing your resume right now. Please try uploading it through the resume analysis tool for a complete assessment.",
        confidence: 0.1
      }
    }
  }

  /**
   * Generate detailed career roadmap using Gemini
   */
  async generateCareerRoadmap(careerGoal: string, currentLevel: string = 'beginner', timeline: string = '6 months'): Promise<ChatResponse> {
    try {
      const prompt = `Create a detailed, actionable career roadmap for someone who wants to become a ${careerGoal}.

Current Level: ${currentLevel}
Timeline: ${timeline}

Please provide a structured roadmap with:

1. PHASE-BY-PHASE BREAKDOWN:
   - Phase 1 (Month 1-2): [Specific skills and milestones]
   - Phase 2 (Month 3-4): [Next level skills and projects]
   - Phase 3 (Month 5-6): [Advanced skills and portfolio building]
   - Phase 4 (Month 7+): [Job search and application strategies]

2. SPECIFIC SKILLS TO LEARN:
   - Technical skills with specific technologies
   - Soft skills and certifications
   - Tools and platforms to master

3. RECOMMENDED RESOURCES:
   - Online courses and platforms
   - Books and documentation
   - Practice projects and exercises

4. MILESTONES AND CHECKPOINTS:
   - What to achieve by each phase
   - How to measure progress
   - Portfolio building activities

5. JOB SEARCH STRATEGY:
   - When to start applying
   - Types of positions to target
   - Networking and preparation tips

Format this as a clear, actionable roadmap that someone can follow step-by-step.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const content = response.text()

      return {
        content,
        suggestions: [
          '📚 Explore recommended courses',
          '🧠 Take skills assessment',
          '💼 Build portfolio projects',
          '🎯 Set specific milestones'
        ],
        actions: [
          {
            type: 'view_courses',
            label: '📚 Browse Learning Paths',
            description: 'Find courses for your roadmap'
          },
          {
            type: 'take_assessment',
            label: '🧠 Assess Current Skills',
            description: 'Know where you stand'
          }
        ],
        confidence: 0.95
      }

    } catch (error) {
      console.error('Roadmap generation error:', error)
      return {
        content: "I'm having trouble generating your career roadmap right now. Please try asking for a specific career path or skill area, and I'll provide a detailed plan.",
        confidence: 0.1
      }
    }
  }
}

// Export singleton instance
export const geminiChatService = GeminiChatService.getInstance()
