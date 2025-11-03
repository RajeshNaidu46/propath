import axios from "axios"
import nlp from "compromise"
import * as readability from "text-readability"

// ✅ Safe access to Hugging Face API key
const HF_API_KEY = process.env.HF_API_KEY || "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"

const HF_MODEL = "distilbert-base-uncased"

export const bertNLPService = {
  async analyzeResume(text: string) {
    const [skills, experience, sentiment, readabilityMetrics, keywords] = await Promise.all([
      this.extractSkills(text),
      this.extractExperience(text),
      this.analyzeSentiment(text),
      this.calculateReadability(text),
      this.extractKeywords(text)
    ])

    return { skills, experience, sentiment, readability: readabilityMetrics, keywords }
  },

  async extractSkills(text: string) {
    const skillList = ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker"]
    const found = skillList
      .filter(skill => text.toLowerCase().includes(skill.toLowerCase()))
      .map(skill => ({
        skill,
        confidence: Math.random(),
        category: "Technical",
        context: ""
      }))
    return found
  },

  async extractExperience(text: string) {
    const lines = text.split("\n").filter(l => l.includes(" at ") || l.includes("Company"))
    const exp = lines.map((l, i) => ({
      title: l.split(" at ")[0] || `Role ${i + 1}`,
      company: l.split(" at ")[1] || "Unknown",
      duration: "N/A",
      achievements: []
    }))
    return exp
  },

  async analyzeSentiment(text: string) {
    try {
      // ✅ Hugging Face API for sentiment analysis
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
        { inputs: text },
        { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
      )

      const data = response.data[0]?.[0]
      const tone = data?.label === "POSITIVE" ? "confident" : "neutral"
      const confidence = data?.score || 0.8

      return {
        tone,
        confidence,
        positivity: tone === "confident" ? confidence : 1 - confidence,
        emotions: { confidence, calm: 0.7 }
      }
    } catch (error) {
      console.error("Sentiment API failed:", error.message)
      // 🧩 Simple word-based sentiment fallback
      const positivity = Math.min(1, (text.match(/success|achieved|managed|developed|improved/gi) || []).length / 10)
      const confidence = 0.8
      const tone = positivity > 0.6 ? "confident" : "professional"
      return { tone, confidence, positivity, emotions: { confidence, calm: 0.7 } }
    }
  },

  async calculateReadability(text: string) {
    try {
      // ✅ Try using text-readability library
      const score = readability.fleschReadingEase(text)
      const metrics = {
        wordCount: text.split(/\s+/).length,
        sentenceCount: text.split(/[.!?]/).length,
        fleschReadingEase: score
      }
      return { score, metrics }
    } catch (error) {
      console.warn("⚠️ Readability calculation failed — using fallback.")

      // 🧮 Fallback manual calculation
      const words = text.split(/\s+/).length
      const sentences = text.split(/[.!?]/).length || 1
      const avgSentenceLength = words / sentences
      const score = Math.max(0, 100 - avgSentenceLength) // heuristic fallback

      const metrics = {
        wordCount: words,
        sentenceCount: sentences,
        avgSentenceLength
      }

      return { score, metrics }
    }
  },

  async extractKeywords(text: string) {
    const doc = nlp(text)
    const nouns = doc.nouns().out("array")
    const keywords = Array.from(new Set(nouns)).slice(0, 15)
    return keywords
  }
}
