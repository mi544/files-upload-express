const { nanoid } = require("nanoid");
const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();

const PORT = process.env.PORT || 3000;

// enable files upload
app.use(
  fileUpload({
    createParentPath: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/upload", async (req, res) => {
  try {
    if (!req.files) {
      return res.json({
        status: false,
        message: "No file provided"
      });
    }
    const fileUp = req.files.fileUp;

    // generating random id for the file name
    const id = nanoid();

    const randomFileName = path.join(id + path.extname(fileUp.name));

    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file

    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    await fileUp.mv(path.join(__dirname, "public/files/", randomFileName));

    //send response
    res.json({
      status: true,
      message: "File was uploaded",
      data: {
        name: randomFileName,
        mimetype: fileUp.mimetype,
        size: fileUp.size
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
