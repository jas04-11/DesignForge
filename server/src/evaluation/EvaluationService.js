/**
 * EvaluationService - orchestrates one or more Evaluator instances.
 *
 * The rest of the app (controllers/services) only ever talks to this class.
 * Adding a new evaluator later (e.g. a "PlagiarismEvaluator" or a
 * "PeerReviewEvaluator") only requires constructing it and passing it into
 * the `evaluators` array below - no changes to the submission flow.
 *
 * Combination strategy:
 *  - The deterministic (rule-based) evaluator is always trusted for
 *    objective category scores when the AI evaluator is unavailable.
 *  - When the AI evaluator IS available, its subjective scores/feedback are
 *    blended with the rule-based evaluator's objective "Requirement Coverage"
 *    score (since that is best determined mechanically), and its
 *    strengths/weaknesses/suggestions are merged with the deterministic ones.
 */
class EvaluationService {
  constructor(evaluators = []) {
    this.evaluators = evaluators;
  }

  async evaluate(submission, problem) {
    const results = {};
    for (const evaluator of this.evaluators) {
      try {
        results[evaluator.name] = await evaluator.evaluate(submission, problem);
      } catch (err) {
        // Defensive: even if an evaluator throws unexpectedly, don't kill the flow.
        results[evaluator.name] = {
          overallScore: null,
          categories: [],
          strengths: [],
          weaknesses: [],
          suggestions: [],
          available: false,
          unavailableReason: err.message,
        };
      }
    }

    const ruleResult = results.RuleBasedEvaluator;
    const aiResult = results.AIEvaluator;

    if (!ruleResult) {
      throw new Error("RuleBasedEvaluator result missing; cannot produce a final evaluation.");
    }

    const aiAvailable = Boolean(aiResult && aiResult.available);

    let categories;
    if (aiAvailable) {
      // Keep Requirement Coverage from the deterministic evaluator (objective fact-check),
      // use AI scores for the four subjective categories.
      const ruleCoverage = ruleResult.categories.find((c) => c.name === "Requirement Coverage");
      categories = aiResult.categories.map((c) =>
        c.name === "Requirement Coverage" && ruleCoverage ? ruleCoverage : c
      );
    } else {
      categories = ruleResult.categories;
    }

    const overallScore = categories.reduce((sum, c) => sum + c.score, 0);

    const strengths = dedupe([...(aiAvailable ? aiResult.strengths : []), ...ruleResult.strengths]);
    const weaknesses = dedupe([...(aiAvailable ? aiResult.weaknesses : []), ...ruleResult.weaknesses]);
    const suggestions = dedupe([...(aiAvailable ? aiResult.suggestions : []), ...ruleResult.suggestions]);

    return {
      overallScore,
      categories,
      strengths,
      weaknesses,
      suggestions,
      evaluatorResults: results,
      aiAvailable,
    };
  }
}

function dedupe(arr) {
  return [...new Set(arr.filter(Boolean).map((s) => String(s).trim()))];
}

module.exports = EvaluationService;
