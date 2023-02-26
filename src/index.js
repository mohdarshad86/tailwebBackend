const express = require("express");
const mongoose = require("mongoose");

const cors = require('cors')
const port = process.env.PORT || 3001;
const route = require("./routes/route");
mongoose.set("strictQuery", true);
const app = express();
const multer = require('multer');

app.use(express.json());
app.use(cors())
app.use(multer().any());

mongoose
  .connect(
    "mongodb+srv://mohdarshad86:Arshad86@cluster0.r4p7rwf.mongodb.net/tailweb-DB",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("mongoDB is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/", route);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
