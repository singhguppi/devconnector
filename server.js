const express = require("express");
const app = express();
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require('path');

//db config

const db = require("./config/keys").mongoURI;
// connect to mongo db
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose
  .connect(db)
  .then(() => console.log("mongodb connected"))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config

require("./config/passport")(passport);

// use routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

//server static assets if in production

if (process.env.NODE_ENV === "production") {
  //set a static folder
  app.use(express.static("client/build"));

  app.get('*',(res,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}
const port = process.env.Port || 3001;

app.listen(port, () => console.log(`server running on port ${port}`));
