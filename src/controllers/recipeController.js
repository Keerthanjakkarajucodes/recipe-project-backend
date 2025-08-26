import Recipe from "../models/Recipe.js";


// Create Single or Multiple Recipes
export const createRecipe = async (req, res) => {
  try {
    let recipesData = req.body;

    // If request is not an array (single object), convert it into an array
    if (!Array.isArray(recipesData)) {
      recipesData = [recipesData];
    }

    // Attach user ID to every recipe
    recipesData = recipesData.map(recipe => ({
      ...recipe,               // keep recipe data
      user: req.user._id       // add logged-in user ID
    }));

    // Insert all recipes at once
    const recipes = await Recipe.insertMany(recipesData);

    res.status(201).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getRecipes=async(req,res)=>{
    try{
           const recipes = await Recipe.find({ isDeleted: false }).populate("user", "name email");
            res.json(recipes);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const getRecipeById=async(req,res)=>{
    try{
        const recipe=await Recipe.findById(req.params.id).populate("user","name email");
        if(!recipe || recipe.isDeleted) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const updateRecipe=async(req,res)=>{
    try{
        const recipe=await Recipe.findById(req.params.id);

        if(!recipe || recipe.isDeleted) {
            return res.status(404).json({ message: "Recipe not found" }); 
        }

        if(recipe.user.toString()!== req.user._id.toString()){
            return res.status(401).json({ message: "Not authorized to update this recipe" });
        }

        Object.assign(recipe,req.body);
        const updatedRecipe=await recipe.save();
        res.json(updatedRecipe);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe || recipe.isDeleted) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    recipe.isDeleted = true;  // mark as deleted
    await recipe.save();

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
