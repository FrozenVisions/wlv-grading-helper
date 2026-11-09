(function () {
  "use strict";

  const form = document.getElementById("grade-form");
  const resultBody = document.getElementById("result-body");
  const emptyHint = document.getElementById("empty-hint");
  const copyBtn = document.getElementById("copy-btn");
  const copyStatus = document.getElementById("copy-status");
  const resetBtn = document.getElementById("reset-btn");
  const belowNote = document.getElementById("below-note");

  applyBrand();
  form.addEventListener("submit", onSubmit);
  resetBtn.addEventListener("click", onReset);
  copyBtn.addEventListener("click", onCopy);

  function applyBrand() {
    const b = window.BRAND || {};
    const badge = document.getElementById("brand-badge");
    const title = document.getElementById("tool-title");
    const tagline = document.getElementById("brand-tagline");
    const footerLink = document.getElementById("footer-link");

    if (badge) badge.textContent = b.shopName || "WholeLottaVinyl";
    if (title) title.textContent = b.toolName || "Record Grading Helper";
    if (tagline) tagline.textContent = b.tagline || "";
    document.title =
      (b.shopName || "WholeLottaVinyl") +
      " " +
      (b.toolName || "Record Grading Helper");

    if (footerLink) {
      const url = b.shopUrl || "https://wholelottavinyl.com";
      const label = b.shopUrlLabel || "wholelottavinyl.com";
      const prefix = b.footerLine || "Records graded this way at";
      footerLink.href = url;
      footerLink.textContent = prefix + " " + label;
    }
  }

  function readAnswers() {
    return {
      sealed: form.sealed.checked,
      played: form.played.checked,
      scratches: form.scratches.value,
      skipsPopsJumps: form.skipsPopsJumps.checked,
      unplayable: form.unplayable.checked,
      coverCondition: form.coverCondition.value,
      spine: form.spine.value,
      coverDestroyed: form.coverDestroyed.checked
    };
  }

  function onSubmit(e) {
    e.preventDefault();
    const result = window.WLVGrading.grade(readAnswers());
    renderResult(result);
  }

  function renderResult(result) {
    emptyHint.hidden = true;
    emptyHint.classList.add("hidden");
    resultBody.hidden = false;
    resultBody.classList.remove("hidden");

    document.getElementById("vinyl-grade-chip").textContent = result.vinylGrade;
    document.getElementById("cover-grade-chip").textContent = result.coverGrade;
    document.getElementById("vinyl-desc").textContent = result.vinylText;
    document.getElementById("cover-desc").textContent = result.coverText;
    document.getElementById("reason-text").textContent = result.reason;
    document.getElementById("comment-text").value = result.comment;

    if (result.belowGPlus) {
      belowNote.hidden = false;
      belowNote.classList.remove("hidden");
    } else {
      belowNote.hidden = true;
      belowNote.classList.add("hidden");
    }

    copyStatus.textContent = "";
    copyBtn.classList.remove("copied");
    copyBtn.textContent = "Copy";
  }

  function onReset() {
    form.reset();
    resultBody.hidden = true;
    resultBody.classList.add("hidden");
    emptyHint.hidden = false;
    emptyHint.classList.remove("hidden");
    belowNote.hidden = true;
    belowNote.classList.add("hidden");
    copyStatus.textContent = "";
  }

  async function onCopy() {
    const text = document.getElementById("comment-text").value;
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.getElementById("comment-text");
        ta.focus();
        ta.select();
        document.execCommand("copy");
      }
      copyStatus.textContent = "Copied to clipboard";
      copyBtn.classList.add("copied");
      copyBtn.textContent = "Copied";
      setTimeout(function () {
        copyBtn.classList.remove("copied");
        copyBtn.textContent = "Copy";
      }, 1600);
    } catch (err) {
      copyStatus.textContent = "Could not copy — select the text manually";
    }
  }
})();
