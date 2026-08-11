const input = document.getElementById("site");
const addButton = document.getElementById("add");
const list = document.getElementById("list");

function cleanDomain(value) {
  try {
    if (!value.includes("://")) {
      value = "https://" + value;
    }

    const url = new URL(value);

    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

async function loadSites() {
  const { blockedSites = [] } = await chrome.storage.local.get("blockedSites");

  list.innerHTML = "";

  blockedSites.forEach((site, index) => {
    const li = document.createElement("li");

    li.textContent = site;

    const remove = document.createElement("button");
    remove.textContent = "Remove";

    remove.onclick = async () => {
      blockedSites.splice(index, 1);

      await chrome.storage.local.set({
        blockedSites,
      });

      loadSites();
    };

    li.appendChild(remove);

    list.appendChild(li);
    list.appendChild(document.createElement("hr"));
  });
}

addButton.onclick = async () => {
  const domain = cleanDomain(input.value.trim());

  if (!domain) {
    return;
  }

  const { blockedSites = [] } = await chrome.storage.local.get("blockedSites");

  if (!blockedSites.includes(domain)) {
    blockedSites.push(domain);

    await chrome.storage.local.set({
      blockedSites,
    });
  }

  input.value = "";

  loadSites();
};

loadSites();
