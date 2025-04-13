const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const app = express();
const port = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Endpoint to fetch and parse Wiktionary content
app.get("/api/wiktionary/:word", async (req, res) => {
  try {
    const word = req.params.word;
    const url = `https://el.wiktionary.org/wiki/${encodeURIComponent(word)}`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Find the English section
    const englishSection = $("#Αγγλικά_\\(en\\)").parent().nextUntil("h2");

    if (englishSection.length === 0) {
      return res.status(404).json({ error: "English section not found" });
    }

    // Extract and clean the content
    let content = "";
    englishSection.each((_, elem) => {
      content += $(elem).toString();
    });

    // Send the parsed content
    res.json({ content });
  } catch (error) {
    console.error("Error fetching Wiktionary content:", error);
    res.status(500).json({ error: "Failed to fetch Wiktionary content" });
  }
});

// Endpoint to fetch Langeek results
app.get("/api/langeek/:word", async (req, res) => {
  try {
    const word = req.params.word;
    const url = `https://api.langeek.co/v1/cs/en/word/?term=${encodeURIComponent(
      word
    )}&filter=,inCategory,photo`;

    const response = await axios.get(url);
    res.json(response.data || []); // Extract the results array from the response
  } catch (error) {
    console.error("Error fetching Langeek content:", error);
    res.status(500).json({ error: "Failed to fetch Langeek content" });
  }
});

// Default route to serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
