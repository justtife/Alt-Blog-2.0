import { v2 as cloudinary } from "cloudinary";
import logger from "../logger/logger";
export async function saveImage(
  image: string,
  folder: string,
  storageName: string
): Promise<object | Error | any> {
  return await cloudinary.uploader.upload(
    image,
    { public_id: storageName, folder },
    (err) => {
      if (err) {
        logger.error(err);
        throw new Error("An error occured");
      }
    }
  );
}
export async function deleteImage(image: string): Promise<void | Error> {
  // Delete image from cloudinary
  cloudinary.uploader.destroy(image, (error) => {
    if (error) {
      logger.error(error);
    }
  });
}
