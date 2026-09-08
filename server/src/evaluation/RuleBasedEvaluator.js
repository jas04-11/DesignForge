const Evaluator = require("./Evaluator");

const CATEGORY_MAX = 20;

function normalize(str) {
  return String(str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * RuleBasedEvaluator - deterministic, objective evaluation.
 *
 * Checks things that can be verified mechanically:
 *  - required classes are present
 *  - required methods/concepts are represented
 *  - an explanation was provided
 *  - the submission is not empty
 *
 * This evaluator ALWAYS succeeds (it never depends on an external service),
 * which guarantees a submission can always be scored even if AI evaluation
 * is unavailable.
 */
class RuleBasedEvaluator extends Evaluator {
  async evaluate(submission, problem) {
    const classNames = (submission.classes || []).map((c) => normalize(c.name));
    const allMethods = (submission.classes || [])
      .flatMap((c) => c.methods || [])
      .concat((submission.interfaces || []).flatMap((i) => i.methods || []))
      .map(normalize);

    const expectedClasses = problem.expectedClasses || [];
    const expectedMethods = problem.expectedMethods || [];
    const expectedConcepts = problem.expectedConcepts || [];

    // --- Requirement Coverage ---
    const matchedClasses = expectedClasses.filter((ec) =>
      classNames.some((cn) => cn.includes(normalize(ec)) || normalize(ec).includes(cn))
    );
    const matchedMethods = expectedMethods.filter((em) =>
      allMethods.some((m) => m.includes(normalize(em)) || normalize(em).includes(m))
    );
    const classCoverage = expectedClasses.length ? matchedClasses.length / expectedClasses.length : 1;
    const methodCoverage = expectedMethods.length ? matchedMethods.length / expectedMethods.length : 1;
    const coverageRatio = (classCoverage + methodCoverage) / 2;
    const requirementScore = Math.round(coverageRatio * CATEGORY_MAX);

    // --- Responsibility Assignment (proxy: every class has a non-trivial responsibility) ---
    const classesWithResponsibility = (submission.classes || []).filter(
      (c) => (c.responsibility || "").trim().length >= 10
    );
    const responsibilityRatio = submission.classes && submission.classes.length
      ? classesWithResponsibility.length / submission.classes.length
      : 0;
    const responsibilityScore = Math.round(responsibilityRatio * CATEGORY_MAX);

    // --- Abstraction (proxy: at least one interface OR an inheritance/dependency relationship) ---
    const hasInterfaces = (submission.interfaces || []).length > 0;
    const hasAbstractRelationship = (submission.relationships || []).some((r) =>
      ["Inheritance", "Dependency"].includes(r.type)
    );
    let abstractionScore = 8; // baseline for attempting the exercise
    if (hasInterfaces) abstractionScore += 8;
    if (hasAbstractRelationship) abstractionScore += 4;
    abstractionScore = Math.min(abstractionScore, CATEGORY_MAX);

    // --- Extensibility (proxy: explanation mentions extensibility-related keywords) ---
    const explanationLower = (submission.explanation || "").toLowerCase();
    const extensibilityKeywords = ["extend", "strategy", "plugin", "future", "add new", "open/closed", "open-closed"];
    const extensibilityHits = extensibilityKeywords.filter((k) => explanationLower.includes(k)).length;
    const extensibilityScore = Math.min(CATEGORY_MAX, 6 + extensibilityHits * 4);

    // --- SOLID Principles (proxy: relationships exist + explanation length + concept keywords) ---
    const conceptHits = expectedConcepts.filter((c) => explanationLower.includes(String(c).toLowerCase())).length;
    const hasRelationships = (submission.relationships || []).length > 0;
    let solidScore = 6;
    if (hasRelationships) solidScore += 6;
    if (explanationLower.length > 200) solidScore += 4;
    solidScore += Math.min(4, conceptHits * 2);
    solidScore = Math.min(solidScore, CATEGORY_MAX);

    const categories = [
      { name: "Requirement Coverage", score: requirementScore, maxScore: CATEGORY_MAX, feedback: buildCoverageFeedback(matchedClasses, expectedClasses, matchedMethods, expectedMethods) },
      { name: "Responsibility Assignment", score: responsibilityScore, maxScore: CATEGORY_MAX, feedback: classesWithResponsibility.length === (submission.classes || []).length
          ? "Every class has a clearly stated responsibility."
          : "Some classes are missing a clear, specific responsibility statement." },
      { name: "Abstraction", score: abstractionScore, maxScore: CATEGORY_MAX, feedback: hasInterfaces
          ? "Interfaces are used to abstract behavior."
          : "No interfaces were defined; consider introducing one for varying behavior." },
      { name: "Extensibility", score: extensibilityScore, maxScore: CATEGORY_MAX, feedback: extensibilityHits > 0
          ? "The explanation addresses how the design could be extended."
          : "The explanation does not clearly describe how the design would evolve." },
      { name: "SOLID Principles", score: solidScore, maxScore: CATEGORY_MAX, feedback: hasRelationships
          ? "Class relationships are defined, supporting separation of concerns."
          : "No relationships between classes were defined." },
    ];

    const overallScore = categories.reduce((sum, c) => sum + c.score, 0);

    const strengths = [];
    const weaknesses = [];
    const suggestions = [];

    if (matchedClasses.length > 0) strengths.push(`Includes key classes: ${matchedClasses.join(", ")}.`);
    if (hasInterfaces) strengths.push("Uses interfaces to model abstraction.");
    if (hasRelationships) strengths.push("Defines relationships between classes.");

    const missingClasses = expectedClasses.filter((ec) => !matchedClasses.includes(ec));
    if (missingClasses.length > 0) {
      weaknesses.push(`Missing expected classes: ${missingClasses.join(", ")}.`);
      suggestions.push(`Consider adding a class for: ${missingClasses.join(", ")}.`);
    }
    const missingMethods = expectedMethods.filter((em) => !matchedMethods.includes(em));
    if (missingMethods.length > 0) {
      weaknesses.push(`Missing expected behavior/methods: ${missingMethods.join(", ")}.`);
    }
    if (!hasInterfaces) {
      suggestions.push("Introduce an interface to decouple varying behavior from concrete classes.");
    }
    if (extensibilityHits === 0) {
      suggestions.push("Explain explicitly how new requirements could be added without modifying existing classes.");
    }

    return {
      overallScore,
      categories,
      strengths,
      weaknesses,
      suggestions,
      available: true,
    };
  }
}

function buildCoverageFeedback(matchedClasses, expectedClasses, matchedMethods, expectedMethods) {
  if (!expectedClasses.length && !expectedMethods.length) {
    return "No specific requirement checklist was defined for this problem.";
  }
  const classPart = expectedClasses.length
    ? `${matchedClasses.length}/${expectedClasses.length} expected classes present`
    : null;
  const methodPart = expectedMethods.length
    ? `${matchedMethods.length}/${expectedMethods.length} expected behaviors present`
    : null;
  return [classPart, methodPart].filter(Boolean).join("; ") + ".";
}

module.exports = RuleBasedEvaluator;
