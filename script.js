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

  // Theme
  themeToggle: document.getElementById("themeToggle"),
  themeIcon: document.getElementById("themeIcon"),

  // Confirmation Modal
  confirmationModal: document.getElementById("confirmationModal"),
  closeConfirmationModal: document.getElementById("closeConfirmationModal"),
  confirmationMessage: document.getElementById("confirmationMessage"),
  cancelConfirmation: document.getElementById("cancelConfirmation"),
  confirmAction: document.getElementById("confirmAction"),

  // Edit Modal
  editModal: document.getElementById("editModal"),
  closeEditModal: document.getElementById("closeEditModal"),
  editModalTitle: document.getElementById("editModalTitle"),
  editModalMessage: document.getElementById("editModalMessage"),
  editModalInput: document.getElementById("editModalInput"),
  cancelEdit: document.getElementById("cancelEdit"),
  saveEdit: document.getElementById("saveEdit"),
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

  // Determine the action and style accordingly
  if (message.toLowerCase().includes("replaced")) {
    successSpan.innerHTML = `Campaign <strong style="color: #f59e0b; font-weight: 700;">REPLACED</strong> successfully!`;
  } else if (message.toLowerCase().includes("copied")) {
    successSpan.innerHTML = `Campaign <strong style="color: #2563eb; font-weight: 700;">COPIED</strong> to form!`;
  } else if (message.toLowerCase().includes("updated")) {
    successSpan.innerHTML = `Campaign <strong style="color: #059669; font-weight: 700;">UPDATED</strong> successfully!`;
  } else {
    successSpan.innerHTML = `Campaign <strong style="color: #16a34a; font-weight: 700;">ADDED</strong> successfully!`;
  }

  elements.successAlert.classList.remove("hidden");
  elements.errorAlert.classList.add("hidden");

  // Auto-hide after 4 seconds
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
                <svg class="drag-handle" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="cursor: grab;">
                    <circle cx="9" cy="12" r="1"></circle>
                    <circle cx="9" cy="5" r="1"></circle>
                    <circle cx="9" cy="19" r="1"></circle>
                    <circle cx="15" cy="12" r="1"></circle>
                    <circle cx="15" cy="5" r="1"></circle>
                    <circle cx="15" cy="19" r="1"></circle>
                </svg>
                <svg class="campaign-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
                <span class="campaign-name">${campaignId}</span>
            </div>
            <div class="campaign-actions">
              <button type="button" class="campaign-edit" title="Edit Budget" onclick="showEditModal('${campaignId}', 'budget')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </button>
              <button type="button" class="campaign-edit" title="Edit Bid" onclick="showEditModal('${campaignId}', 'bid')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </button>
              <button type="button" class="campaign-copy" title="Copy to form" onclick="copyCampaignToForm('${campaignId}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <button type="button" class="campaign-remove" title="Delete campaign" onclick="removeCampaign('${campaignId}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
              </button>
            </div>
        </div>
    `
    )
    .join("");
};

const removeCampaign = (campaignId) => {
  showConfirmation(
    `Are you sure you want to remove the campaign "${campaignId}"?`,
    () => {
      campaignData = campaignData.filter(
        (entry) => entry["Campaign Id"] !== campaignId
      );
      updateCampaignList();
    }
  );
};

// Make removeCampaign globally accessible
window.removeCampaign = removeCampaign;

const copyCampaignToForm = (campaignId) => {
  const campaign = campaignData.find((entry) => entry["Campaign Id"] === campaignId);
  if (!campaign) return;

  const campaignEntries = campaignData.filter(
    (entry) => entry["Campaign Id"] === campaignId
  );

  const mainCampaign = campaignEntries.find((e) => e.Entity === "Campaign");
  const keywords = campaignEntries
    .filter((e) => e.Entity === "Keyword")
    .map((e) => e["Keyword Text"]);
  const negativeKeywords = campaignEntries
    .filter((e) => e.Entity === "Negative Keyword")
    .map((e) => e["Keyword Text"]);

  if (mainCampaign) {
    const campaignIdParts = mainCampaign["Campaign Id"].split(" ");
    elements.productNumber.value = campaignIdParts[0] || "";
    elements.sku.value = campaignIdParts[1] || "";
    elements.portfolioId.value = mainCampaign["Portfolio Id"] || "";
    elements.asin.value = mainCampaign["Creative asins"] || "";
    elements.videoId.value = mainCampaign["Video Media Ids"] || "";
  }

  elements.keywords.value = keywords.join("\n");
  elements.negativeKeywords.value = negativeKeywords.join("\n");

  // Scroll to top to see the form has been populated
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Optional: Flash a success message
  showSuccess("Campaign copied to form!");
};
window.copyCampaignToForm = copyCampaignToForm;

// Edit Modal Functions
let editCallback = null;

const showEditModal = (campaignId, type) => {
  const campaign = campaignData.find((entry) => entry["Campaign Id"] === campaignId);
  if (!campaign) return;

  let currentValue;
  let message;
  let title;

  if (type === 'budget') {
    const campaignEntry = campaignData.find(c => c["Campaign Id"] === campaignId && c.Entity === "Campaign");
    currentValue = campaignEntry.Budget;
    title = "Edit Budget";
    message = `Current budget for "${campaignId}" is ${currentValue}. Enter the new budget:`;
    elements.editModalInput.step = "1";
  } else if (type === 'bid') {
    const keywordEntry = campaignData.find(c => c["Campaign Id"] === campaignId && c.Entity === "Keyword");
    currentValue = keywordEntry.Bid;
    title = "Edit Bid";
    message = `Current bid for all keywords in "${campaignId}" is ${currentValue}. Enter the new bid:`;
    elements.editModalInput.step = "0.01";
  }

  elements.editModalTitle.textContent = title;
  elements.editModalMessage.textContent = message;
  elements.editModalInput.value = currentValue;
  elements.editModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  editCallback = (newValue) => {
    if (type === 'budget') {
      campaignData.forEach(entry => {
        if (entry["Campaign Id"] === campaignId && entry.Entity === "Campaign") {
          entry.Budget = newValue;
        }
      });
    } else if (type === 'bid') {
      campaignData.forEach(entry => {
        if (entry["Campaign Id"] === campaignId && entry.Entity === "Keyword") {
          entry.Bid = newValue;
        }
      });
    }
    hideEditModal();
    showSuccess(`Successfully updated ${type} for "${campaignId}"!`);
  };
};
window.showEditModal = showEditModal;

const hideEditModal = () => {
  elements.editModal.classList.add("hidden");
  document.body.style.overflow = "unset";
  editCallback = null;
};

const saveEditAndHide = () => {
  const newValue = parseFloat(elements.editModalInput.value);
  if (editCallback && !isNaN(newValue)) {
    editCallback(newValue);
  }
};

// Drag and Drop Functionality

const initializeSortableList = () => {
  if (elements.campaignList) {
    new Sortable(elements.campaignList, {
      animation: 150,
      handle: ".drag-handle",
      ghostClass: "sortable-ghost",
      onEnd: (evt) => {
        const campaignId = evt.item.dataset.campaignId;
        const newIndex = evt.newIndex;
        const oldIndex = evt.oldIndex;

        if (newIndex === oldIndex) {
          return;
        }

        // Get all unique campaign IDs in their new order from the DOM
        const orderedCampaignIds = Array.from(
          elements.campaignList.querySelectorAll(".campaign-item")
        ).map((item) => item.dataset.campaignId);

        // Reorder the campaignData array to match the new visual order
        const reorderedCampaignData = [];
        orderedCampaignIds.forEach((id) => {
          const campaignEntries = campaignData.filter(
            (entry) => entry["Campaign Id"] === id
          );
          reorderedCampaignData.push(...campaignEntries);
        });

        campaignData = reorderedCampaignData;
      },
    });
  }
};

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
  showConfirmation("Are you sure you want to clear the form?", () => {
    elements.form.reset();
    hideError();
  });
};

const clearTemplate = () => {
  showConfirmation("Are you sure you want to clear the entire template?", () => {
    campaignData = [];
    updateCampaignList();
    hideError();
  });
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

// Confirmation Modal Functions
let confirmationCallback = null;

const showConfirmation = (message, callback) => {
  elements.confirmationMessage.textContent = message;
  elements.confirmationModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  confirmationCallback = callback;
};

const hideConfirmation = () => {
  elements.confirmationModal.classList.add("hidden");
  document.body.style.overflow = "unset";
  confirmationCallback = null;
};

const confirmAndHide = () => {
  if (confirmationCallback) {
    confirmationCallback();
  }
  hideConfirmation();
};

// Theme Functions
const setLightTheme = () => {
  document.body.classList.remove("dark-mode");
  elements.themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  localStorage.setItem("theme", "light");
};

const setDarkTheme = () => {
  document.body.classList.add("dark-mode");
  elements.themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
  localStorage.setItem("theme", "dark");
};

const toggleTheme = () => {
  if (document.body.classList.contains("dark-mode")) {
    setLightTheme();
  } else {
    setDarkTheme();
  }
};

const applyInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    setDarkTheme();
  } else {
    setLightTheme();
  }
};

// Event Listeners
const initializeEventListeners = () => {
  // Button events
  elements.addCampaign.addEventListener("click", addCampaign);
  elements.clearForm.addEventListener("click", clearForm);
  elements.clearTemplate.addEventListener("click", clearTemplate);
  elements.downloadExcel.addEventListener("click", downloadExcel);
  elements.videoHelpBtn.addEventListener("click", showModal);
  elements.themeToggle.addEventListener("click", toggleTheme);

  // Alert events
  elements.closeError.addEventListener("click", hideError);

  // Modal events
  elements.closeModal.addEventListener("click", hideModal);
  elements.closeModalBtn.addEventListener("click", hideModal);
  elements.closeConfirmationModal.addEventListener("click", hideConfirmation);
  elements.cancelConfirmation.addEventListener("click", hideConfirmation);
  elements.confirmAction.addEventListener("click", confirmAndHide);
  elements.closeEditModal.addEventListener("click", hideEditModal);
  elements.cancelEdit.addEventListener("click", hideEditModal);
  elements.saveEdit.addEventListener("click", saveEditAndHide);

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
  initializeSortableList();
  applyInitialTheme();
});
