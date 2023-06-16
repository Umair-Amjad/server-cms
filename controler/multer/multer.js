const express = require("express");
const multer = require("multer");
const fs = require("fs");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

var imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    var dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    console.log(req.file);
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
 
});

// img filter
// const isImage = (req, file, callback) => {
//   if (file.mimetype.startsWith("image")) {
//     callback(null, true);
//   } else {
//     callback(null, Error("only image is allowd"));
//   }
// };

var upload = multer({
  storage: imgconfig,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});


module.exports=upload;