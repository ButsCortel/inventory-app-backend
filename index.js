const { Storage } = require("@google-cloud/storage");
const multerGoogleStorage = require("multer-google-storage");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const uploadHandler = () => {
  const storage = new Storage({});
  multer({
    storage: multerGoogleStorage.storageEngine({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY.split("\\n").join("\n"),
      },
    }),
  });
  // const storage = new Storage({
  //   projectId: process.env.GCP_PROJECT_ID,
  //   credentials: {
  //     client_email: process.env.GCP_CLIENT_EMAIL,
  //     private_key: process.env.GCP_PRIVATE_KEY.split("\\n").join("\n"),
  //   },
  // });
  // const filename = "123.png";
  // const response = await storage
  //   .bucket(process.env.GCP_BUCKET_NAME)
  //   .upload("./" + filename);
  // console.log(response);
  // await storage.bucket(process.env.GCP_BUCKET_NAME).file(filename).makePublic();
};
module.exports = uploadHandler;
