const RULE_OFFSET = 1000;

async function updateRules() {
  const { blockedSites = [] } = await chrome.storage.local.get("blockedSites");

  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRules.map((rule) => rule.id),

    addRules: blockedSites.map((domain, index) => ({
      id: RULE_OFFSET + index,

      priority: 1,

      action: {
        type: "block",
      },

      condition: {
        requestDomains: [domain],

        resourceTypes: ["main_frame"],
      },
    })),
  });

  console.log("Blocked domains:", blockedSites);
}

chrome.runtime.onInstalled.addListener(updateRules);

chrome.runtime.onStartup.addListener(updateRules);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.blockedSites) {
    updateRules();
  }
});

updateRules();
