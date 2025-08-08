# Campaign Bulk Operations

This repository hosts a single-page application for crafting Amazon advertising campaigns and exporting them as bulk-upload spreadsheets.

## Project Structure

| File/Folder | Purpose |
| --- | --- |
| `index.html` | Bootstraps the UI, loads the stylesheet, Sortable.js, and the main script |
| `style.css` | Provides layout, gradient themes, and responsive styling for header and form sections |
| `script.js` | Core logic: defines Excel column templates, manages form state, validates input, builds the workbook, and triggers usage tracking |
| `netlify/functions/track-usage.js` | Serverless endpoint that records anonymized usage data to a Google Sheet |
| `Campaign_Types_Guide.md` | Documentation of each campaign template and its required fields |

## Important Internals

- **Excel column templates** – Distinct column sets for Sponsored Brands and Sponsored Products ensure the workbook follows Amazon's bulk sheet format.
- **Form state & UI control** – Functions such as `resetOptionalFields` and `updateFormUI` keep the form context-sensitive by clearing optional inputs and toggling visibility based on campaign type.
- **Workbook generation** – `downloadExcel` dynamically imports SheetJS, builds separate sheets for each campaign type, and writes the combined file to disk.
- **Usage tracking** – After export, campaign metadata is posted to the Netlify function for logging to Google Sheets.

## Learn More

1. **Dive into `script.js`** to follow how campaign data is collected, validated, and converted to rows. Pay special attention to keyword cleaning logic and async workbook generation.
2. **Review front-end techniques** such as Sortable.js for drag-and-drop ordering and responsive CSS for layout and themes.
3. **Understand backend touchpoints** including Netlify function deployment, environment variables like `GOOGLE_API_CREDENTIALS`, and Google Sheets API data append operations.
4. **Consult `Campaign_Types_Guide.md`** to see how each campaign type maps to bulk sheet rows and required fields.

With these building blocks, contributors can extend campaign templates, integrate additional analytics, or port the tool to other ad platforms while staying aligned with the existing code structure.

