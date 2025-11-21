import axios from "axios"
import nlp from "compromise"

// Correct CommonJS import for text-readability
import readability from "text-readability"

const HF_API_KEY = process.env.HF_API_KEY || "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"

// embedding & llm names (you can change later)
const EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"
const LLM_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"

// small helpers
const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

// normalize FleschReadingEase to 0..100
// Typical Flesch scores range roughly -100 .. 121 — map that linearly to 0..100
const normalizeFleschTo01 = (raw: number) => {
  // map [-100, 120] -> [0, 1]
  const min = -100
  const max = 120
  const v = (raw - min) / (max - min)
  return clamp01(v)
}

export const bertNLPService = {
  // MAIN
  async analyzeResume(resume: string, jobDescription: string = "") {
    const [
      skillsRaw,
      experienceRaw,
      sentimentRaw,
      readabilityRaw,
      keywordsRaw,
      atsRaw
    ] = await Promise.all([
      this.extractSkills(resume),
      this.extractExperience(resume),
      this.analyzeSentiment(resume),
      this.calculateReadability(resume),
      this.extractKeywords(resume),
      this.calculateATSScore(resume, jobDescription)
    ])

    // sanitize skills: ensure objects and confidence 0..1
    const skills = (skillsRaw || []).map((s: any) => {
      if (typeof s === "string") {
        return { skill: s, confidence: 0.7, category: "Technical", context: "" }
      }
      return {
        skill: s.skill || s.name || "Unknown",
        confidence: clamp01(Number(s.confidence ?? s.score ?? 0.7)),
        category: s.category ?? "Technical",
        context: s.context ?? ""
      }
    })

    // sanitize experience
    const experience = (experienceRaw || []).map((e: any, i: number) => ({
      title: e.title ?? e.role ?? `Role ${i + 1}`,
      company: e.company ?? "Unknown",
      duration: e.duration ?? e.years ?? "N/A",
      startDate: e.startDate,
      endDate: e.endDate,
      achievements: e.achievements ?? e.bullets ?? []
    }))

    // sentiment fallback ensure numeric
    const sentiment = {
      tone: sentimentRaw?.tone ?? "professional",
      confidence: clamp01(Number(sentimentRaw?.confidence ?? 0.8)),
      positivity: clamp01(Number(sentimentRaw?.positivity ?? (sentimentRaw?.confidence ? (sentimentRaw.confidence * 0.6) : 0.5))),
      emotions: sentimentRaw?.emotions ?? {}
    }

    // readability: return both raw and normalized
    const fleschRaw = readabilityRaw?.metrics?.fleschReadingEase ?? readabilityRaw?.score ?? 60
    const flesch01 = normalizeFleschTo01(Number(fleschRaw))
    const readabilityOut = {
      // keep score in 0..100 for UI convenience
      score: Math.round(flesch01 * 100),
      metrics: {
        wordCount: readabilityRaw?.metrics?.wordCount ?? (resume.split(/\s+/).length),
        sentenceCount: readabilityRaw?.metrics?.sentenceCount ?? (resume.split(/[.!?]/).length || 1),
        fleschReadingEase: Number(fleschRaw)
      }
    }

    // keywords: ensure array of strings
    const keywords = Array.isArray(keywordsRaw) ? keywordsRaw.slice(0, 50) : keywordsRaw?.keywords ?? []

    // ATS: ensure 0..100 numeric
    const atsScore = {
      score: clamp(Number(atsRaw?.score ?? 0), 0, 100),
      match: atsRaw?.match ?? "No Job Description Provided"
    }

    // suggestions fallback (empty array)
    const suggestions = Array.isArray((sentimentRaw || {}).suggestions) ? sentimentRaw.suggestions : []

    return {
      skills,
      experience,
      sentiment,
      readability: readabilityOut,
      keywords,
      atsScore,
      suggestions
    }
  },

  // Use a simple LLM-based skill extractor (may return JSON or text)
  async extractSkills(text: string) {
    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${LLM_MODEL}`,
        { inputs: `Extract skills from the resume. Return a JSON array of {skill, confidence}:\n\n${text}` },
        { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
      )
      const txt = response.data?.[0]?.generated_text ?? response.data?.generated_text ?? ""
      // try parse JSON, else fallback to noun extraction
      try {
        const parsed = JSON.parse(txt)
        return parsed
      } catch {
        // fallback: find nouns and return as skills with random confidences
        const doc = nlp(text)
        return Array.from(new Set(doc.nouns().out("array"))).slice(0, 25).map((k: string) => ({ skill: k, confidence: 0.7 }))
      }
    } catch (e) {
      // local fallback
      const common = ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker"]
      return common.filter(s => text.toLowerCase().includes(s.toLowerCase())).map(s => ({ skill: s, confidence: 0.8 }))
    }
  },

  async extractExperience(text: string) {
    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${LLM_MODEL}`,
        { inputs: `Extract work experience from this resume in JSON format (title, company, duration, achievements as array):\n\n${text}` },
        { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
      )
      const txt = response.data?.[0]?.generated_text ?? ""
      try {
        return JSON.parse(txt)
      } catch {
        // fallback: naive lines
        const lines = text.split("\n").filter(l => l.toLowerCase().includes(" at ") || l.toLowerCase().includes("company"))
        return lines.map((l, i) => {
          const parts = l.split(" at ")
          return { title: parts[0]?.trim() ?? `Role ${i + 1}`, company: parts[1]?.trim() ?? "Unknown", duration: "N/A", achievements: [] }
        })
      }
    } catch {
      return []
    }
  },

  async analyzeSentiment(text: string) {
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
        { inputs: text },
        { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
      )
      const data = response.data?.[0]?.[0]
      return { tone: data?.label === "POSITIVE" ? "confident" : "neutral", confidence: clamp01(Number(data?.score ?? 0.8)) }
    } catch {
      // fallback word-based
      const positivity = Math.min(1, (text.match(/success|achieved|managed|developed|improved/gi) || []).length / 10)
      return { tone: positivity > 0.6 ? "confident" : "professional", confidence: clamp01(positivity || 0.75) }
    }
  },

  // calculate & normalize Flesch to UI-friendly 0..100
  async calculateReadability(text: string) {
    try {
      const raw = readability.fleschReadingEase(text) // raw number
      return { score: raw, metrics: { wordCount: text.split(/\s+/).length, sentenceCount: text.split(/[.!?]/).length || 1, fleschReadingEase: raw } }
    } catch (err) {
      // fallback heuristic
      const words = text.split(/\s+/).length
      const sentences = text.split(/[.!?]/).length || 1
      const avgSentenceLength = words / sentences
      const estimated = Math.max(-100, 100 - avgSentenceLength * 2) // heuristic
      return { score: estimated, metrics: { wordCount: words, sentenceCount: sentences, avgSentenceLength } }
    }
  },

  async extractKeywords(text: string) {
    const doc = nlp(text)
    const nouns = doc.nouns().out("array")
    return Array.from(new Set(nouns)).slice(0, 25)
  },

  // ATS via HF embedding pipeline - returns score 0..100
  async calculateATSScore(resume: string, jd: string) {
    if (!jd) return { score: 0, match: "No Job Description Provided" }
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/pipeline/feature-extraction/" + EMBEDDING_MODEL,
        { inputs: [resume, jd] },
        { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
      )
      const [resumeVec, jdVec] = response.data
      const dot = resumeVec.reduce((sum: number, val: number, i: number) => sum + val * jdVec[i], 0)
      const magA = Math.sqrt(resumeVec.reduce((sum: number, val: number) => sum + val * val, 0))
      const magB = Math.sqrt(jdVec.reduce((sum: number, val: number) => sum + val * val, 0))
      const sim = (magA === 0 || magB === 0) ? 0 : dot / (magA * magB)
      return { score: clamp(Math.round(sim * 100), 0, 100), match: sim > 0.7 ? "Strong Match" : sim > 0.5 ? "Medium Match" : "Low Match" }
    } catch (err) {
      return { score: 0, match: "Error computing embeddings" }
    }
  }
}
