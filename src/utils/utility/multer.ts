import { Request } from "express";
//Upload images with multer
import multer from "multer";
interface ImageFile extends File {
  readonly mimetype: "image/jpeg" | "image/png";
  fieldname: string;
  originalname: string;
}
let storage = multer.diskStorage({
  /**
   *
   * @param req
   * @param file
   * @param cb
   */
  filename: (req: Request, file, cb: Function): void => {
    cb(
      null,
      file.fieldname +
        "_" +
        new Date().toISOString().replace(/:/g, "-") +
        "_" +
        file.originalname
    );
  },
});
const fileFilter = (req: Request, file: ImageFile | any, cb: Function) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb({ message: "Unsupported image format" }, false);
  }
};
let upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter,
});
export default upload;
