const express = require("express");
const app = express();
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

//db config

const db = require("./config/keys").mongoURI;
// connect to mongo db

mongoose
  .connect(db)
  .then(() => console.log("mongodb connected"))
  .catch(err => console.log(err));
app.get("/", (req, res) => {
  res.send("hello");
});

// use routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.Port || 3001;

app.listen(port, () => console.log(`server running on port ${port}`));
