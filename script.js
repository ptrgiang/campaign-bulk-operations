// Video Campaign Creator JavaScript

// Global variables
let campaignData = [];

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

// DOM Elements
const elements = {
  form: document.getElementById("campaignForm"),
  country: document.getElementById("country"),
  campaignType: document.getElementById("campaignType"),
  portfolioId: document.getElementById("portfolioId"),
  productNumber: document.getElementById("productNumber"),
  sku: document.getElementById("sku"),
  asin: document.getElementById("asin"),
  videoId: document.getElementById("videoId"),
  keywords: document.getElementById("keywords"),
  negativeKeywords: document.getElementById("negativeKeywords"),

  // Buttons
  addCampaign: document.getElementById("addCampaign"),
  clearForm: document.getElementById("clearForm"),
  clearTemplate: document.getElementById("clearTemplate"),
  downloadExcel: document.getElementById("downloadExcel"),
  videoHelpBtn: document.getElementById("videoHelpBtn"),

  // Alerts
  errorAlert: document.getElementById("errorAlert"),
  successAlert: document.getElementById("successAlert"),
  errorMessage: document.getElementById("errorMessage"),
  closeError: document.getElementById("closeError"),

  // Campaign List
  campaignList: document.getElementById("campaignList"),
  campaignListTitle: document.getElementById("campaignListTitle"),

  // Modal
  videoModal: document.getElementById("videoModal"),
  closeModal: document.getElementById("closeModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
};

// Utility Functions
const ensureDefaultColumns = (obj) => {
  return Object.fromEntries(defaultColumns.map((key) => [key, obj[key] ?? ""]));
};

const getCurrentDate = () => {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
};

const getBrandEntityId = (country) => {
  return country === "US" ? "ENTITYCQP7AL92VN6L" : "ENTITY2DMN2Z7IO7RFX";
};

const createCampaignId = (productNumber, sku, campaignType) => {
  return `${productNumber} ${sku} Video Ads ${
    campaignType.charAt(0).toUpperCase() + campaignType.slice(1)
  }`;
};

// Validation Functions
const validateRequiredFields = () => {
  const productNumber = elements.productNumber.value.trim();
  const sku = elements.sku.value.trim();
  const asin = elements.asin.value.trim();
  const videoId = elements.videoId.value.trim();
  const keywords = elements.keywords.value.trim().split("\n").filter(Boolean);

  if (!productNumber) {
    return { isValid: false, message: "Product Number is required" };
  }

  if (!sku) {
    return { isValid: false, message: "SKU is required" };
  }

  if (!asin) {
    return { isValid: false, message: "ASIN is required" };
  }

  if (!videoId) {
    return { isValid: false, message: "Video Media ID is required" };
  }

  if (keywords.length === 0) {
    return {
      isValid: false,
      message: "At least one targeting keyword is required",
    };
  }

  return {
    isValid: true,
    data: {
      productNumber,
      sku,
      asin,
      videoId,
      keywords,
      negativeKeywords: elements.negativeKeywords.value
        .trim()
        .split("\n")
        .filter(Boolean),
      portfolioId: elements.portfolioId.value.trim(),
      country: elements.country.value,
      campaignType: elements.campaignType.value,
    },
  };
};

// Alert Functions
const showError = (message) => {
  elements.errorMessage.textContent = message;
  elements.errorAlert.classList.remove("hidden");
  elements.successAlert.classList.add("hidden");
};

const hideError = () => {
  elements.errorAlert.classList.add("hidden");
};

const showSuccess = (message = "Campaign added successfully!") => {
  const successSpan = elements.successAlert.querySelector("span");

  // Determine if it's an "added" or "replaced" action and style accordingly
  if (message.toLowerCase().includes("replaced")) {
    successSpan.innerHTML = `Campaign <strong style="color: #f59e0b; font-weight: 700;">REPLACED</strong> successfully!`;
  } else {
    successSpan.innerHTML = `Campaign <strong style="color: #16a34a; font-weight: 700;">ADDED</strong> successfully!`;
  }

  elements.successAlert.classList.remove("hidden");
  elements.errorAlert.classList.add("hidden");

  // Auto-hide after 4 seconds (longer to ensure user sees the action)
  setTimeout(() => {
    elements.successAlert.classList.add("hidden");
  }, 4000);
};

// Campaign Management Functions
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

  // Check if campaign already exists and find its position
  const existingCampaignIndex = campaignData.findIndex(
    (entry) => entry["Campaign Id"] === campaignId
  );
  const isReplacement = existingCampaignIndex !== -1;
  let insertPosition = campaignData.length; // Default to end

  // If replacing, find the position of the first entry for this campaign
  if (isReplacement) {
    insertPosition = existingCampaignIndex;
    // Remove all existing entries for this campaign
    campaignData = campaignData.filter(
      (entry) => entry["Campaign Id"] !== campaignId
    );
  }

  // Prepare new campaign data
  const newCampaignData = [];

  // Add main campaign
  newCampaignData.push(
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
  keywords.forEach((keyword) => {
    newCampaignData.push(
      ensureDefaultColumns({
        Product: "Sponsored Brands",
        Entity: "Keyword",
        Operation: "Create",
        "Campaign Id": campaignId,
        State: "Enabled",
        Bid: 0.25,
        "Keyword Text": keyword,
        "Match Type": campaignType,
      })
    );
  });

  // Add negative keywords
  negativeKeywords.forEach((keyword) => {
    newCampaignData.push(
      ensureDefaultColumns({
        Product: "Sponsored Brands",
        Entity: "Negative Keyword",
        Operation: "Create",
        "Campaign Id": campaignId,
        State: "Enabled",
        "Keyword Text": keyword,
        "Match Type": "negativePhrase",
      })
    );
  });

  // Insert new campaign data at the correct position
  campaignData.splice(insertPosition, 0, ...newCampaignData);

  return { campaignId, isReplacement };
};

const updateCampaignList = () => {
  // Get unique campaign IDs in the order they appear in campaignData
  const campaignIds = [];
  const seen = new Set();

  campaignData.forEach((entry) => {
    const campaignId = entry["Campaign Id"];
    if (campaignId && !seen.has(campaignId)) {
      campaignIds.push(campaignId);
      seen.add(campaignId);
    }
  });

  // Update title
  elements.campaignListTitle.textContent = `Campaign Template (${campaignIds.length})`;

  if (campaignIds.length === 0) {
    elements.campaignList.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <p>No campaigns added yet</p>
                <span>Add your first campaign to see it here</span>
            </div>
        `;
    return;
  }

  elements.campaignList.innerHTML = campaignIds
    .map(
      (campaignId) => `
        <div class="campaign-item" data-campaign-id="${campaignId}">
            <div class="campaign-info">
                <svg class="campaign-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
                <span class="campaign-name">${campaignId}</span>
            </div>
            <button type="button" class="campaign-remove" onclick="removeCampaign('${campaignId}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `
    )
    .join("");
};

const removeCampaign = (campaignId) => {
  campaignData = campaignData.filter(
    (entry) => entry["Campaign Id"] !== campaignId
  );
  updateCampaignList();
};

// Make removeCampaign globally accessible
window.removeCampaign = removeCampaign;

// Excel Functions
const downloadExcel = async () => {
  try {
    // Import SheetJS library
    const XLSX = await import(
      "https://cdn.sheetjs.com/xlsx-0.20.2/package/xlsx.mjs"
    );

    const output =
      campaignData.length > 0
        ? campaignData.map((entry) => ensureDefaultColumns(entry))
        : [ensureDefaultColumns({})];

    const worksheet = XLSX.utils.json_to_sheet(output, {
      header: defaultColumns,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Campaign");
    XLSX.writeFile(workbook, "Video_Campaign_Upload_Template.xlsx");
  } catch (error) {
    console.error("Error downloading Excel file:", error);
    showError("Failed to download Excel file. Please try again.");
  }
};

// Form Functions
const clearForm = () => {
  elements.form.reset();
  hideError();
};

const clearTemplate = () => {
  campaignData = [];
  updateCampaignList();
  hideError();
};

const addCampaign = () => {
  hideError();

  const validation = validateRequiredFields();
  if (!validation.isValid) {
    showError(validation.message);
    return;
  }

  const result = addCampaignToCampaignData(validation.data);
  updateCampaignList();

  // Show appropriate success message with clear keywords
  const message = result.isReplacement
    ? "Campaign replaced successfully!"
    : "Campaign added successfully!";
  showSuccess(message);
};

// Modal Functions
const showModal = () => {
  elements.videoModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const hideModal = () => {
  elements.videoModal.classList.add("hidden");
  document.body.style.overflow = "unset";
};

// Event Listeners
const initializeEventListeners = () => {
  // Button events
  elements.addCampaign.addEventListener("click", addCampaign);
  elements.clearForm.addEventListener("click", clearForm);
  elements.clearTemplate.addEventListener("click", clearTemplate);
  elements.downloadExcel.addEventListener("click", downloadExcel);
  elements.videoHelpBtn.addEventListener("click", showModal);

  // Alert events
  elements.closeError.addEventListener("click", hideError);

  // Modal events
  elements.closeModal.addEventListener("click", hideModal);
  elements.closeModalBtn.addEventListener("click", hideModal);

  // Close modal when clicking outside
  elements.videoModal.addEventListener("click", (e) => {
    if (e.target === elements.videoModal) {
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
      addCampaign();
    }
  });

  // Form input events to clear errors
  const formInputs = [
    elements.productNumber,
    elements.sku,
    elements.asin,
    elements.videoId,
    elements.keywords,
  ];

  formInputs.forEach((input) => {
    input.addEventListener("input", hideError);
  });
};

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
  updateCampaignList();
});
