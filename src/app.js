const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const postRoutes = require("./routes/post.route");
const cors = require("cors");
const path = require("path");


const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

const frontendDir = path.join(__dirname, "..", "frontend");

app.use(express.static(frontendDir, { index: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "login.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(frontendDir, "login.html"));
});

/**
 * USE /api/auth/
 * Auth Routes
 */
app.use("/api/auth", authRoutes);

/**
 * USE /api/post/
 * Post Routes
 */
app.use("/api/post", postRoutes);


module.exports = app;
