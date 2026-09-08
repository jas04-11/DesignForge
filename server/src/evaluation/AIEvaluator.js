const axios = require("axios");
const Evaluator = require("./Evaluator");

const CATEGORY_NAMES = [
  "Requirement Coverage",
  "Responsibility Assignment",
  "Abstraction",
  "Extensibility",
  "SOLID Principles",
];

function buildPrompt(submission, problem) {
  const classesText = (submission.classes || [])
    .map(
      (c) =>
        `- Class: ${c.name}\n  Responsibility: ${c.responsibility || "(none provided)"}\n  Fields: ${(c.fields || []).join(", ") || "(none)"}\n  Methods: ${(c.methods || []).join(", ") || "(none)"}`
    )
    .join("\n");

  const interfacesText = (submission.interfaces || [])
    .map((i) => `- Interface: ${i.name}\n  Methods: ${(i.methods || []).join(", ") || "(none)"}`)
    .join("\n");

  const relationshipsText = (submission.relationships || [])
    .map((r) => `- ${r.source} --${r.type}--> ${r.target}`)
    .join("\n");

  return `You are a strict but fair Low-Level Design (LLD) interviewer evaluating a candidate's design.

PROBLEM: ${problem.title} (Difficulty: ${problem.difficulty})
DESCRIPTION: ${problem.description}
REQUIREMENTS:
${(problem.requirements || []).map((r) => `- ${r}`).join("\n")}
EXPECTED DESIGN CONCEPTS: ${(problem.expectedConcepts || []).join(", ")}

CANDIDATE SUBMISSION:

CLASSES:
${classesText || "(none)"}

INTERFACES:
${interfacesText || "(none)"}

RELATIONSHIPS:
${relationshipsText || "(none)"}

DESIGN EXPLANATION:
${submission.explanation || "(none)"}

OPTIONAL CODE:
${submission.code || "(none provided)"}

Evaluate the SUBJECTIVE quality of this design across exactly these 5 categories, each scored out of 20:
${CATEGORY_NAMES.map((c) => `- ${c}`).join("\n")}

Consider responsibility assignment, abstraction quality, coupling/cohesion, adherence to SOLID principles, and how easily the design could be extended for new requirements.

Respond with STRICT JSON ONLY, no markdown fences, no commentary, matching EXACTLY this shape:
{
  "overallScore": number (0-100, sum of category scores),
  "categories": [
    { "name": "Requirement Coverage", "score": number, "maxScore": 20, "feedback": "string" },
    { "name": "Responsibility Assignment", "score": number, "maxScore": 20, "feedback": "string" },
    { "name": "Abstraction", "score": number, "maxScore": 20, "feedback": "string" },
    { "name": "Extensibility", "score": number, "maxScore": 20, "feedback": "string" },
    { "name": "SOLID Principles", "score": number, "maxScore": 20, "feedback": "string" }
  ],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": ["string"]
}`;
}

function extractJson(text) {
  if (!text) return null;
  const cleaned = text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (err) {
    return null;
  }
}

function isValidPayload(payload) {
  if (!payload || typeof payload !== "object") return false;
  if (typeof payload.overallScore !== "number") return false;
  if (!Array.isArray(payload.categories) || payload.categories.length !== 5) return false;
  const namesOk = payload.categories.every(
    (c) =>
      CATEGORY_NAMES.includes(c.name) &&
      typeof c.score === "number" &&
      typeof c.maxScore === "number" &&
      typeof c.feedback === "string"
  );
  if (!namesOk) return false;
  if (!Array.isArray(payload.strengths) || !Array.isArray(payload.weaknesses) || !Array.isArray(payload.suggestions)) {
    return false;
  }
  return true;
}

/**
 * AIEvaluator - uses Google Gemini to judge subjective design quality.
 *
 * IMPORTANT: this class never throws upward into the submission flow.
 * On any failure (missing API key, network error, invalid JSON, timeout)
 * it returns `{ available: false, unavailableReason }`, and the caller
 * (EvaluationService) is responsible for falling back to the deterministic
 * result. This keeps the core practice flow independent of Gemini.
 */
class AIEvaluator extends Evaluator {
  constructor({ apiKey, model, timeoutMs } = {}) {
    super();
    this.apiKey = apiKey ?? process.env.GEMINI_API_KEY;
    this.model = model ?? process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
    this.timeoutMs = timeoutMs ?? 20000;
  }

  async evaluate(submission, problem) {
    if (!this.apiKey) {
      return this._unavailable("Gemini API key is not configured.");
    }

    const prompt = buildPrompt(submission, problem);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    try {
      const response = await axios.post(
        url,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        },
        { timeout: this.timeoutMs }
      );

      const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const payload = extractJson(text);

      if (!isValidPayload(payload)) {
        return this._unavailable("Gemini returned an invalid or unparsable response.");
      }

      return {
        overallScore: Math.max(0, Math.min(100, Math.round(payload.overallScore))),
        categories: payload.categories.map((c) => ({
          name: c.name,
          score: Math.max(0, Math.min(20, Math.round(c.score))),
          maxScore: 20,
          feedback: c.feedback,
        })),
        strengths: payload.strengths,
        weaknesses: payload.weaknesses,
        suggestions: payload.suggestions,
        available: true,
      };
    } catch (err) {
      const reason = err.response?.data?.error?.message || err.message || "Unknown Gemini error";
      return this._unavailable(reason);
    }
  }

  _unavailable(reason) {
    return {
      overallScore: null,
      categories: [],
      strengths: [],
      weaknesses: [],
      suggestions: [],
      available: false,
      unavailableReason: reason,
    };
  }
}

module.exports = AIEvaluator;
