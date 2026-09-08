/**
 * Evaluator - abstract base class for all evaluators.
 *
 * Any concrete evaluator (rule-based, AI-based, or a future evaluator such as
 * a "peer review" or "plagiarism" evaluator) must implement `evaluate`.
 *
 * The rest of the application only ever depends on this interface, never on
 * a concrete implementation. This is what allows AIEvaluator (Gemini) to be
 * swapped out, disabled, or extended without touching the submission flow.
 */
class Evaluator {
  /**
   * @param {Object} submission - The learner's submission (classes, interfaces, relationships, explanation, code)
   * @param {Object} problem - The problem the submission is answering
   * @returns {Promise<EvaluatorResult>}
   */
  // eslint-disable-next-line no-unused-vars
  async evaluate(submission, problem) {
    throw new Error("Evaluator.evaluate() must be implemented by subclasses");
  }

  /**
   * A short machine-readable name used as a key in evaluatorResults.
   */
  get name() {
    return this.constructor.name;
  }
}

/**
 * @typedef {Object} EvaluatorCategory
 * @property {string} name
 * @property {number} score
 * @property {number} maxScore
 * @property {string} feedback
 *
 * @typedef {Object} EvaluatorResult
 * @property {number} overallScore
 * @property {EvaluatorCategory[]} categories
 * @property {string[]} strengths
 * @property {string[]} weaknesses
 * @property {string[]} suggestions
 * @property {boolean} available - false if this evaluator could not run (e.g. AI down)
 * @property {string} [unavailableReason]
 */

module.exports = Evaluator;
