
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

- **Purpose:** Creates a highly structured campaign with multiple ad groups. This is for advanced users and operates in two modes, selectable in the UI: **LV1/LV2** and **GNR/GNR2/SPF**.
- **Required Fields:**
  - `Product Number`, `SKU`, `ASIN`
  - `Product Name` (Used for LV2 ad group naming)
  - `LV1 Keywords`
  - `LV2 Keywords`
  - `Negative Keywords`
- **Generated Template Rows (Common):**
  - **1 x Campaign:** Targeting Type is `Manual`.
  - **3 x Bidding adjustment:** `placement top` is set to `50%`.
  - **Campaign Negative Keywords:** All keywords from the `Negative Keywords` field are added at the campaign level as `negativePhrase`.

---

#### Mode 1: LV1/LV2

- **Structure:** Creates a simpler two-tiered ad group structure.
- **Generated Ad Groups:**
  - **1 x LV1 Ad Group:** Named `${productNumber} - LV1`. Contains all `LV1 Keywords`.
  - **1 x LV2 Ad Group:** (Optional) Named `${productName} - LV2`. Created if `LV2 Keywords` are provided and contains all of them.
- **Keyword Match Type:** All keywords are added as `phrase` match with a bid of `0.50`.

---

#### Mode 2: GNR/GNR2/SPF

- **Structure:** Creates a highly granular structure based on a sophisticated keyword classification system.
- **Generated Ad Groups:**
  - **Up to 6 x Ad Groups & Product Ads:** Creates up to six ad groups, each with its own product ad.
    - **LV1 Ad Groups:** `${productNumber} - GNR`, `${productNumber} - GNR2`, `${productNumber} - SPF`
    - **LV2 Ad Groups:** `${productName} - GNR`, `${productName} - GNR2`, `${productName} - SPF`
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
  - **Negative Keywords:**
    - `Negative Exact`
    - `Negative Phrase`
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
  - **Negative Keywords:** All provided negative keywords are added as `Negative Keyword` rows with their corresponding match types (`negativeExact` or `negativePhrase`).

### Video Ads PT

- **Purpose:** Creates a Sponsored Brands video campaign focused on competitor ASINs.
- **Required Fields:**
  - `Product Number`, `SKU`, `ASIN`
  - `Video Media ID`
  - `Competitor ASINs` (one per line)
- **Generated Template Rows:**
  - **1 x Campaign:**
    - `Product`: Sponsored Brands
    - `Ad Format`: video
    - `Budget`: 10
    - `Creative asins`: The ASIN provided.
    - `Video Media Ids`: The Video Media ID provided.
  - **Product Targeting:** One `Product targeting` row is created for each competitor ASIN entered. The expression is `asin="COMPETITOR_ASIN"` and the bid is `0.25`.

---

## Campaign Customization Features

Once a campaign is added to the template, you can customize it using the action icons that appear on hover. These features allow you to fine-tune your campaigns before downloading the Excel file.

### Editing Campaign Name
- **Icon:** 📝
- **Functionality:** Allows you to rename the entire campaign. This updates the `Campaign Name` and `Campaign ID` for all rows associated with that campaign in the template.
- **Use Case:** Correcting typos or applying a different naming convention.

### Editing Ad Group Name
- **Icon:** 👥
- **Functionality:** Opens a modal to edit the names of all ad groups within a selected campaign. This is particularly useful for renaming the default ad group names (e.g., `Product Number - GNR`, `Product Name - LV2`) to something more specific.
- **Use Case:** Customizing ad group names for better reporting and organization, especially in complex campaigns.

### Editing Budget
- **Icon:** 💳
- **Functionality:** Changes the `Daily Budget` (for Sponsored Products) or `Budget` (for Sponsored Brands) for the selected campaign.
- **Use Case:** Adjusting the daily spend for a specific campaign based on performance goals.

### Editing Bid
- **Icon:** 💲
- **Functionality:** This feature's behavior depends on the campaign type:
  - **For most campaigns (Custom, Research, Performance, Video):** It updates the `Bid` for all keywords in that campaign simultaneously.
  - **For Auto campaigns:** It opens a modal where you can edit the bids for each targeting group (`Loose match`, `Close match`, `Complements`, `Substitutes`) individually.
  - **For PT campaigns:** It updates the bid for all targeted competitor ASINs at once.
- **Use Case:** Increasing or decreasing bids across a campaign to manage ACoS and impression volume.

### Editing Bidding Adjustment
- **Icon:** %
- **Functionality:** Opens a modal to edit the percentage for bidding adjustments for different placements: `Top of search (first page)`, `Rest of search`, and `Product pages`. The values can range from 0% to 900%.
- **Use Case:** Applying strategic bid increases for placements that have historically performed well.

### Copying a Campaign
- **Icon:** 📂
- **Functionality:** Copies the entire configuration of an existing campaign from the template back into the main form. 
- **Use Case:** Quickly creating a new, similar campaign without having to re-enter all the details. You can then modify the copied details and add it as a new campaign.

### Deleting a Campaign
- **Icon:** ❌
- **Functionality:** Removes the selected campaign and all of its associated rows from the template.
- **Use Case:** Removing campaigns that were added by mistake or are no longer needed.
