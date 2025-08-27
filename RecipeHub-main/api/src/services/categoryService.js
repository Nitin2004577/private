import categoryModel from "../models/Category.js";
import uploadFile from "../utils/file.js";
const createCategory = async (id, file, data) => {
  let uploadedImage = "";

  if (file) {
    const rawFileName = data.name;
    // random string for uniqueness in filename
    const randomStr = Math.random().toString(36).substring(2, 7);
    //filename generation
    const filename = (
      rawFileName.replace(/\s+/g, "-") +
      "-" +
      randomStr
    ).toLowerCase();
    uploadedImage = await uploadFile(file, filename);
  }

  // Check using the getById function with is to be made.
  const createdCategory = await categoryModel.create({
    ...data,
    image: uploadedImage?.secure_url ?? "",
  });

  return createdCategory;
};

export default { createCategory };
