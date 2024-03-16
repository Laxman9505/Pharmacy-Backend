/** @format */

import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { extname } from "path";

const maxSize = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, "public/uploads");
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    let ext = extname(file.originalname);
    cb(null, `IMG-${Date.now()}` + ext);
  },
});

const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: maxSize },
});

export default upload;
