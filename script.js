// Video Campaign Creator JavaScript

// Global variables
let campaignData = [];

// Default Excel columns
const sponsoredBrandsColumns = [
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

const sponsoredProductsColumns = [
  "Product",
  "Entity",
  "Operation",
  "Campaign ID",
  "Ad Group ID",
  "Portfolio ID",
  "Ad ID",
  "Keyword ID",
  "Product Targeting ID",
  "Campaign Name",
  "Ad Group Name",
  "Start Date",
  "End Date",
  "Targeting Type",
  "State",
  "Daily Budget",
  "SKU",
  "Ad Group Default Bid",
  "Bid",
  "Keyword Text",
  "Native Language Keyword",
  "Native Language Locale",
  "Match Type",
  "Bidding Strategy",
  "Placement",
  "Percentage",
  "Product Targeting Expression",
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
  exactKeywords: document.getElementById("exactKeywords"),
  phraseKeywords: document.getElementById("phraseKeywords"),
  broadKeywords: document.getElementById("broadKeywords"),
  negativeKeywords: document.getElementById("negativeKeywords"),
  negativeExactKeywords: document.getElementById("negativeExactKeywords"),
  negativePhraseKeywords: document.getElementById("negativePhraseKeywords"),

  // Buttons
  addCampaign: document.getElementById("addCampaign"),
  clearForm: document.getElementById("clearForm"),
  clearTemplate: document.getElementById("clearTemplate"),
  downloadExcel: document.getElementById("downloadExcel"),
  videoHelpBtn: document.getElementById("videoHelpBtn"),

  // Alerts
  errorAlert: document.getElementById("errorAlert"),
  successAlert: document.getElementById("successAlert"),
  warningAlert: document.getElementById("warningAlert"),
  errorMessage: document.getElementById("errorMessage"),
  warningMessage: document.getElementById("warningMessage"),
  closeError: document.getElementById("closeError"),
  closeWarning: document.getElementById("closeWarning"),

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
  editModalTextInput: document.getElementById("editModalTextInput"),
  editModalError: document.getElementById("editModalError"),
  cancelEdit: document.getElementById("cancelEdit"),
  saveEdit: document.getElementById("saveEdit"),

  // Auto Bid Inputs
  autoBidInputs: document.getElementById("autoBidInputs"),
  editLooseMatch: document.getElementById("editLooseMatch"),
  editCloseMatch: document.getElementById("editCloseMatch"),
  editComplements: document.getElementById("editComplements"),
  editSubstitutes: document.getElementById("editSubstitutes"),

  // Bidding Adjustment Inputs
  biddingAdjustmentInputs: document.getElementById("biddingAdjustmentInputs"),
  editPlacementTop: document.getElementById("editPlacementTop"),
  editPlacementRest: document.getElementById("editPlacementRest"),
  editPlacementProduct: document.getElementById("editPlacementProduct"),

  // SP Bid Inputs
  spBidInputs: document.getElementById("spBidInputs"),
  spAdGroupInputs: document.getElementById("spAdGroupInputs"),

  // Preview
  showSbPreview: document.getElementById("showSbPreview"),
  showSpPreview: document.getElementById("showSpPreview"),
  previewModal: document.getElementById("previewModal"),
  closePreviewModal: document.getElementById("closePreviewModal"),
  previewModalTitle: document.getElementById("previewModalTitle"),
  previewModalTable: document.getElementById("previewModalTable"),

  // Sections
  videoIdSection: document.getElementById("videoIdSection"),
  keywordsSection: document.getElementById("keywordsSection"),
  productTargetingSection: document.getElementById("productTargetingSection"),
  ptTargetingSection: document.getElementById("ptTargetingSection"),

  // Product Targeting Inputs
  looseMatch: document.getElementById("looseMatch"),
  closeMatch: document.getElementById("closeMatch"),
  complements: document.getElementById("complements"),
  substitutes: document.getElementById("substitutes"),
  competitorAsins: document.getElementById("competitorAsins"),

  // SP Keywords
  spKeywordsSection: document.getElementById("spKeywordsSection"),
  lv1Keywords: document.getElementById("lv1Keywords"),
  lv2Keywords: document.getElementById("lv2Keywords"),
  spNegativeKeywords: document.getElementById("spNegativeKeywords"),

  // Product Name
  productNameSection: document.getElementById("productNameSection"),
  productName: document.getElementById("productName"),
};

// UI Functions
const resetOptionalFields = () => {
  const fieldsToClear = [
    'keywords', 'exactKeywords', 'phraseKeywords', 'broadKeywords',
    'negativeKeywords', 'negativeExactKeywords', 'negativePhraseKeywords',
    'lv1Keywords', 'lv2Keywords', 'spNegativeKeywords',
    'competitorAsins', 'videoId', 'productName'
  ];
  fieldsToClear.forEach(field => {
    elements[field].value = '';
  });

  const bidsToReset = {
    'looseMatch': '0.25',
    'closeMatch': '0.25',
    'complements': '0.25',
    'substitutes': '0.25'
  };
  for (const [field, value] of Object.entries(bidsToReset)) {
    elements[field].value = value;
  }

  const tableBody = document.querySelector("#warningTable tbody");
  if (tableBody) {
    tableBody.innerHTML = "";
  }
  
  hideError();
  hideWarning();
};

const updateFormUI = () => {
  const campaignType = elements.campaignType.value;

  // resetOptionalFields();

  // Hide all optional sections first
  elements.videoIdSection.classList.add("hidden");
  elements.keywordsSection.classList.add("hidden");
  elements.productTargetingSection.classList.add("hidden");
  elements.ptTargetingSection.classList.add("hidden");
  document.getElementById("negativeKeywordsSection").classList.remove("hidden");
  document.getElementById("researchNegativeKeywordsSection").classList.add("hidden");
  document.getElementById("customKeywordsSection").classList.add("hidden");
  document.getElementById("keywords").parentElement.classList.remove("hidden");
  elements.spKeywordsSection.classList.add("hidden");
  document.getElementById("targetingKeywordsSection").classList.remove("hidden");
  elements.productNameSection.classList.add("hidden");

  if (campaignType === "auto") {
    elements.productTargetingSection.classList.remove("hidden");
    elements.keywordsSection.classList.remove("hidden");
    document.getElementById("negativeKeywordsSection").classList.add("hidden");
    document.getElementById("keywords").parentElement.classList.add("hidden");
    document.getElementById("researchNegativeKeywordsSection").classList.remove("hidden");
  } else if (campaignType === "pt") {
    elements.ptTargetingSection.classList.remove("hidden");
  } else if (campaignType === "video-pt") {
    elements.videoIdSection.classList.remove("hidden");
    elements.ptTargetingSection.classList.remove("hidden");
  } else if (campaignType.startsWith("video-")) {
    elements.videoIdSection.classList.remove("hidden");
    elements.keywordsSection.classList.remove("hidden");
    document.getElementById("negativeKeywordsSection").classList.add("hidden");
    document.getElementById("researchNegativeKeywordsSection").classList.remove("hidden");
  } else if (campaignType === "research") {
    elements.keywordsSection.classList.remove("hidden");
    document.getElementById("negativeKeywordsSection").classList.add("hidden");
    document.getElementById("researchNegativeKeywordsSection").classList.remove("hidden");
  } else if (campaignType === "custom") {
    elements.keywordsSection.classList.remove("hidden");
    document.getElementById("negativeKeywordsSection").classList.add("hidden");
    document.getElementById("researchNegativeKeywordsSection").classList.remove("hidden");
    document.getElementById("customKeywordsSection").classList.remove("hidden");
    document.getElementById("keywords").parentElement.classList.add("hidden");
  } else if (campaignType === "performance") {
    elements.keywordsSection.classList.remove("hidden");
    document.getElementById("negativeKeywordsSection").classList.add("hidden");
  } else if (campaignType === "sp") {
    elements.keywordsSection.classList.remove("hidden");
    document.getElementById("targetingKeywordsSection").classList.add("hidden");
    document.getElementById("negativeKeywordsSection").classList.add("hidden");
    elements.spKeywordsSection.classList.remove("hidden");
    elements.productNameSection.classList.remove("hidden");
  } else {
    elements.keywordsSection.classList.remove("hidden");
  }
};

// Utility Functions
const ensureDefaultColumns = (obj, type = "sb") => {
  const columns =
    type === "sp" ? sponsoredProductsColumns : sponsoredBrandsColumns;
  return Object.fromEntries(columns.map((key) => [key, obj[key] ?? ""]));
};

const getCurrentDate = () => {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
};

const getBrandEntityId = (country) => {
  return country === "US" ? "ENTITYCQP7AL92VN6L" : "ENTITY2DMN2Z7IO7RFX";
};

const campaignNameMap = {
  custom: "Product Number SKU - Custom",
  auto: "Product Number SKU - Auto",
  sp: "Product Number SKU SP",
  research: "Product Number SKU - Research",
  performance: "Product Number SKU - Performance",
  pt: "Product Number SKU PT",
  "video-broad": "Product Number SKU Video Ads Broad",
  "video-phrase": "Product Number SKU Video Ads Phrase",
  "video-exact": "Product Number SKU Video Ads Exact",
  "video-pt": "Product Number SKU Video Ads PT",
};

const createCampaignId = (productNumber, sku, campaignType) => {
  const template = campaignNameMap[campaignType];
  if (template) {
    return template
      .replace("Product Number", productNumber)
      .replace("SKU", sku);
  }

  // Fallback for any unmapped campaign types
  return `${productNumber} ${sku} ${
    campaignType.charAt(0).toUpperCase() + campaignType.slice(1)
  }`;
};

const validateRequiredFields = () => {
  const campaignType = elements.campaignType.value;
  const productNumber = elements.productNumber.value.trim();
  const sku = elements.sku.value.trim();
  const asin = elements.asin.value.trim();
  const videoId = elements.videoId.value.trim();
  const productName = elements.productName.value.trim();
  const errors = [];

  // Helper function to clean and validate keywords
  const processKeywords = (rawKeywords, keywordType) => {
    const valid = [];
    const invalid = [];
    const seen = new Set();
    const keywords = rawKeywords.trim().split('\n').filter(Boolean);
    const specialCharsRegex = /[!@#$%^*()_+={}\[\]|\\:;"<>,?\/~`]/;

    for (const kw of keywords) {
      const originalKw = kw;
      let cleanedKw = kw.trim();
      let reason = '';

      if (seen.has(cleanedKw)) {
        continue; // Silently ignore duplicates
      }
      seen.add(cleanedKw);

      if (specialCharsRegex.test(cleanedKw)) {
        reason = 'Contains special characters';
      } else {
        const wordCount = cleanedKw.split(/\s+/).filter(Boolean).length;
        if ((keywordType === 'Targeting' || keywordType === 'Negative Exact') && wordCount > 10) {
          reason = 'More than 10 words';
        } else if (keywordType === 'Negative Phrase' && wordCount > 4) {
          reason = 'More than 4 words';
        } else if (keywordType === 'Negative Exact' && cleanedKw.length >= 80) {
          reason = 'More than 80 characters';
        }
      }

      if (reason) {
        invalid.push({ keywordType, keyword: originalKw, reason });
      } else {
        valid.push(cleanedKw);
      }
    }
    return { valid, invalid };
  };

  const allInvalidKeywords = [];
  const processAndCollect = (element, type) => {
    // Only process visible fields
    if (element.offsetParent === null) {
      return [];
    }
    const result = processKeywords(element.value, type);
    allInvalidKeywords.push(...result.invalid);
    return result.valid;
  };

  // Deduplicate all keyword and ASIN fields
  const keywords = processAndCollect(elements.keywords, 'Targeting');
  const exactKeywords = processAndCollect(elements.exactKeywords, 'Targeting');
  const phraseKeywords = processAndCollect(elements.phraseKeywords, 'Targeting');
  const broadKeywords = processAndCollect(elements.broadKeywords, 'Targeting');
  const competitorAsins = [...new Set(elements.competitorAsins.value.trim().split("\n").filter(Boolean))];
  const negativeKeywords = processAndCollect(elements.negativeKeywords, 'Negative Phrase');
  const negativeExactKeywords = processAndCollect(elements.negativeExactKeywords, 'Negative Exact');
  const negativePhraseKeywords = processAndCollect(elements.negativePhraseKeywords, 'Negative Phrase');
  const lv1Keywords = processAndCollect(elements.lv1Keywords, 'Targeting');
  const lv2Keywords = processAndCollect(elements.lv2Keywords, 'Targeting');
  const spNegativeKeywords = processAndCollect(elements.spNegativeKeywords, 'Negative Phrase');

  if (!productNumber) {
    errors.push("Product Number is required");
  }

  if (campaignType === "sp" && !productName) {
    errors.push("Product Name is required for SP campaigns");
  }

  if (campaignType === "sp" && productNumber === productName) {
    errors.push("Product Number and Product Name must be different for SP campaigns");
  }

  if (!sku) {
    errors.push("SKU is required");
  }

  if (!asin) {
    errors.push("ASIN is required");
  }

  if (campaignType.startsWith("video-") && !videoId) {
    errors.push("Video Media ID is required");
  }

  if (campaignType === "pt" && competitorAsins.length === 0) {
    errors.push("At least one Competitor ASIN is required");
  }

  if (campaignType === "video-pt" && competitorAsins.length === 0) {
    errors.push("At least one Competitor ASIN is required");
  }

  if (campaignType === "custom" && exactKeywords.length === 0 && phraseKeywords.length === 0 && broadKeywords.length === 0) {
    errors.push("At least one targeting keyword is required for Custom campaign type");
  }

  if (campaignType !== "auto" && campaignType !== "pt" && campaignType !== "custom" && campaignType !== "sp" && campaignType !== "video-pt" && keywords.length === 0) {
    errors.push("At least one targeting keyword is required");
  }

  if (campaignType === "sp" && lv1Keywords.length === 0 && lv2Keywords.length === 0) {
    errors.push("At least one LV1 or LV2 keyword is required for SP campaigns");
  }

  return {
    isValid: errors.length === 0,
    data: {
      productNumber,
      sku,
      asin,
      videoId,
      productName,
      keywords,
      exactKeywords,
      phraseKeywords,
      broadKeywords,
      competitorAsins,
      negativeKeywords,
      negativeExactKeywords,
      negativePhraseKeywords,
      lv1Keywords,
      lv2Keywords,
      spNegativeKeywords,
      portfolioId: elements.portfolioId.value.trim(),
      country: elements.country.value,
      campaignType: elements.campaignType.value,
    },
    errors,
    warnings: allInvalidKeywords,
  };
};

// Alert Functions
const showError = (message) => {
  elements.errorMessage.innerHTML = message;
  elements.errorAlert.classList.remove("hidden");
  elements.successAlert.classList.add("hidden");
};

const hideError = () => {
  elements.errorAlert.classList.add("hidden");
};

const showWarning = (warnings) => {
  const tableBody = document.querySelector("#warningTable tbody");
  tableBody.innerHTML = ""; // Clear previous warnings

  warnings.forEach(warning => {
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = warning.keywordType;
    row.insertCell(1).textContent = warning.keyword;
    row.insertCell(2).textContent = warning.reason;
  });

  elements.warningAlert.classList.remove("hidden");
};

const hideWarning = () => {
  elements.warningAlert.classList.add("hidden");
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
const entityBuilder = {
  // SP Functions
  createSpCampaign(campaignId, portfolioId, today, budget, biddingStrategy, targetingType) {
    return ensureDefaultColumns({
      Product: "Sponsored Products",
      Entity: "Campaign",
      Operation: "Create",
      "Campaign ID": campaignId,
      "Portfolio ID": portfolioId,
      "Campaign Name": campaignId,
      "Start Date": today,
      "Targeting Type": targetingType,
      State: "Enabled",
      "Daily Budget": budget,
      "Bidding Strategy": biddingStrategy,
    }, "sp");
  },
  createSpBiddingAdjustment(campaignId, placement, percentage) {
    return ensureDefaultColumns({
      Product: "Sponsored Products",
      Entity: "Bidding adjustment",
      Operation: "Create",
      "Campaign ID": campaignId,
      Placement: placement,
      Percentage: percentage,
    }, "sp");
  },
  createSpAdGroup(campaignId, adGroupId, adGroupName, defaultBid) {
    return ensureDefaultColumns({
      Product: "Sponsored Products",
      Entity: "Ad group",
      Operation: "Create",
      "Campaign ID": campaignId,
      "Ad Group ID": adGroupId,
      "Ad Group Name": adGroupName,
      State: "Enabled",
      "Ad Group Default Bid": defaultBid,
    }, "sp");
  },
  createSpProductAd(campaignId, adGroupId, sku) {
    return ensureDefaultColumns({
      Product: "Sponsored Products",
      Entity: "Product ad",
      Operation: "Create",
      "Campaign ID": campaignId,
      "Ad Group ID": adGroupId,
      SKU: sku,
      State: "Enabled",
    }, "sp");
  },
  createSpKeyword(campaignId, adGroupId, keyword, matchType, bid) {
    return ensureDefaultColumns({
      Product: "Sponsored Products",
      Entity: "Keyword",
      Operation: "Create",
      "Campaign ID": campaignId,
      "Ad Group ID": adGroupId,
      State: "Enabled",
      Bid: bid,
      "Keyword Text": keyword,
      "Match Type": matchType,
    }, "sp");
  },
  createSpNegativeKeyword(campaignId, adGroupId, keyword, matchType) {
    return ensureDefaultColumns({
      Product: "Sponsored Products",
      Entity: "Negative keyword",
      Operation: "Create",
      "Campaign ID": campaignId,
      "Ad Group ID": adGroupId,
      State: "Enabled",
      "Keyword Text": keyword,
      "Match Type": matchType,
    }, "sp");
  },
  createSpCampaignNegativeKeyword(campaignId, keyword, matchType) {
    return ensureDefaultColumns({
      Product: "Sponsored Products",
      Entity: "Campaign negative keyword",
      Operation: "Create",
      "Campaign ID": campaignId,
      State: "Enabled",
      "Keyword Text": keyword,
      "Match Type": matchType,
    }, "sp");
  },
  createSpProductTargeting(campaignId, adGroupId, expression, bid) {
    return ensureDefaultColumns({
      Product: "Sponsored Products",
      Entity: "Product targeting",
      Operation: "Create",
      "Campaign ID": campaignId,
      "Ad Group ID": adGroupId,
      State: "Enabled",
      Bid: bid,
      "Product Targeting Expression": expression,
    }, "sp");
  },
  createSpNegativeProductTargeting(campaignId, adGroupId, expression) {
    return ensureDefaultColumns({
      Product: "Sponsored Products",
      Entity: "Negative product targeting",
      Operation: "Create",
      "Campaign ID": campaignId,
      "Ad Group ID": adGroupId,
      State: "Enabled",
      "Product Targeting Expression": expression,
    }, "sp");
  },

  // SB Functions
  createSbCampaign(campaignId, portfolioId, today, budget, brandEntityId, asin, videoId) {
    return ensureDefaultColumns({
      Product: "Sponsored Brands",
      Entity: "Campaign",
      Operation: "Create",
      "Campaign Id": campaignId,
      "Portfolio Id": portfolioId,
      "Campaign Name": campaignId,
      "Start Date": today,
      State: "Enabled",
      "Budget Type": "Daily",
      Budget: budget,
      "Bid Optimization": "Auto",
      "Ad Format": "video",
      "Brand Entity Id": brandEntityId,
      "Brand Name": "BlueStars",
      "Creative asins": asin,
      "Video Media Ids": videoId,
      "Creative Type": "video",
    }, "sb");
  },
  createSbKeyword(campaignId, keyword, matchType, bid) {
    return ensureDefaultColumns({
      Product: "Sponsored Brands",
      Entity: "Keyword",
      Operation: "Create",
      "Campaign Id": campaignId,
      State: "Enabled",
      Bid: bid,
      "Keyword Text": keyword,
      "Match Type": matchType,
    }, "sb");
  },
  createSbNegativeKeyword(campaignId, keyword, matchType) {
    return ensureDefaultColumns({
      Product: "Sponsored Brands",
      Entity: "Negative Keyword",
      Operation: "Create",
      "Campaign Id": campaignId,
      State: "Enabled",
      "Keyword Text": keyword,
      "Match Type": matchType,
    }, "sb");
  },
  createSbProductTargeting(campaignId, expression, bid) {
    return ensureDefaultColumns({
      Product: "Sponsored Brands",
      Entity: "Product targeting",
      Operation: "Create",
      "Campaign Id": campaignId,
      State: "Enabled",
      Bid: bid,
      "Product Targeting Expression": expression,
    }, "sb");
  },
  createSbNegativeProductTargeting(campaignId, expression) {
    return ensureDefaultColumns({
      Product: "Sponsored Brands",
      Entity: "Negative product targeting",
      Operation: "Create",
      "Campaign Id": campaignId,
      State: "Enabled",
      "Product Targeting Expression": expression,
    }, "sb");
  },
};

const getKeywordPhraseCount = (keyword, keywordList) => {
  return keywordList.filter(phrase => phrase.includes(keyword)).length;
};

const addCampaignToCampaignData = (formData) => {
  const {
    productNumber,
    sku,
    asin,
    videoId,
    keywords,
    exactKeywords,
    phraseKeywords,
    broadKeywords,
    competitorAsins,
    negativeKeywords,
    negativeExactKeywords,
    negativePhraseKeywords,
    lv1Keywords,
    lv2Keywords,
    spNegativeKeywords,
    portfolioId,
    country,
    campaignType,
    productName,
  } = formData;

  const today = getCurrentDate();
  const campaignId = createCampaignId(productNumber, sku, campaignType);
  const brandEntityId = getBrandEntityId(country);

  // Check if campaign already exists and find its position
  const existingCampaignIndex = campaignData.findIndex(
    (entry) => (entry["Campaign Id"] || entry["Campaign ID"]) === campaignId
  );
  const isReplacement = existingCampaignIndex !== -1;
  let insertPosition = campaignData.length; // Default to end

  // If replacing, find the position of the first entry for this campaign
  if (isReplacement) {
    insertPosition = existingCampaignIndex;
    // Remove all existing entries for this campaign
    campaignData = campaignData.filter(
      (entry) => (entry["Campaign Id"] || entry["Campaign ID"]) !== campaignId
    );
  }

  // Prepare new campaign data
  const newCampaignData = [];
  const spLevel = document.querySelector('input[name="spLevel"]:checked').value;

  if (campaignType === "auto") {
    const looseMatchBid = parseFloat(elements.looseMatch.value) || 0;
    const closeMatchBid = parseFloat(elements.closeMatch.value) || 0;
    const complementsBid = parseFloat(elements.complements.value) || 0;
    const substitutesBid = parseFloat(elements.substitutes.value) || 0;

    const maxBid = Math.max(
      looseMatchBid,
      closeMatchBid,
      complementsBid,
      substitutesBid
    );

    const spCampaign = entityBuilder.createSpCampaign(campaignId, portfolioId, today, 10, "Dynamic bids - down only", "Auto");
    spCampaign.campaignType = campaignType;
    spCampaign.country = country;
    spCampaign.asin = asin;
    newCampaignData.push(spCampaign);
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement top", 0));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement rest of search", 0));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement product page", 0));
    newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, "Auto", "Auto", maxBid));
    newCampaignData.push(entityBuilder.createSpProductAd(campaignId, "Auto", sku));
    newCampaignData.push(entityBuilder.createSpProductTargeting(campaignId, "Auto", "loose-match", looseMatchBid));
    newCampaignData.push(entityBuilder.createSpProductTargeting(campaignId, "Auto", "close-match", closeMatchBid));
    newCampaignData.push(entityBuilder.createSpProductTargeting(campaignId, "Auto", "complements", complementsBid));
    newCampaignData.push(entityBuilder.createSpProductTargeting(campaignId, "Auto", "substitutes", substitutesBid));
    negativeExactKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpNegativeKeyword(campaignId, "Auto", keyword, "negativeExact"));
    });
    negativePhraseKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpNegativeKeyword(campaignId, "Auto", keyword, "negativePhrase"));
    });
  } else if (campaignType === "custom") {
    const spCampaign = entityBuilder.createSpCampaign(campaignId, portfolioId, today, 10, "Dynamic bids - down only", "Manual");
    spCampaign.campaignType = campaignType;
    spCampaign.country = country;
    spCampaign.asin = asin;
    newCampaignData.push(spCampaign);
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement top", 0));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement rest of search", 0));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement product page", 0));
    newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, "Custom", "Custom", 0.25));
    newCampaignData.push(entityBuilder.createSpProductAd(campaignId, "Custom", sku));
    exactKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpKeyword(campaignId, "Custom", keyword, "exact", 0.25));
    });
    phraseKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpKeyword(campaignId, "Custom", keyword, "phrase", 0.25));
    });
    broadKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpKeyword(campaignId, "Custom", keyword, "broad", 0.25));
    });
    negativeExactKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpNegativeKeyword(campaignId, "Custom", keyword, "negativeExact"));
    });
    negativePhraseKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpNegativeKeyword(campaignId, "Custom", keyword, "negativePhrase"));
    });
  } else if (campaignType === "research") {
    const spCampaign = entityBuilder.createSpCampaign(campaignId, portfolioId, today, 10, "Dynamic bids - down only", "Manual");
    spCampaign.campaignType = campaignType;
    spCampaign.country = country;
    spCampaign.asin = asin;
    newCampaignData.push(spCampaign);
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement top", 0));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement rest of search", 0));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement product page", 0));
    newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, "Research", "Research", 0.25));
    newCampaignData.push(entityBuilder.createSpProductAd(campaignId, "Research", sku));
    keywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpKeyword(campaignId, "Research", keyword, "broad", 0.25));
    });
    negativeExactKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpNegativeKeyword(campaignId, "Research", keyword, "negativeExact"));
    });
    negativePhraseKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpNegativeKeyword(campaignId, "Research", keyword, "negativePhrase"));
    });
  } else if (campaignType === "performance") {
    const spCampaign = entityBuilder.createSpCampaign(campaignId, portfolioId, today, 10, "Dynamic bids - down only", "Manual");
    spCampaign.campaignType = campaignType;
    spCampaign.country = country;
    spCampaign.asin = asin;
    newCampaignData.push(spCampaign);
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement top", 0));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement rest of search", 0));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement product page", 0));
    newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, "Performance", "Performance", 0.5));
    newCampaignData.push(entityBuilder.createSpProductAd(campaignId, "Performance", sku));
    keywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpKeyword(campaignId, "Performance", keyword, "exact", 0.5));
    });
  } else if (campaignType === "pt") {
    const spCampaign = entityBuilder.createSpCampaign(campaignId, portfolioId, today, 10, "Dynamic bids - down only", "Manual");
    spCampaign.campaignType = campaignType;
    spCampaign.country = country;
    spCampaign.asin = asin;
    newCampaignData.push(spCampaign);
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement top", 50));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement rest of search", 0));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement product page", 0));
    newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, "PT", "PT", 0.25));
    newCampaignData.push(entityBuilder.createSpProductAd(campaignId, "PT", sku));
    competitorAsins.forEach((asin) => {
      newCampaignData.push(entityBuilder.createSpProductTargeting(campaignId, "PT", `asin="${asin}"`, 0.25));
    });
  } else if (campaignType === "video-pt") {
    const sbCampaign = entityBuilder.createSbCampaign(campaignId, portfolioId, today, 10, brandEntityId, asin, videoId);
    sbCampaign.campaignType = campaignType;
    sbCampaign.country = country;
    newCampaignData.push(sbCampaign);
    competitorAsins.forEach((asin) => {
      newCampaignData.push(entityBuilder.createSbProductTargeting(campaignId, `asin="${asin}"`, 0.25));
    });
  } else if (campaignType.startsWith("video-")) {
    const sbCampaign = entityBuilder.createSbCampaign(campaignId, portfolioId, today, 10, brandEntityId, asin, videoId);
    sbCampaign.campaignType = campaignType;
    sbCampaign.country = country;
    newCampaignData.push(sbCampaign);
    keywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSbKeyword(campaignId, keyword, campaignType.replace("video-", ""), 0.25));
    });
    negativeExactKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSbNegativeKeyword(campaignId, keyword, "negativeExact"));
    });
    negativePhraseKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSbNegativeKeyword(campaignId, keyword, "negativePhrase"));
    });
  } else if (campaignType === "sp") {
    const spCampaign = entityBuilder.createSpCampaign(campaignId, portfolioId, today, 10, "Dynamic bids - down only", "Manual");
    spCampaign.campaignType = campaignType;
    spCampaign.country = country;
    spCampaign.productName = productName;
    spCampaign.spLevel = spLevel;
    spCampaign.asin = asin;
    newCampaignData.push(spCampaign);

    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement top", 50));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement rest of search", 0));
    newCampaignData.push(entityBuilder.createSpBiddingAdjustment(campaignId, "placement product page", 0));

    spNegativeKeywords.forEach((keyword) => {
      newCampaignData.push(entityBuilder.createSpCampaignNegativeKeyword(campaignId, keyword, "negativePhrase"));
    });

    if (spLevel === 'lv1-lv2') { //lv1/lv2
      // LV1 Ad Group (based on productNumber)
      const lv1AdGroup = `${productNumber} - LV1`;
      newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, lv1AdGroup, lv1AdGroup, 0.5));
      newCampaignData.push(entityBuilder.createSpProductAd(campaignId, lv1AdGroup, sku));

      lv1Keywords.forEach(keyword => {
          newCampaignData.push(entityBuilder.createSpKeyword(campaignId, lv1AdGroup, keyword, "phrase", 0.5));
      });

      // LV2 Ad Group (based on productName)
      if (lv2Keywords.length > 0) {
        const lv2AdGroup = `${productName} - LV2`;
        newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, lv2AdGroup, lv2AdGroup, 0.5));
        newCampaignData.push(entityBuilder.createSpProductAd(campaignId, lv2AdGroup, sku));

        lv2Keywords.forEach(keyword => {
            newCampaignData.push(entityBuilder.createSpKeyword(campaignId, lv2AdGroup, keyword, "phrase", 0.5));
        });
      }
    
    } else { // gnr/gnr2/spf
      const lv1Classified = lv1Keywords.map(kw => {
        const wordCount = kw.split(/\s+/).length;
        const phraseCount = getKeywordPhraseCount(kw, lv1Keywords);
        if (wordCount === 1) return { keyword: kw, class: "LV1 - GNR" };
        if (wordCount === 2 || (wordCount >= 3 && phraseCount >= 2)) return { keyword: kw, class: "LV1 - GNR2" };
        return { keyword: kw, class: "LV1 - SPF" };
      });

      const lv2Classified = lv2Keywords.map(kw => {
        const wordCount = kw.split(/\s+/).length;
        const phraseCount = getKeywordPhraseCount(kw, lv2Keywords);
        if (wordCount === 3 || phraseCount > 10) return { keyword: kw, class: "LV2 - GNR" };
        if (phraseCount >= 2 && phraseCount <= 10) return { keyword: kw, class: "LV2 - GNR2" };
        return { keyword: kw, class: "LV2 - SPF" };
      });

      // LV1 Ad Groups
      const lv1GnrAdGroup = `${productNumber} - GNR`;
      newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, lv1GnrAdGroup, lv1GnrAdGroup, 0.5));
      newCampaignData.push(entityBuilder.createSpProductAd(campaignId, lv1GnrAdGroup, sku));
      lv1Classified.filter(item => item.class === "LV1 - GNR").forEach(item => {
        newCampaignData.push(entityBuilder.createSpKeyword(campaignId, lv1GnrAdGroup, item.keyword, "phrase", 0.5));
      });
      lv1Classified.filter(item => item.class !== "LV1 - GNR").forEach(item => {
        newCampaignData.push(entityBuilder.createSpNegativeKeyword(campaignId, lv1GnrAdGroup, item.keyword, "negativePhrase"));
      });

      const lv1Gnr2AdGroup = `${productNumber} - GNR2`;
      newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, lv1Gnr2AdGroup, lv1Gnr2AdGroup, 0.5));
      newCampaignData.push(entityBuilder.createSpProductAd(campaignId, lv1Gnr2AdGroup, sku));
      lv1Classified.filter(item => item.class === "LV1 - GNR2").forEach(item => {
        newCampaignData.push(entityBuilder.createSpKeyword(campaignId, lv1Gnr2AdGroup, item.keyword, "phrase", 0.5));
      });
      lv1Classified.filter(item => item.class === "LV1 - SPF").forEach(item => {
        newCampaignData.push(entityBuilder.createSpNegativeKeyword(campaignId, lv1Gnr2AdGroup, item.keyword, "negativePhrase"));
      });

      const lv1SpfAdGroup = `${productNumber} - SPF`;
      newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, lv1SpfAdGroup, lv1SpfAdGroup, 0.5));
      newCampaignData.push(entityBuilder.createSpProductAd(campaignId, lv1SpfAdGroup, sku));
      lv1Classified.filter(item => item.class === "LV1 - SPF").forEach(item => {
        newCampaignData.push(entityBuilder.createSpKeyword(campaignId, lv1SpfAdGroup, item.keyword, "phrase", 0.5));
      });

      // LV2 Ad Groups
      if (lv2Keywords.length > 0) {
        const lv2GnrAdGroup = `${productName} - GNR`;
        newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, lv2GnrAdGroup, lv2GnrAdGroup, 0.5));
        newCampaignData.push(entityBuilder.createSpProductAd(campaignId, lv2GnrAdGroup, sku));
        lv2Classified.filter(item => item.class === "LV2 - GNR").forEach(item => {
          newCampaignData.push(entityBuilder.createSpKeyword(campaignId, lv2GnrAdGroup, item.keyword, "phrase", 0.5));
        });
        lv2Classified.filter(item => item.class !== "LV2 - GNR").forEach(item => {
          newCampaignData.push(entityBuilder.createSpNegativeKeyword(campaignId, lv2GnrAdGroup, item.keyword, "negativePhrase"));
        });

        const lv2Gnr2AdGroup = `${productName} - GNR2`;
        newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, lv2Gnr2AdGroup, lv2Gnr2AdGroup, 0.5));
        newCampaignData.push(entityBuilder.createSpProductAd(campaignId, lv2Gnr2AdGroup, sku));
        lv2Classified.filter(item => item.class === "LV2 - GNR2").forEach(item => {
          newCampaignData.push(entityBuilder.createSpKeyword(campaignId, lv2Gnr2AdGroup, item.keyword, "phrase", 0.5));
        });
        lv2Classified.filter(item => item.class === "LV2 - SPF").forEach(item => {
          newCampaignData.push(entityBuilder.createSpNegativeKeyword(campaignId, lv2Gnr2AdGroup, item.keyword, "negativePhrase"));
        });

        const lv2SpfAdGroup = `${productName} - SPF`;
        newCampaignData.push(entityBuilder.createSpAdGroup(campaignId, lv2SpfAdGroup, lv2SpfAdGroup, 0.5));
        newCampaignData.push(entityBuilder.createSpProductAd(campaignId, lv2SpfAdGroup, sku));
        lv2Classified.filter(item => item.class === "LV2 - SPF").forEach(item => {
          newCampaignData.push(entityBuilder.createSpKeyword(campaignId, lv2SpfAdGroup, item.keyword, "phrase", 0.5));
        });
      }
    }
  }

  // Insert new campaign data at the correct position
  campaignData.splice(insertPosition, 0, ...newCampaignData);

  return { campaignId, isReplacement };
};

const updateCampaignList = () => {
  // Get unique campaign IDs in the order they appear in campaignData
  const campaignIds = [];
  const seen = new Set();

  campaignData.forEach((entry) => {
    const campaignId = entry["Campaign Id"] || entry["Campaign ID"];
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
    .map((campaignId) => {
      const campaign = campaignData.find(
        (entry) => (entry["Campaign Id"] || entry["Campaign ID"]) === campaignId
      );
      const hasAdGroup = campaignData.some(
        (entry) =>
          (entry["Campaign Id"] || entry["Campaign ID"]) === campaignId &&
          entry.Entity === "Ad group"
      );

      return `
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
              <button type="button" class="campaign-edit" title="Edit Campaign Name" onclick="showEditModal('${campaignId}', 'name')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              ${hasAdGroup ? `
              <button type="button" class="campaign-edit" title="Edit Ad Group Name" onclick="showEditModal('${campaignId}', 'adGroup')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </button>
              ` : ''}
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
              ${campaign.Product === 'Sponsored Products' ? `
              <button type="button" class="campaign-edit" title="Edit Bidding Adjustment" onclick="showEditModal('${campaignId}', 'bidding')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="5" x2="5" y2="19"></line>
                    <circle cx="6.5" cy="6.5" r="2.5"></circle>
                    <circle cx="17.5" cy="17.5" r="2.5"></circle>
                </svg>
              </button>
              ` : ''}
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
    `;
    })
    .join("");
};

const removeCampaign = (campaignId) => {
  showConfirmation(
    `Are you sure you want to remove the campaign "${campaignId}"?`,
    () => {
      campaignData = campaignData.filter(
        (entry) => (entry["Campaign Id"] || entry["Campaign ID"]) !== campaignId
      );
      updateCampaignList();
    }
  );
};

// Make removeCampaign globally accessible
window.removeCampaign = removeCampaign;

const copyCampaignToForm = (campaignId) => {
  const campaignEntries = campaignData.filter(
    (entry) => (entry["Campaign Id"] || entry["Campaign ID"]) === campaignId
  );
  const mainCampaign = campaignEntries.find((e) => e.Entity === "Campaign");

  if (!mainCampaign) return;

  // Reset form before populating
  resetOptionalFields();
  
  const {
    campaignType,
    country,
    productName,
    spLevel,
    "Portfolio Id": portfolioId,
    "Portfolio ID": portfolioID,
    "Video Media Ids": videoId,
    "Creative asins": creativeAsins,
    asin: spAsin,
  } = mainCampaign;

  elements.campaignType.value = campaignType;
  updateFormUI(); // This will show the correct sections

  elements.country.value = country || 'US';
  elements.productNumber.value = (mainCampaign["Campaign Name"] || campaignId).split(" ")[0] || "";
  elements.sku.value = (mainCampaign["SKU"] || (mainCampaign["Campaign Name"] || campaignId).split(" ")[1]) || "";
  elements.portfolioId.value = portfolioId || portfolioID || "";
  elements.asin.value = spAsin || creativeAsins || "";

  if (campaignType === 'video-pt') {
    elements.videoId.value = videoId || "";
    elements.competitorAsins.value = campaignEntries
      .filter(e => e.Entity === 'Product targeting' && e["Product Targeting Expression"].startsWith('asin="'))
      .map(e => e["Product Targeting Expression"].replace(/asin=|"/g, "")).join('\n');
  }
  else if (campaignType.startsWith("video-")) {
    elements.videoId.value = videoId || "";
    elements.keywords.value = campaignEntries
      .filter(e => e.Entity === 'Keyword')
      .map(e => e['Keyword Text']).join('\n');
    elements.negativeExactKeywords.value = campaignEntries.filter(e => e.Entity === 'Negative Keyword' && e['Match Type'] === 'negativeExact').map(e => e['Keyword Text']).join('\n');
    elements.negativePhraseKeywords.value = campaignEntries.filter(e => e.Entity === 'Negative Keyword' && e['Match Type'] === 'negativePhrase').map(e => e['Keyword Text']).join('\n');
  } else if (campaignType === 'auto') {
    const targetingBids = campaignEntries
      .filter(e => e.Entity === 'Product targeting')
      .reduce((acc, e) => {
        acc[e["Product Targeting Expression"]] = e.Bid;
        return acc;
      }, {});
    elements.looseMatch.value = targetingBids['loose-match'] || "0.25";
    elements.closeMatch.value = targetingBids['close-match'] || "0.25";
    elements.complements.value = targetingBids['complements'] || "0.25";
    elements.substitutes.value = targetingBids['substitutes'] || "0.25";
    elements.negativeExactKeywords.value = campaignEntries.filter(e => e.Entity === 'Negative keyword' && e['Match Type'] === 'negativeExact').map(e => e['Keyword Text']).join('\n');
    elements.negativePhraseKeywords.value = campaignEntries.filter(e => e.Entity === 'Negative keyword' && e['Match Type'] === 'negativePhrase').map(e => e['Keyword Text']).join('\n');
  } else if (campaignType === 'pt') {
    elements.competitorAsins.value = campaignEntries
      .filter(e => e.Entity === 'Product targeting' && e["Product Targeting Expression"].startsWith('asin="'))
      .map(e => e["Product Targeting Expression"].replace(/asin=|"/g, "")).join('\n');
  } else if (campaignType === 'custom') {
    elements.exactKeywords.value = campaignEntries.filter(e => e.Entity === 'Keyword' && e['Match Type'] === 'exact').map(e => e['Keyword Text']).join('\n');
    elements.phraseKeywords.value = campaignEntries.filter(e => e.Entity === 'Keyword' && e['Match Type'] === 'phrase').map(e => e['Keyword Text']).join('\n');
    elements.broadKeywords.value = campaignEntries.filter(e => e.Entity === 'Keyword' && e['Match Type'] === 'broad').map(e => e['Keyword Text']).join('\n');
    elements.negativeExactKeywords.value = campaignEntries.filter(e => e.Entity === 'Negative keyword' && e['Match Type'] === 'negativeExact').map(e => e['Keyword Text']).join('\n');
    elements.negativePhraseKeywords.value = campaignEntries.filter(e => e.Entity === 'Negative keyword' && e['Match Type'] === 'negativePhrase').map(e => e['Keyword Text']).join('\n');
  } else if (campaignType === 'research') {
    elements.keywords.value = campaignEntries.filter(e => e.Entity === 'Keyword' && e['Match Type'] === 'broad').map(e => e['Keyword Text']).join('\n');
    elements.negativeExactKeywords.value = campaignEntries.filter(e => e.Entity === 'Negative keyword' && e['Match Type'] === 'negativeExact').map(e => e['Keyword Text']).join('\n');
    elements.negativePhraseKeywords.value = campaignEntries.filter(e => e.Entity === 'Negative keyword' && e['Match Type'] === 'negativePhrase').map(e => e['Keyword Text']).join('\n');
  } else if (campaignType === 'performance') {
    elements.keywords.value = campaignEntries.filter(e => e.Entity === 'Keyword' && e['Match Type'] === 'exact').map(e => e['Keyword Text']).join('\n');
  } else if (campaignType === 'sp') {
    elements.productName.value = productName || '';
    document.querySelector(`input[name="spLevel"][value="${spLevel}"]`).checked = true;
    
    const adGroups = campaignEntries.filter(e => e.Entity === 'Ad group');
    const lv1AdGroup = adGroups.find(ag => ag['Ad Group Name'].endsWith(' - LV1'));
    const lv2AdGroup = adGroups.find(ag => ag['Ad Group Name'].endsWith(' - LV2'));

    if (lv1AdGroup) {
      elements.lv1Keywords.value = campaignEntries.filter(e => e.Entity === 'Keyword' && e['Ad Group ID'] === lv1AdGroup['Ad Group ID']).map(e => e['Keyword Text']).join('\n');
    }
    if (lv2AdGroup) {
      elements.lv2Keywords.value = campaignEntries.filter(e => e.Entity === 'Keyword' && e['Ad Group ID'] === lv2AdGroup['Ad Group ID']).map(e => e['Keyword Text']).join('\n');
    } else {
      // Handle GNR case if needed by inspecting ad group names
      const gnrAdGroups = adGroups.filter(ag => ag['Ad Group Name'].includes(' - GNR') || ag['Ad Group Name'].includes(' - SPF'));
      const lv1KeywordsGNR = [];
      const lv2KeywordsGNR = [];
      gnrAdGroups.forEach(ag => {
        const keywords = campaignEntries.filter(e => e.Entity === 'Keyword' && e['Ad Group ID'] === ag['Ad Group ID']).map(e => e['Keyword Text']);
        if (ag['Ad Group Name'].startsWith(elements.productNumber.value)) {
          lv1KeywordsGNR.push(...keywords);
        } else if (ag['Ad Group Name'].startsWith(productName)) {
          lv2KeywordsGNR.push(...keywords);
        }
      });
      elements.lv1Keywords.value = [...new Set(lv1KeywordsGNR)].join('\n');
      elements.lv2Keywords.value = [...new Set(lv2KeywordsGNR)].join('\n');
    }
    
    elements.spNegativeKeywords.value = campaignEntries.filter(e => e.Entity === 'Campaign negative keyword').map(e => e['Keyword Text']).join('\n');
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  showSuccess("Campaign copied to form!");
};
window.copyCampaignToForm = copyCampaignToForm;

// Edit Modal Functions
let editCallback = null;

const showEditModal = (campaignId, type) => {
  const campaignEntry = campaignData.find(
    (c) =>
      (c["Campaign Id"] || c["Campaign ID"]) === campaignId &&
      c.Entity === "Campaign"
  );
  if (!campaignEntry) return;

  let message;
  let title;
  const isAutoCampaign =
    campaignEntry.Product === "Sponsored Products" &&
    campaignEntry["Targeting Type"] === "Auto";

  const isPtCampaign = campaignEntry.campaignType === 'pt' || campaignEntry.campaignType === 'video-pt';

  const hasAdGroup = campaignData.some(
    (entry) =>
      (entry["Campaign Id"] || entry["Campaign ID"]) === campaignId &&
      entry.Entity === "Ad group"
  );

  // Hide all inputs first
  elements.editModalInput.classList.add("hidden");
  elements.autoBidInputs.classList.add("hidden");
  elements.editModalTextInput.classList.add("hidden");
  elements.biddingAdjustmentInputs.classList.add("hidden");
  elements.spBidInputs.classList.add("hidden");
  elements.spBidInputs.innerHTML = "";
  elements.spAdGroupInputs.classList.add("hidden");
  elements.spAdGroupInputs.innerHTML = "";

  if (type === "name") {
    title = "Edit Campaign Name";
    message = `Enter the new name for "${campaignId}":`;
    elements.editModalTextInput.value = campaignId;
    elements.editModalTextInput.classList.remove("hidden");
  } else if (type === "budget") {
    const currentValue = campaignEntry.Budget || campaignEntry["Daily Budget"];
    title = "Edit Budget";
    message = `Current budget for "${campaignId}" is ${currentValue}. Enter the new budget:`;
    elements.editModalInput.step = "1";
    elements.editModalInput.value = currentValue;
    elements.editModalInput.classList.remove("hidden");
  } else if (type === "bid") {
    title = "Edit Bid";
    if (isAutoCampaign) {
      const targetingEntries = campaignData.filter(
        (c) =>
          (c["Campaign Id"] || c["Campaign ID"]) === campaignId &&
          c.Entity === "Product targeting"
      );

      const bids = {
        "loose-match": 0,
        "close-match": 0,
        complements: 0,
        substitutes: 0,
      };

      targetingEntries.forEach((entry) => {
        bids[entry["Product Targeting Expression"]] = entry.Bid;
      });

      message = `Edit bids for "${campaignId}":`;
      elements.editLooseMatch.value = bids["loose-match"];
      elements.editCloseMatch.value = bids["close-match"];
      elements.editComplements.value = bids.complements;
      elements.editSubstitutes.value = bids.substitutes;
      elements.autoBidInputs.classList.remove("hidden");
    } else if (isPtCampaign) {
      const targetingEntry = campaignData.find(
        (c) =>
          (c["Campaign Id"] || c["Campaign ID"]) === campaignId &&
          c.Entity === "Product targeting"
      );
      const currentValue = targetingEntry ? targetingEntry.Bid : 0;
      message = `Current bid for all targets in "${campaignId}" is ${currentValue}. Enter the new bid:`;
      elements.editModalInput.step = "0.01";
      elements.editModalInput.value = currentValue;
      elements.editModalInput.classList.remove("hidden");
    } else if (hasAdGroup) {
      const adGroupEntries = campaignData.filter(
        (c) =>
          (c["Campaign Id"] || c["Campaign ID"]) === campaignId &&
          c.Entity === "Ad group"
      );

      message = `Edit bids for ad groups in "${campaignId}":`;
      elements.spBidInputs.classList.remove("hidden");
      const adGroupBidsGrid = document.createElement('div');
      adGroupBidsGrid.className = 'form-grid-2';

      adGroupEntries.forEach(adGroup => {
        const adGroupId = adGroup["Ad Group ID"];
        const adGroupName = adGroup["Ad Group Name"];
        const currentBid = adGroup["Ad Group Default Bid"];
        
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.for = `edit-bid-${adGroupId}`;
        label.textContent = adGroupName;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `edit-bid-${adGroupId}`;
        input.className = 'form-control';
        input.step = '0.01';
        input.value = currentBid;
        input.dataset.adGroupId = adGroupId;

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        adGroupBidsGrid.appendChild(formGroup);
      });
      elements.spBidInputs.appendChild(adGroupBidsGrid);
    } else {
      const keywordEntry = campaignData.find(
        (c) =>
          (c["Campaign Id"] || c["Campaign ID"]) === campaignId &&
          c.Entity === "Keyword"
      );
      const currentValue = keywordEntry ? keywordEntry.Bid : 0;
      message = `Current bid for all keywords in "${campaignId}" is ${currentValue}. Enter the new bid:`;
      elements.editModalInput.step = "0.01";
      elements.editModalInput.value = currentValue;
      elements.editModalInput.classList.remove("hidden");
    }
  } else if (type === "bidding") {
    title = "Edit Bidding Adjustments";
    message = `Edit bidding adjustments for "${campaignId}":`;

    const biddingEntries = campaignData.filter(
      (c) =>
        (c["Campaign Id"] || c["Campaign ID"]) === campaignId &&
        c.Entity === "Bidding adjustment"
    );

    const adjustments = {
      "placement top": 0,
      "placement rest of search": 0,
      "placement product page": 0,
    };

    biddingEntries.forEach((entry) => {
      adjustments[entry.Placement] = entry.Percentage;
    });

    elements.editPlacementTop.value = adjustments["placement top"];
    elements.editPlacementRest.value = adjustments["placement rest of search"];
    elements.editPlacementProduct.value = adjustments["placement product page"];
    elements.biddingAdjustmentInputs.classList.remove("hidden");
  } else if (type === "adGroup") {
    title = "Edit Ad Group Names";
    message = `Edit ad group names for "${campaignId}":`;
    elements.spAdGroupInputs.classList.remove("hidden");
    const adGroupGrid = document.createElement('div');
    adGroupGrid.className = 'form-grid-2';

    const adGroupEntries = campaignData.filter(
      (c) =>
        (c["Campaign Id"] || c["Campaign ID"]) === campaignId &&
        c.Entity === "Ad group"
    );

    adGroupEntries.forEach(adGroup => {
      const adGroupId = adGroup["Ad Group ID"];
      const adGroupName = adGroup["Ad Group Name"];
      
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';
      
      const label = document.createElement('label');
      label.for = `edit-adgroup-${adGroupId}`;
      label.textContent = `Current: ${adGroupName}`;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `edit-adgroup-${adGroupId}`;
      input.className = 'form-control';
      input.value = adGroupName;
      input.dataset.adGroupId = adGroupId;
      input.dataset.originalName = adGroupName;

      formGroup.appendChild(label);
      formGroup.appendChild(input);
      adGroupGrid.appendChild(formGroup);
    });
    elements.spAdGroupInputs.appendChild(adGroupGrid);
  }

  elements.editModalTitle.textContent = title;
  elements.editModalMessage.textContent = message;
  elements.editModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Clear previous errors
  elements.editModalError.classList.add("hidden");
  elements.editModalError.textContent = "";

  editCallback = () => {
    if (type === "name") {
      const newCampaignName = elements.editModalTextInput.value.trim();
      if (!newCampaignName) {
        elements.editModalError.textContent = "Campaign name cannot be empty.";
        elements.editModalError.classList.remove("hidden");
        return;
      }

      const isDuplicate = campaignData.some(
        (entry) =>
          (entry["Campaign Id"] || entry["Campaign ID"]) === newCampaignName &&
          newCampaignName !== campaignId
      );

      if (isDuplicate) {
        elements.editModalError.textContent = "Campaign name already exists.";
        elements.editModalError.classList.remove("hidden");
        return;
      }

      // Update all entries for the old campaign ID
      campaignData.forEach((entry) => {
        if ((entry["Campaign Id"] || entry["Campaign ID"]) === campaignId) {
          if (entry["Campaign Id"]) {
            entry["Campaign Id"] = newCampaignName;
          }
          if (entry["Campaign ID"]) {
            entry["Campaign ID"] = newCampaignName;
          }
          // Also update the Campaign Name field
          if (entry["Campaign Name"]) {
            entry["Campaign Name"] = newCampaignName;
          }
        }
      });

      updateCampaignList();
    } else if (type === "budget") {
      const newValue = parseFloat(elements.editModalInput.value);
      if (isNaN(newValue)) return;

      campaignData.forEach((entry) => {
        if (
          (entry["Campaign Id"] || entry["Campaign ID"]) === campaignId &&
          entry.Entity === "Campaign"
        ) {
          if (entry.Product === "Sponsored Products") {
            entry["Daily Budget"] = newValue;
          } else {
            entry.Budget = newValue;
          }
        }
      });
    } else if (type === "bid") {
      if (isAutoCampaign) {
        const newBids = {
          "loose-match": parseFloat(elements.editLooseMatch.value),
          "close-match": parseFloat(elements.editCloseMatch.value),
          complements: parseFloat(elements.editComplements.value),
          substitutes: parseFloat(elements.editSubstitutes.value),
        };

        const maxBid = Math.max(...Object.values(newBids).filter(v => !isNaN(v)));

        campaignData.forEach((entry) => {
          if ((entry["Campaign Id"] || entry["Campaign ID"]) === campaignId) {
            if (entry.Entity === "Product targeting") {
              const targetingType = entry["Product Targeting Expression"];
              if (newBids[targetingType] !== undefined && !isNaN(newBids[targetingType])) {
                entry.Bid = newBids[targetingType];
              }
            } else if (entry.Entity === "Ad group") {
              entry["Ad Group Default Bid"] = maxBid;
            }
          }
        });
      } else if (isPtCampaign) {
        const newValue = parseFloat(elements.editModalInput.value);
        if (isNaN(newValue)) return;

        campaignData.forEach((entry) => {
          if ((entry["Campaign Id"] || entry["Campaign ID"]) === campaignId) {
            if (entry.Entity === "Product targeting") {
              entry.Bid = newValue;
            }
            if (entry.Entity === "Ad group") {
              entry["Ad Group Default Bid"] = newValue;
            }
          }
        });
      } else if (hasAdGroup) {
        const bidInputs = elements.spBidInputs.querySelectorAll('input[type="number"]');
        bidInputs.forEach(input => {
          const adGroupId = input.dataset.adGroupId;
          const newBid = parseFloat(input.value);
          if (!isNaN(newBid)) {
            campaignData.forEach(entry => {
              if (
                (entry["Campaign Id"] || entry["Campaign ID"]) === campaignId &&
                entry["Ad Group ID"] === adGroupId
              ) {
                if (entry.Entity === "Ad group") {
                  entry["Ad Group Default Bid"] = newBid;
                }
                if (entry.Entity === "Keyword") {
                  entry.Bid = newBid;
                }
              }
            });
          }
        });
      } else {
        const newValue = parseFloat(elements.editModalInput.value);
        if (isNaN(newValue)) return;

        campaignData.forEach((entry) => {
          if ((entry["Campaign Id"] || entry["Campaign ID"]) === campaignId) {
            if (entry.Entity === "Keyword") {
              entry.Bid = newValue;
            }
            if (entry.Product === "Sponsored Products" && entry.Entity === "Ad group") {
              entry["Ad Group Default Bid"] = newValue;
            }
          }
        });
      }
    } else if (type === "bidding") {
      const newAdjustments = {
        "placement top": parseInt(elements.editPlacementTop.value),
        "placement rest of search": parseInt(elements.editPlacementRest.value),
        "placement product page": parseInt(elements.editPlacementProduct.value),
      };

      for (const placement of Object.keys(newAdjustments)) {
        const value = newAdjustments[placement];
        if (isNaN(value) || value < 0 || value > 900) {
          let placementName = placement;
          if (placement === 'placement top') placementName = 'Top of search (first page)';
          if (placement === 'placement rest of search') placementName = 'Rest of search';
          if (placement === 'placement product page') placementName = 'Product pages';
          elements.editModalError.textContent = `Invalid value for "${placementName}". Must be between 0 and 900.`;
          elements.editModalError.classList.remove("hidden");
          return;
        }
      }

      campaignData.forEach((entry) => {
        if ((entry["Campaign Id"] || entry["Campaign ID"]) === campaignId && entry.Entity === "Bidding adjustment") {
          if (newAdjustments[entry.Placement] !== undefined) {
            entry.Percentage = newAdjustments[entry.Placement];
          }
        }
      });
    } else if (type === "adGroup") {
      const adGroupInputs = elements.spAdGroupInputs.querySelectorAll('input[type="text"]');

      const proposedChanges = new Map();
      adGroupInputs.forEach(input => {
        const originalId = input.dataset.adGroupId;
        const newName = input.value.trim();
        proposedChanges.set(originalId, newName);
      });

      const currentAdGroups = campaignData.filter(e =>
        (e['Campaign Id'] || e['Campaign ID']) === campaignId && e.Entity === 'Ad group'
      );

      const finalNames = currentAdGroups.map(adGroup => {
        const originalId = adGroup['Ad Group ID'];
        return proposedChanges.get(originalId) || originalId;
      });

      if (new Set(finalNames).size !== finalNames.length) {
        elements.editModalError.textContent = "Duplicate Ad Group names are not allowed within the same campaign.";
        elements.editModalError.classList.remove("hidden");
        return;
      }

      const updatedCampaignEntries = campaignData
        .filter(e => (e['Campaign Id'] || e['Campaign ID']) === campaignId)
        .map(entry => {
            const originalAdGroupId = entry['Ad Group ID'];
            if (proposedChanges.has(originalAdGroupId)) {
                const newAdGroupName = proposedChanges.get(originalAdGroupId);
                if (newAdGroupName && newAdGroupName !== originalAdGroupId) {
                    const newEntry = { ...entry };
                    newEntry['Ad Group ID'] = newAdGroupName;
                    if (newEntry.Entity === 'Ad group') {
                        newEntry['Ad Group Name'] = newAdGroupName;
                    }
                    return newEntry;
                }
            }
            return entry;
        });

      const firstIndex = campaignData.findIndex(e => (e['Campaign Id'] || e['Campaign ID']) === campaignId);
      if (firstIndex !== -1) {
        const campaignLength = campaignData.filter(e => (e['Campaign Id'] || e['Campaign ID']) === campaignId).length;
        campaignData.splice(firstIndex, campaignLength, ...updatedCampaignEntries);
      }
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
  if (editCallback) {
    editCallback();
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
            (entry) => (entry["Campaign Id"] || entry["Campaign ID"]) === id
          );
          reorderedCampaignData.push(...campaignEntries);
        });

        campaignData = reorderedCampaignData;
      },
    });
  }
};

// Preview Modal Functions
const showPreviewModal = (type) => {
  const data = campaignData.filter((entry) => entry.Product === type);
  const columns = type === "Sponsored Products" ? sponsoredProductsColumns : sponsoredBrandsColumns;
  
  elements.previewModalTitle.textContent = `${type} Preview`;
  renderTable(elements.previewModalTable, data, columns);
  elements.previewModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const hidePreviewModal = () => {
  elements.previewModal.classList.add("hidden");
  document.body.style.overflow = "unset";
};

const renderTable = (table, data, columns) => {
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  // Clear existing table
  thead.innerHTML = "";
  tbody.innerHTML = "";

  // Create header
  const headerRow = document.createElement("tr");
  columns.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Create body
  if (data.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = columns.length;
    td.textContent = "No data available";
    td.style.textAlign = "center";
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    data.forEach((row) => {
      const tr = document.createElement("tr");
      columns.forEach((col) => {
        const td = document.createElement("td");
        td.textContent = (row[col] === null || row[col] === undefined) ? "" : row[col];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  // Set sticky column offsets
  requestAnimationFrame(() => {
    const ths = headerRow.querySelectorAll('th');
    let offset = 0;
    for (let i = 0; i < 5; i++) {
      if (ths[i]) {
        ths[i].style.left = `${offset}px`;
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
          if (row.cells[i]) {
            row.cells[i].style.left = `${offset}px`;
          }
        });
        offset += ths[i].offsetWidth;
      }
    }
  });
};

// Excel Functions
const getOrCreateUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = self.crypto.randomUUID();
    localStorage.setItem('userId', userId);
  }
  return userId;
};

const downloadExcel = async () => {
  try {
    // Import SheetJS library
    const XLSX = await import(
      "https://cdn.sheetjs.com/xlsx-0.20.2/package/xlsx.mjs"
    );

    // Sponsored Brands Sheet
    const sbData = campaignData.filter(entry => entry.Product === "Sponsored Brands");
    const sbOutput =
      sbData.length > 0
        ? sbData.map((entry) => ensureDefaultColumns(entry, "sb"))
        : [ensureDefaultColumns({}, "sb")];
    const sbWorksheet = XLSX.utils.json_to_sheet(sbOutput, {
      header: sponsoredBrandsColumns,
    });

    // Sponsored Products Sheet
    const spData = campaignData.filter(entry => entry.Product === "Sponsored Products");
    const spOutput =
      spData.length > 0
        ? spData.map((entry) => ensureDefaultColumns(entry, "sp"))
        : [ensureDefaultColumns({}, "sp")];
    const spWorksheet = XLSX.utils.json_to_sheet(spOutput, {
      header: sponsoredProductsColumns,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      spWorksheet,
      "Sponsored Products Campaigns"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      sbWorksheet,
      "Sponsored Brands Campaigns"
    );
    XLSX.writeFile(workbook, "AmazonAdvertisingBulksheetSellerTemplate.xlsx");
  } catch (error) {
    console.error("Error downloading Excel file:", error);
    showError("Failed to download Excel file. Please try again.");
  }

  // --- Start Tracking Logic ---
  const uniqueCampaigns = new Map();
  campaignData.forEach((entry) => {
    const campaignId = entry["Campaign Id"] || entry["Campaign ID"];
    // Store the first entry for each unique campaign to get its country
    if (campaignId && !uniqueCampaigns.has(campaignId)) {
      uniqueCampaigns.set(campaignId, entry);
    }
  });

  const campaignCount = uniqueCampaigns.size;

  // Track usage only if there are campaigns
  if (campaignCount > 0) {
    const userId = getOrCreateUserId();
    const campaignNames = Array.from(uniqueCampaigns.keys()).join(', ');
    
    // Get the country from the very first unique campaign in the template
    const firstCampaign = uniqueCampaigns.values().next().value;
    const country = firstCampaign ? firstCampaign.country || 'N/A' : 'N/A';

    try {
      await fetch('/.netlify/functions/track-usage', {
        method: 'POST',
        body: JSON.stringify({ userId, country, campaignCount, campaignNames }),
      });
    } catch (error) {
      console.error('Error tracking usage:', error);
      // Don't block user if tracking fails
    }
  }
  // --- End Tracking Logic ---
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
  hideWarning();

  const validation = validateRequiredFields();

  if (validation.warnings && validation.warnings.length > 0) {
    showWarning(validation.warnings);
  }

  if (!validation.isValid) {
    showError(validation.errors.join('<br>'));
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

  // Form events
  elements.campaignType.addEventListener("change", updateFormUI);

  // Alert events
  elements.closeError.addEventListener("click", hideError);
  elements.closeWarning.addEventListener("click", hideWarning);

  // Modal events
  elements.closeModal.addEventListener("click", hideModal);
  elements.closeModalBtn.addEventListener("click", hideModal);
  elements.closeConfirmationModal.addEventListener("click", hideConfirmation);
  elements.cancelConfirmation.addEventListener("click", hideConfirmation);
  elements.confirmAction.addEventListener("click", confirmAndHide);
  elements.closeEditModal.addEventListener("click", hideEditModal);
  elements.cancelEdit.addEventListener("click", hideEditModal);
  elements.saveEdit.addEventListener("click", saveEditAndHide);

  // Preview modal events
  elements.showSpPreview.addEventListener("click", () =>
    showPreviewModal("Sponsored Products")
  );
  elements.showSbPreview.addEventListener("click", () =>
    showPreviewModal("Sponsored Brands")
  );
  elements.closePreviewModal.addEventListener("click", hidePreviewModal);

  // Close modal when clicking outside
  elements.videoModal.addEventListener("click", (e) => {
    if (e.target === elements.videoModal) {
      hideModal();
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // ESC to close modals
    if (e.key === "Escape") {
      hideModal();
      hidePreviewModal();
      hideConfirmation();
      hideEditModal();
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
  updateFormUI();
});