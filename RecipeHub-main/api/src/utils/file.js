import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_FOLDER = "RecipeHub";

const uploadFile = async (file, filename) => {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          public_id: filename,
          overwrite: true,
        },
        (error, data) => {
          if (error) return reject(error);
          resolve(data);
        }
      )
      .end(file.buffer);
  });
  
  return result;
};

export default uploadFile;
