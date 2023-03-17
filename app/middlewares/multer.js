const multer = require("multer");
const path = require("path");
const express = require("express");
var app = express();
const fs = require("fs");

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./public/upload");
    },

    filename: (req, file, callback) => {
      req.originalName = Date.now() + "-" + file.originalname;

      callback(null, req.originalName);
    },
  }),

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png)$/)) {
      return cb(new Error("Please Upload Image Only"));
    }

    cb(null, true);
  },
});

module.exports = upload;
