import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: [true, "Recipe is required!"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
