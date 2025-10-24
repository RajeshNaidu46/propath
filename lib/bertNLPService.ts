import nlp from "compromise";
import Sentiment from "sentiment";

const sentimentAnalyzer = new Sentiment();

interface SkillEntity {
  skill: string;
  confidence: number;
  category: string;
  context: string;
}

// ...other interfaces remain the same...

export const bertNLPService = {
  analyzeResume: async (resumeContent: string, jobDescription?: string): Promise<ResumeAnalysis> => {
    const doc = nlp(resumeContent);

    // --- Skill Extraction (Parse from skills section) ---
    // Find the skills section heuristically
    const lowerContent = resumeContent.toLowerCase();
    const lines = lowerContent.split('\n');
    let skillsStart = -1;
    let skillsEnd = lines.length;

    // Find start of skills section
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().includes('skill')) {
        skillsStart = i + 1;
        break;
      }
    }

    // Find approximate end of skills section
    if (skillsStart !== -1) {
      for (let i = skillsStart; i < lines.length; i++) {
        const line = lines[i].toLowerCase().trim();
        if (line.includes('experience') || line.includes('education') || line.includes('summary') || line.includes('project') || line === '' || line.length < 3) {
          skillsEnd = i;
          break;
        }
      }
    }

    // Extract lines from skills section (using original casing)
    const originalLines = resumeContent.split('\n');
    const skillsLines: string[] = [];
    for (let i = skillsStart; i < skillsEnd; i++) {
      const originalLine = originalLines[i]?.trim();
      if (originalLine && originalLine.length > 0) {
        skillsLines.push(originalLine);
      }
    }

    let skills: SkillEntity[] = [];

    if (skillsLines.length > 0) {
      // Join skills lines and parse into individual skills (split by common delimiters)
      const skillsText = skillsLines.join(', ');
      const skillCandidates = skillsText
        .split(/[,;|\n-]/)  // Split by comma, semicolon, pipe, dash, or newline
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && !/^\d+$/.test(s) && !s.match(/^\d+\.\s*/));  // Filter out empty, pure numbers, or numbered list prefixes

      // Deduplicate and create SkillEntity array
      const skillFrequency: { [key: string]: number } = {};
      skillCandidates.forEach((skill) => {
        const lower = skill.toLowerCase();
        skillFrequency[lower] = (skillFrequency[lower] || 0) + 1;
      });

      skills = Object.keys(skillFrequency).map((skill) => ({
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),  // Title case
        confidence: Math.min(1, skillFrequency[skill] / 3),  // Scale 0-1 based on frequency
        category: "Technical",
        context: "Extracted from skills section",
      }));
    } else {
      // Fallback to original whole-document extraction if no skills section found
      const skillCandidates = doc.match("#Skill+").out("array");
      const skillFrequency: { [key: string]: number } = {};
      skillCandidates.forEach((skill) => {
        const lower = skill.toLowerCase();
        skillFrequency[lower] = (skillFrequency[lower] || 0) + 1;
      });
      skills = Object.keys(skillFrequency).map((skill) => ({
        skill,
        confidence: Math.min(1, skillFrequency[skill] / 3),  // scale 0-1
        category: "Technical",
        context: "Extracted from resume content (fallback)",
      }));
    }

    // --- Keywords ---
    const keywords = Array.from(new Set(doc.nouns().out("array").slice(0, 20)));

    // --- Readability Metrics ---
    const wordCount = doc.wordCount();
    const sentenceCount = doc.sentences().length || 1;
    const avgSentenceLength = wordCount / sentenceCount;
    const fleschReadingEase = Math.max(0, 206.835 - 1.015 * avgSentenceLength - 84.6 * (doc.match("#Syllable").length / wordCount || 0));
    const gunningFogIndex = 0.4 * (avgSentenceLength + doc.match("#Complex").length / sentenceCount);

    // --- Sentiment Analysis ---
    const sentimentAnalysis = sentimentAnalyzer.analyze(resumeContent);
    const positivity = sentimentAnalysis.score;
    const confidence = Math.min(1, Math.abs(positivity) / 5); // scale confidence dynamically
    const tone = positivity > 0 ? "professional" : "casual";

    // --- Skills Gap Analysis (if job description provided) ---
    let skillsGap: SkillsGap | undefined;
    if (jobDescription) {
      const jobDoc = nlp(jobDescription);
      const requiredSkills = Array.from(
        new Set(
          jobDoc
            .match("#Skill+")
            .out("array")
            .concat(jobDoc.nouns().out("array").filter((noun) => noun.length > 3))
            .slice(0, 15)
        )
      );

      const lowerKeywords = keywords.map((k) => k.toLowerCase());
      const lowerSkills = skills.map((s) => s.skill.toLowerCase());

      const confidenceMap: { [skill: string]: number } = {};
      const matched: string[] = [];
      const weak: string[] = [];
      const strong: string[] = [];
      const missing: string[] = [];

      requiredSkills.forEach((reqSkill) => {
        const lowerReq = reqSkill.toLowerCase();
        const matchedIndex = lowerKeywords.findIndex(
          (kw) => kw.includes(lowerReq) || lowerReq.includes(kw)
        );
        const skillMatch = skills.find(
          (s) => s.skill.toLowerCase().includes(lowerReq) || lowerReq.includes(s.skill.toLowerCase())
        );

        if (matchedIndex !== -1 || skillMatch) {
          const conf = skillMatch ? skillMatch.confidence : 0.6; // dynamic confidence
          confidenceMap[reqSkill] = conf;
          matched.push(reqSkill);
          if (conf < 0.7) weak.push(reqSkill);
          else strong.push(reqSkill);
        } else {
          confidenceMap[reqSkill] = 0;
          missing.push(reqSkill);
        }
      });

      skillsGap = {
        requiredSkills,
        missing,
        matched,
        weak,
        strong,
        confidenceMap,
      };
    }

    return {
      skills,
      experience: [], // optional extension
      sentiment: { tone, confidence, positivity, emotions: { joy: positivity } },
      entities: {
        tools: doc.match("#Technology+").out("array"),
        certifications: doc.match("#Organization+").out("array"),
      },
      keywords,
      skillsGap,
      readability: {
        score: fleschReadingEase,
        metrics: {
          wordCount,
          sentenceCount,
          avgSentenceLength,
          fleschReadingEase,
          gunningFogIndex,
        },
      },
    };
  },
};