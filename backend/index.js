const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

require("./db");

const userRouter = require("./routes/user");
const complaintRouter = require("./routes/complaint");

app.use(cors());

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/complaint", complaintRouter);

app.listen(process.env.PORT, () => {
  console.log("Server listening on port 1377");
});
