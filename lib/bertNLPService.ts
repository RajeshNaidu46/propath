import nlp from "compromise";
import Sentiment from "sentiment";

const sentimentAnalyzer = new Sentiment();

interface SkillEntity {
  skill: string;
  confidence: number;
  category: string;
  context: string;
}

interface ExperienceEntity {
  title: string;
  company: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  achievements: string[];
}

interface SentimentResult {
  tone: "professional" | "casual" | "confident" | "modest";
  confidence: number;
  positivity: number;
  emotions: { [key: string]: number };
}

interface ResumeAnalysis {
  skills: SkillEntity[];
  experience: ExperienceEntity[];
  sentiment: SentimentResult;
  entities: { [key: string]: string[] };
  keywords: string[];
  readability: {
    score: number;
    metrics: {
      wordCount: number;
      sentenceCount: number;
      avgSentenceLength: number;
      fleschReadingEase: number;
      gunningFogIndex: number;
    };
  };
}

export const bertNLPService = {
  analyzeResume: async (resumeContent: string, jobTitle?: string): Promise<ResumeAnalysis> => {
    const doc = nlp(resumeContent);

    const skills = doc
      .match("#Skill+")
      .out("array")
      .map((skill) => ({
        skill,
        confidence: 0.9,
        category: "Technical",
        context: "Extracted skill"
      }));

    const keywords = Array.from(new Set(doc
      .nouns()
      .out("array")
      .slice(0, 20)
    ));

    const wordCount = doc.wordCount();
    const sentenceCount = doc.sentences().length;
    const avgSentenceLength = wordCount / sentenceCount;

    const readabilityScore = 100 - avgSentenceLength; // basic heuristic

    const sentimentAnalysis = sentimentAnalyzer.analyze(resumeContent);

    const positivity = sentimentAnalysis.score;
    const confidence = Math.min(1, Math.abs(positivity) / 10);

    const tone = positivity > 1 ? "professional" : "casual";

    return {
      skills,
      experience: [], // optional extension
      sentiment: {
        tone,
        confidence,
        positivity,
        emotions: { joy: positivity }
      },
      entities: {
        tools: doc.match("#Technology+").out("array"),
        certifications: doc.match("#Organization+").out("array")
      },
      keywords,
      readability: {
        score: readabilityScore,
        metrics: {
          wordCount,
          sentenceCount,
          avgSentenceLength,
          fleschReadingEase: readabilityScore,
          gunningFogIndex: avgSentenceLength
        }
      }
    };
  }
};
