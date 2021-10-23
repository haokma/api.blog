const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const multiparty = require("connect-multiparty");
const fs = require("fs");
const cloudinary = require("./utils/cloudinary");

const upload = require("./utils/multer");

require("dotenv").config();

// routes
const blogRoute = require("./routes/blog.route");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const categoryRoute = require("./routes/category.route");
const tagRoute = require("./routes/tag.route");
const inititalRoute = require("./routes/initialData.route");

// mongoose connect
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  function () {
    console.log("Database connected");
  }
);

// app
const app = express();

const multipartyMiddleware = multiparty({ uploadDir: "./images" });

// middlewares
app.use(morgan("dev"));
app.use(express.json());
// cors
// if (process.env.NODE_ENV === "development") {
//   app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
// }
app.use(cors());

// router
app.use("/public", express.static("uploads"));
app.use("/api/blog", blogRoute);
app.use("/api/user", authRoute);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/tag", tagRoute);
app.use("/api/initialData", inititalRoute);

app.post("/api/upload-image", multipartyMiddleware, async (req, res) => {
  try {
    console.log({ "result": req.files });
    if (!req.files)
      return res.status(400).json({
        status: "error",
        error: "Do not file upload to server",
      });

    const result = await cloudinary.uploader.upload(req.files.upload.path, {
      public_id: req.files.upload.originalFilename,
    });


    res.status(200).json({
      uploaded: true,
      url: result.url,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
});

app.post(
  "/api/upload-thumbnail",
  upload.single("thumbnail"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      if (!req.file) {
        return res.status(400).json({
          status: "fail",
          message: "Something went wrong when you upload thumbnail",
        });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: req.file.filename,
      });

      res.status(200).json({
        status: "success",
        url: result.url,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  }
);

// port
const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log(`Listen server from port: ${port}`);
});
