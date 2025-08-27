import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required!"],
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: [true, "Recipe is required!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

favoriteSchema.index({ user: 1, recipe: 1 }, { unique: true });

const favoriteModel = mongoose.model("Favorite", favoriteSchema);

export default favoriteModel;
