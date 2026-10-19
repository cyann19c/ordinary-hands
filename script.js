(() => {
  "use strict";
  const link = document.getElementById("submission-link");
  const status = document.getElementById("submission-status");
  const rawUrl = window.EXHIBITION_CONFIG?.submissionUrl?.trim();
  let formUrl;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === "https:" && !parsed.username && !parsed.password) formUrl = parsed.href;
  } catch { /* An empty or invalid URL keeps the honest placeholder. */ }
  if (formUrl) {
    link.href = formUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    status.replaceChildren();
    const heading = document.createElement("strong");
    heading.textContent = "Submissions open · External form";
    status.append(heading, document.createElement("br"), "Opens the curator’s submission form in a new tab. Review its consent and privacy information before sending your work.");
    status.classList.add("is-open");
  } else {
    link.addEventListener("click", () => status.focus({ preventScroll: true }));
  }

  const dialog = document.getElementById("sample-dialog");
  const detailImage = document.getElementById("detail-image");
  let opener;
  if (typeof dialog.showModal === "function") {
    document.querySelectorAll(".sample-link").forEach(sample => {
      sample.addEventListener("click", event => {
        // Preserve native open-in-new-tab behavior and the no-JS image fallback.
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = sample;
        detailImage.src = sample.href;
        detailImage.alt = sample.querySelector("img").alt;
        document.getElementById("detail-title").textContent = sample.dataset.title;
        document.getElementById("detail-description").textContent = sample.dataset.description;
        document.getElementById("detail-source").textContent = "Source file: " + sample.dataset.source;
        dialog.showModal();
      });
    });
    document.getElementById("close-dialog").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => { if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }});
    dialog.addEventListener("close", () => opener?.focus({ preventScroll: true }));
  }
})();
