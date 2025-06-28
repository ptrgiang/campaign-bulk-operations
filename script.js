// Video Campaign Creator JavaScript

// Global variables
let campaignData = [];
const campaignList = document.getElementById("campaignList");

// Default Excel columns
const defaultColumns = [
  "Product",
  "Entity",
  "Operation",
  "Campaign Id",
  "Draft Campaign Id",
  "Portfolio Id",
  "Campaign Name",
  "Start Date",
  "End Date",
  "State",
  "Budget Type",
  "Budget",
  "Bid Optimization",
  "Bid Multiplier",
  "Bid",
  "Keyword Text",
  "Match Type",
  "Product Targeting Expression",
  "Ad Format",
  "Landing Page URL",
  "Landing Page asins",
  "Brand Entity Id",
  "Brand Name",
  "Brand Logo Asset Id",
  "Brand Logo URL",
  "Creative Headline",
  "Creative asins",
  "Video Media Ids",
  "Creative Type",
];

// Utility Functions
const ensureDefaultColumns = (obj) => {
  return Object.fromEntries(defaultColumns.map((key) => [key, obj[key] ?? ""]));
};

const validateRequiredFields = () => {
  const productNumber = document.getElementById("productNumber").value.trim();
  const sku = document.getElementById("sku").value.trim();
  const asin = document.getElementById("asin").value.trim();
  const videoId = document.getElementById("videoId").value.trim();
  const keywords = document
    .getElementById("keywords")
    .value.trim()
    .split("\n")
    .filter(Boolean);

  return {
    isValid: productNumber && sku && asin && videoId && keywords.length > 0,
    productNumber,
    sku,
    asin,
    videoId,
    keywords,
  };
};

const showError = (message) => {
  const errorBox = document.getElementById("formError");
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
};

const hideError = () => {
  const errorBox = document.getElementById("formError");
  errorBox.classList.add("hidden");
  errorBox.textContent = "";
};

const getCurrentDate = () => {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
};

const getBrandEntityId = (country) => {
  return country === "US" ? "ENTITYCQP7AL92VN6L" : "ENTITY2DMN2Z7IO7RFX";
};

// Campaign Management Functions
const createCampaignId = (productNumber, sku, campaignType) => {
  return `${productNumber} ${sku} Video Ads ${
    campaignType.charAt(0).toUpperCase() + campaignType.slice(1)
  }`;
};

const addCampaignToCampaignData = (formData) => {
  const {
    productNumber,
    sku,
    asin,
    videoId,
    keywords,
    negativeKeywords,
    portfolioId,
    country,
    campaignType,
  } = formData;
  const today = getCurrentDate();
  const campaignId = createCampaignId(productNumber, sku, campaignType);
  const brandEntityId = getBrandEntityId(country);

  // Add main campaign
  campaignData.push(
    ensureDefaultColumns({
      Product: "Sponsored Brands",
      Entity: "Campaign",
      Operation: "Create",
      "Campaign Id": campaignId,
      "Portfolio Id": portfolioId,
      "Campaign Name": campaignId,
      "Start Date": today,
      State: "Enabled",
      "Budget Type": "Daily",
      Budget: 10,
      "Bid Optimization": "Auto",
      "Ad Format": "video",
      "Brand Entity Id": brandEntityId,
      "Brand Name": "BlueStars",
      "Creative asins": asin,
      "Video Media Ids": videoId,
      "Creative Type": "video",
    })
  );

  // Add keywords
  keywords.forEach((kw) => {
    campaignData.push(
      ensureDefaultColumns({
        Product: "Sponsored Brands",
        Entity: "Keyword",
        Operation: "Create",
        "Campaign Id": campaignId,
        State: "Enabled",
        Bid: 0.25,
        "Keyword Text": kw,
        "Match Type": campaignType,
      })
    );
  });

  // Add negative keywords
  negativeKeywords.forEach((kw) => {
    campaignData.push(
      ensureDefaultColumns({
        Product: "Sponsored Brands",
        Entity: "Negative Keyword",
        Operation: "Create",
        "Campaign Id": campaignId,
        State: "Enabled",
        "Keyword Text": kw,
        "Match Type": "negativePhrase",
      })
    );
  });

  return campaignId;
};

const addCampaignToUI = (campaignId) => {
  const line = document.createElement("div");
  line.className =
    "flex justify-between items-center bg-white p-2 rounded shadow mb-2 campaign-item";
  line.dataset.campaignId = campaignId;
  line.innerHTML = `
    <span>✔ Added: ${campaignId}</span>
    <button type="button" class="text-red-500 hover:text-red-700 font-bold text-lg ml-4" onclick="removeCampaign(this, '${campaignId}')">×</button>
  `;
  campaignList.appendChild(line);
};

const removeCampaign = (button, campaignId) => {
  const line = button.closest("div");
  if (line) line.remove();
  campaignData = campaignData.filter(
    (entry) => entry["Campaign Id"] !== campaignId
  );
};

// Make removeCampaign globally accessible
window.removeCampaign = removeCampaign;

// Excel Functions
const downloadExcel = async () => {
  try {
    const XLSX = await import(
      "https://cdn.sheetjs.com/xlsx-0.20.2/package/xlsx.mjs"
    );
    const output =
      campaignData.length > 0
        ? campaignData
        : [Object.fromEntries(defaultColumns.map((key) => [key, ""]))];

    const worksheet = XLSX.utils.json_to_sheet(output, {
      header: defaultColumns,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Campaign");
    XLSX.writeFile(workbook, "Video_Campaign_Upload_Template.xlsx");
  } catch (error) {
    console.error("Error downloading Excel file:", error);
    showError("❌ Error downloading Excel file. Please try again.");
  }
};

// Form Functions
const clearForm = () => {
  document.getElementById("campaignForm").reset();
  hideError();
};

const clearTemplate = () => {
  campaignData = [];
  campaignList.innerHTML = "";
  hideError();
};

// Modal Functions
const showModal = () => {
  document.getElementById("videoModal").classList.remove("hidden");
};

const hideModal = () => {
  document.getElementById("videoModal").classList.add("hidden");
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Add to Template button
  document.getElementById("addTemplate").addEventListener("click", () => {
    hideError();

    const validation = validateRequiredFields();
    if (!validation.isValid) {
      showError("❌ Please fill in all required fields marked with *");
      return;
    }

    const country = document.getElementById("country").value;
    const portfolioId = document.getElementById("portfolioId").value.trim();
    const campaignType = document.getElementById("campaignType").value;
    const negativeKeywords = document
      .getElementById("negativeKeywords")
      .value.trim()
      .split("\n")
      .filter(Boolean);

    const formData = {
      productNumber: validation.productNumber,
      sku: validation.sku,
      asin: validation.asin,
      videoId: validation.videoId,
      keywords: validation.keywords,
      negativeKeywords,
      portfolioId,
      country,
      campaignType,
    };

    const campaignId = addCampaignToCampaignData(formData);
    addCampaignToUI(campaignId);
  });

  // Download Excel button
  document
    .getElementById("downloadExcel")
    .addEventListener("click", downloadExcel);

  // Clear Fields button
  document.getElementById("clearFields").addEventListener("click", clearForm);

  // Clear Template button
  document
    .getElementById("clearTemplate")
    .addEventListener("click", clearTemplate);

  // Modal buttons
  document.getElementById("videoHelpBtn").addEventListener("click", showModal);
  document.getElementById("closeModal").addEventListener("click", hideModal);

  // Close modal when clicking outside
  document.getElementById("videoModal").addEventListener("click", (e) => {
    if (e.target.id === "videoModal") {
      hideModal();
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // ESC to close modal
    if (e.key === "Escape") {
      hideModal();
    }

    // Ctrl+Enter to add to template
    if (e.ctrlKey && e.key === "Enter") {
      document.getElementById("addTemplate").click();
    }
  });
});
