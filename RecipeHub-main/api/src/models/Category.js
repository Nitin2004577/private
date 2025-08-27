import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required!"],
    unique: [true, "Name must be unique"],
    trim: true,
  },
  image: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
