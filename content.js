async function checkBlocked() {
  const { blockedSites = [] } = await chrome.storage.local.get("blockedSites");

  const hostname = window.location.hostname.replace(/^www\./, "").toLowerCase();

  const blocked = blockedSites.some(
    (domain) => hostname === domain || hostname.endsWith("." + domain),
  );

  if (blocked) {
    document.documentElement.innerHTML = `
      <body style="
        background:#111;
        color:white;
        font-family:Arial;
        text-align:center;
        padding-top:100px;
      ">
        <h1>Website Blocked</h1>
        <p>${hostname} is blocked.</p>
      </body>
    `;
  }
}

checkBlocked();

// Catch SPA navigation (YouTube, etc.)
let lastUrl = location.href;

new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;

    checkBlocked();
  }
}).observe(document, {
  subtree: true,
  childList: true,
});
