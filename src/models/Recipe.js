import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    ingredients: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one ingredient is required",
      },
    },
    steps: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one step is required",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    prepTime: {
      type: Number, // minutes
      default: 0,
    },
    cookTime: {
      type: Number, // minutes
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔎 Text index for searching (title, description, ingredients)
recipeSchema.index({
  title: "text",
  description: "text",
  ingredients: "text",
});

// 📌 Instance method (per recipe)
recipeSchema.methods.summary = function () {
  return {
    id: this._id,
    title: this.title,
    ingredientsCount: this.ingredients.length,
    stepsCount: this.steps.length,
  };
};

// 📌 Static method (all recipes)
recipeSchema.statics.findByAuthor = function (authorId) {
  return this.find({ user: authorId, isDeleted: false });
};

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
