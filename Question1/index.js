import express from "express";
import axios from "axios";
import numberRoutes from "./numberRoutes.js";

const app = express();
const PORT = 3000;
const windowSize = 10;
const fetchTimeout = 500;

const fetchUrls = {
  p: "http://localhost:3000/test/primes",
  f: "http://localhost:3000/test/fibo",
  e: "http://localhost:3000/test/even",
  r: "http://localhost:3000/test/rand"
};

let windowState = [];

function getAverage(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}

// Use your mock number API routes
numberRoutes(app);

// Average Calculator API
app.get("/numbers/:numberid", async (req, res) => {
  const numberid = req.params.numberid;

  if (!fetchUrls[numberid]) {
    return res.status(400).json({ error: "Invalid number ID. Use p, f, e, or r." });
  }

  const url = fetchUrls[numberid];
  const start = Date.now();
  let fetchedNumbers = [];

  try {
    const response = await axios.get(url, { timeout: fetchTimeout });
    if (Array.isArray(response.data.numbers)) {
      fetchedNumbers = response.data.numbers;
    }
  } catch (err) {
    console.error("Error fetching:", err.message);
  }

  const windowPrevState = [...windowState];

  for (const num of fetchedNumbers) {
    if (!windowState.includes(num)) {
      if (windowState.length >= windowSize) {
        windowState.shift();
      }
      windowState.push(num);
    }
  }

  const windowCurrState = [...windowState];
  const avg = getAverage(windowState);
  const elapsed = Date.now() - start;
  const delay = Math.max(0, fetchTimeout - elapsed);

  setTimeout(() => {
    res.json({
      windowPrevState,
      windowCurrState,
      numbers: fetchedNumbers,
      avg
    });
  }, delay);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});