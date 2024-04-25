const express = require("express");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(cors)
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
