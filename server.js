const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const port = 3000;

// Middleware to simulate API key authentication
const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.header("X-CSCAPI-KEY");
  const validApiKey =
    "UVZJcEtNYnhSZGxyZnh2cVNXcmY4NHFuTjhCNVVBUGEzVDQ5clFscw==";

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }
  next();
};

// Endpoint to get all states in India
app.get("/v1/countries/IN/states", authenticateAPIKey, async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "states.json");
    const data = await fs.readFile(filePath, "utf8");
    const states = JSON.parse(data);
    res.status(200).json(states);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ error: "States data not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get cities by state ISO2 code
app.get(
  "/v1/countries/IN/states/:iso2/cities",
  authenticateAPIKey,
  async (req, res) => {
    const iso2 = req.params.iso2.toUpperCase();
    try {
      const filePath = path.join(__dirname, "data", `${iso2}.json`);
      const data = await fs.readFile(filePath, "utf8");
      const cities = JSON.parse(data);
      res.status(200).json(cities);
    } catch (error) {
      if (error.code === "ENOENT") {
        return res
          .status(404)
          .json({ error: "No cities found for the given state" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
