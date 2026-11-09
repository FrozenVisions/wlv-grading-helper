/**
 * WholeLottaVinyl Record Grading Helper — grade engine.
 *
 * Six grades only (Chris / WholeLottaVinyl listing wording):
 * M, NM, EX, VG+, VG, G+
 *
 * Vinyl and cover graded separately. Worst criterion wins.
 * When unsure, grade down. Anything worse than G+ still shows G+
 * with a "below G+ / not suitable to list" note.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.WLVGrading = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const GRADE_ORDER = ["M", "NM", "EX", "VG+", "VG", "G+"];

  const DEFINITIONS = {
    M: {
      short: "Mint (M)",
      vinyl:
        "Vinyl is unplayed.",
      cover:
        "Cover is sealed and unopened."
    },
    NM: {
      short: "Near Mint (NM)",
      vinyl:
        "Vinyl is unplayed — the grooves haven't developed in the tracks yet.",
      cover:
        "Cover has been opened but has no rips, tears or damage at all."
    },
    EX: {
      short: "Excellent (EX)",
      vinyl:
        "Vinyl has been played but has zero scratches throughout.",
      cover:
        "Cover has small wear but no rips or tears."
    },
    "VG+": {
      short: "Very Good Plus (VG+)",
      vinyl:
        "Vinyl has been played but has up to a handful of hairline scratches, none feelable.",
      cover:
        "Cover has small wear and light rips, but the spine is fully visible — text clearly readable."
    },
    VG: {
      short: "Very Good (VG)",
      vinyl:
        "Vinyl has been played, with numerous hairline scratches and easily noticeable scratches; none feelable.",
      cover:
        "Cover has heavier wear and can have splits, rips and tears. Spine is partly visible — you can see part of the text."
    },
    "G+": {
      short: "Good Plus (G+)",
      vinyl:
        "Vinyl has been played, with feelable scratches that can cause skips, pops and jumps.",
      cover:
        "Cover has lots of splits, rips and tears, and a non-visible spine."
    }
  };

  function worse(a, b) {
    return GRADE_ORDER.indexOf(a) >= GRADE_ORDER.indexOf(b) ? a : b;
  }

  function applyCap(current, cap) {
    return worse(current, cap);
  }

  /**
   * @param {object} answers
   * @returns {{ vinylGrade, coverGrade, gradedLine, vinylText, coverText, comment, reason, belowGPlus, details }}
   */
  function grade(answers) {
    const a = answers || {};
    const vinyl = gradeVinyl(a);
    const cover = gradeCover(a);
    const belowGPlus = !!(vinyl.below || cover.below);

    const gradedLine = "Graded: " + vinyl.grade + "/" + cover.grade;
    const vinylText = DEFINITIONS[vinyl.grade].vinyl;
    const coverText = DEFINITIONS[cover.grade].cover;

    let comment =
      gradedLine +
      "\n\n" +
      "Vinyl (" +
      vinyl.grade +
      "): " +
      vinylText +
      "\n" +
      "Cover (" +
      cover.grade +
      "): " +
      coverText;

    if (belowGPlus) {
      comment +=
        "\n\nNote: condition is below G+ / not suitable to list on WholeLottaVinyl.";
    }

    return {
      vinylGrade: vinyl.grade,
      coverGrade: cover.grade,
      gradedLine: gradedLine,
      vinylText: vinylText,
      coverText: coverText,
      comment: comment,
      reason: buildReason(a, vinyl, cover, belowGPlus),
      belowGPlus: belowGPlus,
      details: { vinyl: vinyl, cover: cover }
    };
  }

  function gradeVinyl(a) {
    let g = "M";
    let below = false;

    const played = a.played === true || a.played === "played";
    const scratches = a.scratches || "none";
    const skips = a.skipsPopsJumps === true;
    const sealed = a.sealed === true;
    const unplayable = a.unplayable === true;

    if (played) g = applyCap(g, "EX");
    else if (!sealed) g = applyCap(g, "NM"); // unplayed but opened → NM at best

    if (scratches === "handful") g = applyCap(g, "VG+");
    if (scratches === "numerous") g = applyCap(g, "VG");
    if (scratches === "feelable") g = applyCap(g, "G+");

    if (skips) g = applyCap(g, "G+");

    if (unplayable) {
      g = "G+";
      below = true;
    }

    // Consistency: unplayed + no scratches + sealed → M
    if (!played && scratches === "none" && !skips && !unplayable) {
      g = sealed ? "M" : "NM";
    }

    return { grade: g, below: below };
  }

  function gradeCover(a) {
    let g = "M";
    let below = false;

    const condition = a.coverCondition || "no_damage";
    const spine = a.spine || "full";
    const sealed = a.sealed === true || condition === "sealed";
    const destroyed = a.coverDestroyed === true;

    if (sealed || condition === "sealed") {
      g = "M";
    } else if (condition === "no_damage") {
      g = applyCap(g, "NM");
    } else if (condition === "small_wear") {
      g = applyCap(g, "EX");
    } else if (condition === "light_rips") {
      g = applyCap(g, "VG+");
    } else if (condition === "splits_rips_tears") {
      g = applyCap(g, "VG");
    } else if (condition === "lots") {
      g = applyCap(g, "G+");
    }

    // Spine caps (Chris: VG+ needs fully visible; VG partly; G+ not visible)
    if (!sealed && condition !== "sealed") {
      if (spine === "part") g = applyCap(g, "VG");
      if (spine === "none") g = applyCap(g, "G+");
      // light rips but spine not fully readable → can't stay VG+
      if (condition === "light_rips" && spine !== "full") {
        g = applyCap(g, "VG");
      }
    }

    if (destroyed) {
      g = "G+";
      below = true;
    }

    return { grade: g, below: below };
  }

  function buildReason(a, vinyl, cover, belowGPlus) {
    const bits = [];
    if (belowGPlus) {
      bits.push(
        "Condition looks below G+ — shown as G+ with a not-suitable-to-list note"
      );
    } else {
      bits.push(
        "Vinyl " +
          vinyl.grade +
          " / Cover " +
          cover.grade +
          " from WholeLottaVinyl grading (worst criterion wins)"
      );
    }
    bits.push("When unsure we grade down");
    return bits.join(". ") + ".";
  }

  function defaultAnswers() {
    return {
      sealed: false,
      played: false,
      scratches: "none",
      skipsPopsJumps: false,
      unplayable: false,
      coverCondition: "no_damage",
      spine: "full",
      coverDestroyed: false
    };
  }

  return {
    grade: grade,
    defaultAnswers: defaultAnswers,
    GRADE_ORDER: GRADE_ORDER,
    DEFINITIONS: DEFINITIONS
  };
});
