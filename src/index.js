const express = require("express");
require("./db/mongoose");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const User = require("./models/user");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
  console.log("Server listening on port: ", port);
});
