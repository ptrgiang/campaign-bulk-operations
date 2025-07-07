
# Guide to Campaign Types in the BlueStars Campaign Creator

This document explains the functionality of each **Campaign Type** available in the BlueStars Campaign Creator. Each type is designed for a specific advertising strategy and generates a set of rows in the bulk operations template with pre-configured values.

## Common Fields

The following fields are common to almost all campaign types:

- **Country:** Determines the marketplace (US or CA) and the `Brand Entity Id`.
- **Portfolio ID:** (Optional) Assigns the campaign to a specific portfolio.
- **Product Number:** Used for campaign naming.
- **SKU:** Used for campaign naming and for creating Product Ads.
- **ASIN:** Used in the `Creative asins` column for Sponsored Brands or stored internally for Sponsored Products.

---

## Sponsored Products Campaign Types

These campaigns are created under the "Sponsored Products" product type in the Excel template.

### Custom

- **Purpose:** Creates a campaign with manual keyword targeting, allowing you to specify keywords for broad, phrase, and exact match types in separate ad groups.
- **Required Fields:**
  - `Product Number`, `SKU`, `ASIN`
  - **Targeting Keywords:**
    - `Targeting Exact`
    - `Targeting Phrase`
    - `Targeting Broad`
  - **Negative Keywords:**
    - `Negative Exact`
    - `Negative Phrase`
- **Generated Template Rows:**
  - **1 x Campaign:** Targeting Type is `Manual`.
  - **3 x Bidding adjustment:** All set to 0%.
  - **1 x Ad group:** Named "Custom" with a default bid of `0.25`.
  - **1 x Product ad:** Links your SKU.
  - **Keywords:**
    - Multiple `Keyword` rows for each keyword provided in the Exact, Phrase, and Broad text areas, all with a bid of `0.25`.
  - **Negative Keywords:**
    - Multiple `Negative keyword` rows for each keyword provided in the Negative Exact (`negativeExact`) and Negative Phrase (`negativePhrase`) text areas.

### Auto

- **Purpose:** Creates an automatic targeting campaign where Amazon targets keywords and products similar to the one in your ad.
- **Required Fields:**
  - `Product Number`, `SKU`, `ASIN`
  - **Bids for Auto Targeting Groups:**
    - `Loose match` (Default: 0.25)
    - `Close match` (Default: 0.25)
    - `Complements` (Default: 0.25)
    - `Substitutes` (Default: 0.25)
- **Generated Template Rows:**
  - **1 x Campaign:** Targeting Type is set to `Auto`. Bidding strategy is `Dynamic bids - down only`.
  - **3 x Bidding adjustment:** Sets `placement top`, `placement rest of search`, and `placement product page` to 0%.
  - **1 x Ad group:** Named "Auto". The `Ad Group Default Bid` is the highest value entered among the four match type bids.
  - **1 x Product ad:** Links your SKU to the ad group.
  - **4 x Product targeting:** One for each auto-targeting group (`loose-match`, `close-match`, `complements`, `substitutes`) with their specified bids.

### Research

- **Purpose:** Designed for discovering new, high-performing keywords. It takes a list of keywords and sets them all to broad match to capture a wide range of customer search terms.
- **Required Fields:**
  - `Product Number`, `SKU`, `ASIN`
  - `Targeting Keywords`
  - **Negative Keywords:**
    - `Negative Exact`
    - `Negative Phrase`
- **Generated Template Rows:**
  - **1 x Campaign:** Targeting Type is `Manual`.
  - **3 x Bidding adjustment:** All set to 0%.
  - **1 x Ad group:** Named "Research" with a default bid of `0.25`.
  - **1 x Product ad:** Links your SKU.
  - **Keywords:** All provided keywords are added as `Keyword` rows with a `broad` match type and a bid of `0.25`.
  - **Negative Keywords:** Adds `Negative keyword` rows for `negativeExact` and `negativePhrase`.

### Performance

- **Purpose:** Focused on driving conversions from proven, high-performing keywords. All keywords are set to exact match to target a very specific audience.
- **Required Fields:**
  - `Product Number`, `SKU`, `ASIN`
  - `Targeting Keywords`
- **Generated Template Rows:**
  - **1 x Campaign:** Targeting Type is `Manual`.
  - **3 x Bidding adjustment:** All set to 0%.
  - **1 x Ad group:** Named "Performance" with a default bid of `0.50`.
  - **1 x Product ad:** Links your SKU.
  - **Keywords:** All provided keywords are added as `Keyword` rows with an `exact` match type and a bid of `0.50`.

### PT (Product Targeting)

- **Purpose:** Creates a product targeting campaign focused on competitor ASINs.
- **Required Fields:**
  - `Product Number`, `SKU`, `ASIN`
  - `Competitor ASINs` (one per line)
- **Generated Template Rows:**
  - **1 x Campaign:** Targeting Type is `Manual`.
  - **3 x Bidding adjustment:** `placement top` is set to `50%`, while the other two are 0%.
  - **1 x Ad group:** Named "PT" with a default bid of `0.25`.
  - **1 x Product ad:** Links your SKU.
  - **Product Targeting:** One `Product targeting` row is created for each competitor ASIN entered. The expression is `asin="COMPETITOR_ASIN"` and the bid is `0.25`.

### SP (Advanced)

- **Purpose:** Creates a highly structured campaign with multiple ad groups based on a sophisticated keyword classification system (LV1/LV2, GNR/GNR2/SPF). This is for advanced users.
- **Required Fields:**
  - `Product Number`, `SKU`, `ASIN`
  - `Product Name` (Used for LV2 ad group naming)
  - `LV1 Keywords`
  - `LV2 Keywords`
  - `Negative Keywords`
- **Generated Template Rows:**
  - **1 x Campaign:** Targeting Type is `Manual`.
  - **3 x Bidding adjustment:** `placement top` is set to `50%`.
  - **Campaign Negative Keywords:** All keywords from the `Negative Keywords` field are added at the campaign level as `negativePhrase`.
  - **6 x Ad Groups & Product Ads:** Creates six ad groups, each with its own product ad.
    - LV1 Ad Groups: `${productNumber} - GNR`, `${productNumber} - GNR2`, `${productNumber} - SPF`
    - LV2 Ad Groups: `${productName} - GNR`, `${productName} - GNR2`, `${productName} - SPF`
  - **Keyword Distribution:**
    - LV1 and LV2 keywords are automatically classified based on word count and frequency, then placed in the appropriate ad group as `phrase` match keywords with a bid of `0.50`.
    - Negative keywords are automatically added to the ad groups to prevent overlap (e.g., GNR2 and SPF keywords are added as negatives to the GNR ad group).

---

## Sponsored Brands Campaign Types

These campaigns are created under the "Sponsored Brands" product type and are all video-focused.

### Video Ads (Broad, Phrase, Exact)

- **Purpose:** Creates a Sponsored Brands video campaign with a specific keyword match type.
- **Required Fields:**
  - `Product Number`, `SKU`, `ASIN`
  - `Video Media ID`
  - `Targeting Keywords`
  - `Negative Keywords`
- **Generated Template Rows:**
  - **1 x Campaign:**
    - `Product`: Sponsored Brands
    - `Ad Format`: video
    - `Budget`: 10
    - `Creative asins`: The ASIN provided.
    - `Video Media Ids`: The Video Media ID provided.
  - **Keywords:** All provided keywords are added as `Keyword` rows with a bid of `0.25`. The `Match Type` is determined by the campaign type selected:
    - **Video Ads Broad:** `broad`
    - **Video Ads Phrase:** `phrase`
    - **Video Ads Exact:** `exact`
  - **Negative Keywords:** All provided negative keywords are added as `Negative Keyword` rows with a `negativePhrase` match type.
