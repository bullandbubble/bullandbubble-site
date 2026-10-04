// Bull & Bubble — small progressive enhancements. The page works without this file.
(function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Latest reels from reels.json (edit that file to add a reel; newest first).
  fetch("reels.json")
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((reels) => {
      const grid = document.getElementById("reel-grid");
      if (!grid || !Array.isArray(reels) || !reels.length) return;
      grid.innerHTML = reels
        .map((r) => {
          const inner = `<img src="${esc(r.cover)}" alt="Cover: ${esc(r.title)}" width="540" height="960" loading="lazy">
            <div><p class="tag">${esc(r.series)}</p><h3>${esc(r.title)}</h3>${r.url ? "" : '<p class="soon">Coming soon</p>'}</div>`;
          return r.url
            ? `<article class="reel"><a href="${esc(r.url)}" target="_blank" rel="noopener">${inner}</a></article>`
            : `<article class="reel">${inner}</article>`;
        })
        .join("");
    })
    .catch(() => { /* keep the static fallback */ });

  // Newsletter form: posts to the Beehiiv endpoint set in data-endpoint.
  const form = document.getElementById("signup");
  const msg = document.getElementById("form-msg");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Enter a valid email address, like name@example.com."; return; }
      const endpoint = form.dataset.endpoint;
      if (!endpoint) { msg.textContent = "Sign-ups open soon. The newsletter launches in November."; return; }
      // Hand off to Beehiiv's hosted subscribe page, which confirms the address itself.
      form.action = endpoint;
      form.method = "post";
      form.target = "_blank";
      msg.textContent = "Opening Beehiiv to confirm your subscription…";
      HTMLFormElement.prototype.submit.call(form);
    });
  }
})();
