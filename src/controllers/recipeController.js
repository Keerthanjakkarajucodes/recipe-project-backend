import Recipe from "../models/Recipe.js";

// ✅ Create Recipe
export const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({ ...req.body, user: req.user._id });
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("user", "name email");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("user", "name email");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Recipe (real DB update)
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Hard Delete Recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
