const { Storage } = require("@google-cloud/storage");
const multerGoogleStorage = require("multer-google-storage");
const multer = require("multer");
const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //if server is started as dev env, dotenv will be imported
}

module.exports = {
  async upload(req, res, next) {
    try {
      const storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        credentials: {
          client_email: process.env.GCP_CLIENT_EMAIL,
          private_key: process.env.GCP_PRIVATE_KEY.split("\\n").join("\n"),
        },
      });
      const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);
      const gcsFileName = `${Date.now()}-${req.file.originalname}`;
      const file = bucket.file(gcsFileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      stream.on("error", (err) => {
        req.file.cloudStorageError = err;
        res.sendStatus(500);
      });

      stream.on("finish", () => {
        return file.makePublic().then(() => {
          req.file.filename = gcsFileName;
          next();
        });
      });

      stream.end(req.file.buffer);
    } catch (error) {
      res.sendStatus(500);
    }

    //   const filename = "123.png";
    //   const response = await storage
    //     .bucket(process.env.GCP_BUCKET_NAME).upload()
    //   console.log(response);
    //   await storage.bucket(process.env.GCP_BUCKET_NAME).file(filename).makePublic();
  },
  async deleteImage(req, res) {
    try {
      const storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        credentials: {
          client_email: process.env.GCP_CLIENT_EMAIL,
          private_key: process.env.GCP_PRIVATE_KEY.split("\\n").join("\n"),
        },
      });
      const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);
      const file = bucket.file(req.filename);
      const deleted = await file.delete();
      res.json(deleted);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  },
};
