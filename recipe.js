// recipe.js - IMPROVED RECIPE SYSTEM WITH BETTER MATCHING
console.log('🍳 Recipe system loaded safely!');

const recipeDatabase = [
    {
        id: 1,
        name: "Vegetable Pasta",
        ingredients: ["pasta", "tomato", "onion", "garlic", "olive oil"],
        containsAllergens: ["gluten"],
        calories: 350,
        carbs: "45g", 
        protein: "12g",
        fat: "10g",
        cookingTime: "20 mins",
        instructions: "1. Cook pasta\n2. Sauté vegetables\n3. Combine and serve"
    },
    {
        id: 2,
        name: "Fried Rice",
        ingredients: ["rice", "eggs", "carrot", "onion", "soy sauce"],
        containsAllergens: ["eggs", "soy"],
        calories: 320,
        carbs: "40g",
        protein: "14g",
        fat: "12g",
        cookingTime: "25 mins",
        instructions: "1. Cook rice\n2. Scramble eggs\n3. Stir fry vegetables\n4. Mix everything"
    },
    {
        id: 3,
        name: "Fruit Smoothie",
        ingredients: ["banana", "yogurt", "milk", "honey"],
        containsAllergens: ["dairy"],
        calories: 180,
        carbs: "25g",
        protein: "6g",
        fat: "3g",
        cookingTime: "5 mins",
        instructions: "1. Blend all ingredients\n2. Serve immediately"
    },
    {
        id: 4,
        name: "Pizza",
        ingredients: ["pizza base", "cheese", "tomato", "onion", "bell pepper"],
        containsAllergens: ["dairy", "gluten"],
        calories: 420,
        carbs: "52g",
        protein: "18g",
        fat: "16g",
        cookingTime: "15 mins",
        instructions: "1. Preheat oven\n2. Add toppings\n3. Bake for 12-15 mins"
    },
    {
        id: 5,
        name: "Bread Toast",
        ingredients: ["bread", "butter", "jam"],
        containsAllergens: ["gluten"],
        calories: 250,
        carbs: "30g",
        protein: "8g",
        fat: "10g",
        cookingTime: "5 mins",
        instructions: "1. Toast bread\n2. Spread butter and jam\n3. Serve hot"
    },
    {
        id: 6,
        name: "Banana Bread",
        ingredients: ["banana", "flour", "sugar", "butter", "eggs"],
        containsAllergens: ["gluten", "dairy", "eggs"],
        calories: 320,
        carbs: "45g",
        protein: "6g",
        fat: "12g",
        cookingTime: "45 mins",
        instructions: "1. Mash bananas\n2. Mix ingredients\n3. Bake for 40 mins"
    },
    {
    id: 7,
    name: "Tomato Rice",
    ingredients: ["rice", "tomato", "onion", "garlic", "oil", "spices"],
    containsAllergens: [],
    calories: 320,
    carbs: "45g",
    protein: "8g",
    fat: "10g",
    cookingTime: "20 mins",
    instructions: "1. Cook rice\n2. Sauté tomatoes and spices\n3. Mix with rice\n4. Serve hot"
},
{
    id: 8,
    name: "Egg Fried Rice",
    ingredients: ["rice", "eggs", "spring onion", "soy sauce", "oil", "garlic"],
    containsAllergens: ["eggs", "soy"],
    calories: 350,
    carbs: "42g",
    protein: "16g",
    fat: "12g",
    cookingTime: "15 mins",
    instructions: "1. Cook rice\n2. Scramble eggs\n3. Stir fry with rice\n4. Add soy sauce"
},
{
    id: 9,
    name: "Vegetable Noodles",
    ingredients: ["noodles", "carrot", "cabbage", "bell pepper", "soy sauce", "garlic"],
    containsAllergens: ["gluten", "soy"],
    calories: 280,
    carbs: "35g",
    protein: "9g",
    fat: "8g",
    cookingTime: "12 mins",
    instructions: "1. Boil noodles\n2. Stir fry vegetables\n3. Add noodles and sauce\n4. Toss well"
},
{
    id: 10,
    name: "Potato Curry",
    ingredients: ["potato", "onion", "tomato", "spices", "oil", "coriander"],
    containsAllergens: [],
    calories: 290,
    carbs: "38g",
    protein: "6g",
    fat: "12g",
    cookingTime: "25 mins",
    instructions: "1. Boil potatoes\n2. Make tomato-onion gravy\n3. Add potatoes and spices\n4. Simmer and serve"
},
{
    id: 11,
    name: "Cucumber Salad",
    ingredients: ["cucumber", "tomato", "onion", "lemon", "salt", "pepper"],
    containsAllergens: [],
    calories: 80,
    carbs: "12g",
    protein: "3g",
    fat: "2g",
    cookingTime: "8 mins",
    instructions: "1. Chop vegetables\n2. Mix with lemon juice\n3. Season with salt and pepper\n4. Serve chilled"
},
{
    id: 12,
    name: "Yogurt Rice",
    ingredients: ["rice", "yogurt", "mustard seeds", "curry leaves", "ginger", "salt"],
    containsAllergens: ["dairy"],
    calories: 240,
    carbs: "35g",
    protein: "8g",
    fat: "6g",
    cookingTime: "10 mins",
    instructions: "1. Cook rice\n2. Mix with yogurt\n3. Temper with spices\n4. Serve cool"
}
];

// 🆕 IMPROVED: Better pantry item matching
function getPantryItemsForRecipes() {
    const pantryItems = [];
    const ingredientCards = document.querySelectorAll('.ingredient-card h3');
    ingredientCards.forEach(card => {
        pantryItems.push(card.textContent.toLowerCase().trim());
    });
    
    console.log('📦 Recipes detected pantry items:', pantryItems);
    return pantryItems;
}

// 🆕 SMART MATCHING FUNCTION
function findMatchingIngredients(recipeIngredients, pantryItems) {
    const matchingIngredients = [];
    const missingIngredients = [];
    
    // 🆕 SMART INGREDIENT MAPPING
    const ingredientMapping = {
        // Your pantry items → Recipe ingredients
        'maggi': ['pasta', 'noodles'],
        'wheat': ['flour', 'bread', 'pizza base'],
        'rice': ['rice'],
        'banana': ['banana'],
        'biscuit': ['flour', 'sugar', 'butter'],
        'frozen pizza': ['pizza base', 'cheese', 'tomato']
    };
    
    recipeIngredients.forEach(ingredient => {
        let found = false;
        
        // Check direct matches
        for (let pantryItem of pantryItems) {
            // Direct match
            if (pantryItem === ingredient.toLowerCase()) {
                matchingIngredients.push(ingredient);
                found = true;
                break;
            }
            
            // Check ingredient mapping
            if (ingredientMapping[pantryItem] && ingredientMapping[pantryItem].includes(ingredient)) {
                matchingIngredients.push(ingredient);
                found = true;
                break;
            }
            
            // Partial match
            if (pantryItem.includes(ingredient.toLowerCase()) || ingredient.toLowerCase().includes(pantryItem)) {
                matchingIngredients.push(ingredient);
                found = true;
                break;
            }
        }
        
        if (!found) {
            missingIngredients.push(ingredient);
        }
    });
    
    return { matchingIngredients, missingIngredients };
}

// Load recipes safely
function loadRecipesSafely() {
    console.log('🍳 Loading recipes safely...');
    const recipesContainer = document.getElementById('recipesContainer');
    if (!recipesContainer) {
        console.log('❌ Recipes container not found yet');
        return;
    }
    
    const userAllergies = window.getAllAllergies ? window.getAllAllergies() : [];
    const pantryItems = getPantryItemsForRecipes();
    
    console.log('🔍 Checking recipes against:', pantryItems);
    
    recipesContainer.innerHTML = '';
    
    let recipesFound = 0;
    
    recipeDatabase.forEach(recipe => {
        const isSafe = !recipe.containsAllergens.some(allergen => 
            userAllergies.includes(allergen)
        );
        
        const { matchingIngredients, missingIngredients } = findMatchingIngredients(recipe.ingredients, pantryItems);
        
        const matchPercent = Math.round((matchingIngredients.length / recipe.ingredients.length) * 100);
        
        // 🆕 LOWER THRESHOLD: Show recipes with at least 30% match
        if (matchPercent >= 30) {
            recipesFound++;
            
            const recipeHTML = `
                <div class="recipe-card ${isSafe ? 'safe-recipe' : 'unsafe-recipe'}">
                    ${recipe.containsAllergens.length > 0 ? '<div class="allergy-warning">⚠️ Contains: ' + recipe.containsAllergens.join(', ') + '</div>' : '<div class="allergy-safe">✅ Allergy Safe</div>'}
                    <div class="recipe-image">${getRecipeIcon(recipe.name)}</div>
                    <div class="recipe-content">
                        <h3>${recipe.name}</h3>
                        <p>Uses ${matchingIngredients.length} of ${recipe.ingredients.length} ingredients • 
                           ${isSafe ? '<span class="allergy-tag">Allergy Safe</span>' : '<span class="allergy-tag">Check Allergies</span>'}</p>
                        
                        <div class="nutrition-info">
                            <div class="nutrition-item">🔥 ${recipe.calories} cal</div>
                            <div class="nutrition-item">💪 ${recipe.protein}</div>
                            <div class="nutrition-item">🍚 ${recipe.carbs}</div>
                            <div class="nutrition-item">🥑 ${recipe.fat}</div>
                        </div>
                        
                        <div class="match-info">
                            <div class="match-bar">
                                <div class="match-fill" style="width: ${matchPercent}%"></div>
                            </div>
                            <small>${matchPercent}% match with your pantry</small>
                        </div>
                        
                        <!-- MISSING INGREDIENTS -->
                        ${missingIngredients.length > 0 ? `
                            <div class="missing-ingredients">
                                <strong>Missing: ${missingIngredients.join(', ')}</strong>
                            </div>
                        ` : ''}
                        
                        <div class="action-buttons">
                            <button class="btn" onclick="showRecipeDetails(${recipe.id})" ${!isSafe ? 'disabled' : ''}>
                                ${isSafe ? 'Cook This' : 'Not Safe'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            recipesContainer.insertAdjacentHTML('beforeend', recipeHTML);
        }
    });
    
    // Show message if no recipes found
    if (recipesFound === 0) {
        recipesContainer.innerHTML = `
            <div class="no-recipes">
                <p>😔 No recipes found matching your current pantry items</p>
                <p>Try adding: <strong>tomato, onion, eggs, butter, cheese</strong></p>
                <p>Or click Refresh Recipes to try again</p>
            </div>
        `;
    } else {
        console.log(`✅ Found ${recipesFound} matching recipes`);
    }
}

function getRecipeIcon(recipeName) {
    const icons = {
        'pasta': '🍝',
        'rice': '🍚',
        'smoothie': '🥤',
        'pizza': '🍕',
        'toast': '🍞',
        'bread': '🍞'
    };
    
    for (let [key, icon] of Object.entries(icons)) {
        if (recipeName.toLowerCase().includes(key)) return icon;
    }
    return '🍽️';
}

function showRecipeDetails(recipeId) {
    const recipe = recipeDatabase.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const modalHTML = `
        <div class="modal-overlay" id="recipeModal">
            <div class="modal-content">
                <h3>${recipe.name}</h3>
                <p><strong>⏱️ ${recipe.cookingTime}</strong></p>
                
                <h4>Ingredients:</h4>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                
                <h4>Instructions:</h4>
                <div style="white-space: pre-line;">${recipe.instructions}</div>
                
                <div class="modal-buttons">
                    <button class="btn" onclick="closeRecipeModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeRecipeModal() {
    const modal = document.getElementById('recipeModal');
    if (modal) modal.remove();
}
function refreshRecipes() {
    console.log('🔄 [DEBUG] refreshRecipes called!');
    loadRecipesSafely();
}

// Auto-load when recipes tab is clicked
document.addEventListener('click', function(e) {
    if (e.target.closest('.tab') && e.target.closest('.tab').getAttribute('data-tab') === 'recipes') {
        console.log('🔍 Recipes tab clicked - loading recipes...');
        setTimeout(loadRecipesSafely, 500);
    }
});

// Safe initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍳 Recipe system ready!');
});