const express = require("express");
require("./db/mongoose");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const User = require("./models/user");

const app = express();
app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

module.exports=app