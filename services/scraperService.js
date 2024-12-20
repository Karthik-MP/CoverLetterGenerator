const getMetaData = require("metadata-scraper");
async function scrapeJobDetails(url) {
  try {
    const { title, description } = await getMetaData(url);
    return { title, description };
  } catch (error) {
    console.error("Scraping Error:", err.message);
    return null;
  }
}

module.exports = scrapeJobDetails;
