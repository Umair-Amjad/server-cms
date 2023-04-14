const express = require("express");
const multer = require("multer");
const fs = require("fs");

var imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    var dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    console.log(req.file)
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

// img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(null, Error("only image is allowd"));
  }
};

var upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});


module.exports=upload;