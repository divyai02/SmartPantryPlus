const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Supabase Connection
const supabase = createClient(
  'https://jzfxexmaclfwcubdtcsl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6ZnhleG1hY2xmd2N1YmR0Y3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTQ3NzcsImV4cCI6MjA3NTI3MDc3N30.hN7h4ceWOUk1kXcetLQeRUF5zoLPBXkzJrSlCiBa230'
);

// Test Supabase connection
console.log('🔌 Testing Supabase connection...');
supabase.from('users').select('*').limit(1).then(result => {
  if (result.error) {
    console.error('❌ Supabase connection failed:', result.error.message);
  } else {
    console.log('✅ Connected to Supabase successfully!');
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ==================== ROUTES ====================

// Route for login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for dashboard
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// ==================== LOGIN API ====================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  console.log('🔐 Login attempt:', username);
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return res.json({ success: false, message: 'Database error' });
    }
    
    if (data) {
      console.log('✅ Login successful for:', username);
      res.json({ success: true, message: 'Login successful!' });
    } else {
      console.log('❌ Login failed for:', username);
      res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// ==================== TEMPORARY STORAGE (Fallback) ====================

let pantryItems = [
  { id: 1, name: 'Milk', category: 'dairy', expiry_date: '2024-12-30', quantity: 1 },
  { id: 2, name: 'Eggs', category: 'dairy', expiry_date: '2024-12-28', quantity: 6 },
  { id: 3, name: 'Bread', category: 'grains', expiry_date: '2024-12-25', quantity: 1 }
];

let shoppingList = [
  { id: 1, name: 'Almond Milk', completed: false },
  { id: 2, name: 'Gluten-Free Bread', completed: true },
  { id: 3, name: 'Sunflower Seeds', completed: false }
];

// ==================== PANTRY ITEMS API ====================

// Get all pantry items FROM SUPABASE
app.get('/api/pantry', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', 1)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.json({ 
        success: false, 
        message: 'Failed to load pantry items' 
      });
    }
    
    console.log('📦 Loaded', data.length, 'items from Supabase');
    res.json({
      success: true,
      message: 'Pantry items fetched successfully!',
      items: data
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      success: false, 
      message: 'Server error loading pantry items' 
    });
  }
});

// Add new pantry item TO SUPABASE
app.post('/api/pantry', async (req, res) => {
  const { name, category, expiry, quantity } = req.body;
  
  console.log('📦 Adding item to Supabase:', { name, category, expiry, quantity });
  
  try {
    const { data, error } = await supabase
      .from('pantry_items')
      .insert([
        { 
          user_id: 1, 
          name: name, 
          category: category, 
          expiry_date: expiry, 
          quantity: parseInt(quantity) || 1 
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase insert error:', error);
      return res.json({ 
        success: false, 
        message: 'Failed to save item to database' 
      });
    }
    
    console.log('✅ Item saved to Supabase with ID:', data.id);
    
    res.json({
      success: true,
      message: `Item "${name}" added successfully!`,
      item: data
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      success: false, 
      message: 'Server error saving item' 
    });
  }
});

// Update pantry item IN SUPABASE
app.put('/api/pantry/:id', async (req, res) => {
  const itemId = parseInt(req.params.id);
  const { name, category, expiry, quantity } = req.body;
  
  console.log('✏️ Updating item ID in Supabase:', itemId);
  
  try {
    const { data, error } = await supabase
      .from('pantry_items')
      .update({
        name: name,
        category: category,
        expiry_date: expiry,
        quantity: parseInt(quantity) || 1
      })
      .eq('id', itemId)
      .eq('user_id', 1)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase update error:', error);
      return res.json({ 
        success: false, 
        message: 'Failed to update item in database' 
      });
    }
    
    if (!data) {
      return res.json({
        success: false,
        message: 'Item not found!'
      });
    }
    
    console.log('✅ Item updated in Supabase');
    res.json({
      success: true,
      message: `Item "${name}" updated successfully!`,
      item: data
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      success: false, 
      message: 'Server error updating item' 
    });
  }
});

// ==================== SHOPPING LIST API ====================

// Get shopping list FROM SUPABASE
app.get('/api/shopping-list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shopping_list')
      .select('*')
      .eq('user_id', 1)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.json({ 
        success: false, 
        message: 'Failed to load shopping list' 
      });
    }
    
    console.log('🛒 Loaded', data.length, 'items from shopping list');
    res.json({
      success: true,
      message: 'Shopping list fetched successfully!',
      items: data
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      success: false, 
      message: 'Server error loading shopping list' 
    });
  }
});

// Add to shopping list IN SUPABASE
app.post('/api/shopping-list', async (req, res) => {
  const { name } = req.body;
  
  console.log('🛒 Adding item to shopping list:', name);
  
  try {
    const { data, error } = await supabase
      .from('shopping_list')
      .insert([
        { 
          user_id: 1, 
          name: name, 
          completed: false 
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase insert error:', error);
      return res.json({ 
        success: false, 
        message: 'Failed to add item to shopping list' 
      });
    }
    
    console.log('✅ Item added to shopping list with ID:', data.id);
    
    res.json({
      success: true,
      message: `Added "${name}" to shopping list!`,
      item: data
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      success: false, 
      message: 'Server error adding to shopping list' 
    });
  }
});

// ==================== USER PREFERENCES API ====================

// Get user preferences FROM SUPABASE
app.get('/api/preferences/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  
  console.log('🔍 Loading preferences for user:', userId);
  
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Supabase error:', error);
      return res.json({ 
        success: false, 
        message: 'Failed to load preferences' 
      });
    }
    
    if (data) {
      console.log('✅ Raw preferences from Supabase:', data);
      
      // Parse JSONB data (Supabase returns it as object automatically)
      const allergiesArray = data.allergies || [];
      const dietsArray = data.diet_preferences || [];
      
      console.log('✅ Final parsed preferences:', { allergiesArray, dietsArray });
      
      res.json({
        success: true,
        preferences: {
          allergies: allergiesArray,
          diets: dietsArray,
          notifications_enabled: data.notifications_enabled
        }
      });
    } else {
      // Create default preferences if none exist
      const defaultPreferences = {
        allergies: ['dairy', 'nuts', 'gluten', 'eggs', 'seafood', 'soy'],
        diets: ['vegetarian', 'vegan', 'low-carb', 'low-calorie'],
        notifications_enabled: true
      };
      
      const { data: newData, error: insertError } = await supabase
        .from('user_preferences')
        .insert([
          {
            user_id: userId,
            allergies: defaultPreferences.allergies,
            diet_preferences: defaultPreferences.diets,
            notifications_enabled: true
          }
        ])
        .select()
        .single();
      
      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return res.json({ 
          success: false, 
          message: 'Failed to create default preferences' 
        });
      }
      
      console.log('✅ Created default preferences for user:', userId);
      res.json({
        success: true,
        preferences: defaultPreferences
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      success: false, 
      message: 'Server error loading preferences' 
    });
  }
});

// Save user preferences TO SUPABASE
app.post('/api/preferences/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { allergies, diets, notifications_enabled } = req.body;
  
  console.log('💾 Saving preferences for user:', userId);
  console.log('📦 Data to save:', { allergies, diets, notifications_enabled });
  
  // Ensure we're working with arrays
  const allergiesArray = Array.isArray(allergies) ? allergies : [];
  const dietsArray = Array.isArray(diets) ? diets : [];
  
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        allergies: allergiesArray,
        diet_preferences: dietsArray,
        notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase save error:', error);
      return res.json({ 
        success: false, 
        message: 'Failed to save preferences' 
      });
    }
    
    console.log('✅ Preferences saved to Supabase for user:', userId);
    res.json({
      success: true,
      message: 'Preferences saved successfully!',
      preferences: {
        allergies: allergiesArray,
        diets: dietsArray,
        notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : true
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      success: false, 
      message: 'Server error saving preferences' 
    });
  }
});

// ==================== BARCODE SCANNER API ====================
app.post('/api/scan-barcode', (req, res) => {
  const { barcode } = req.body;
  
  console.log('📷 Scanning barcode:', barcode);
  
  const productDatabase = {
    '1234567890128': { name: 'Milk', category: 'dairy' },
    '2345678901231': { name: 'Eggs', category: 'dairy' },
    '3456789012344': { name: 'Bread', category: 'grains' },
    '4567890123457': { name: 'Tomatoes', category: 'vegetables' },
    '5678901234560': { name: 'Chicken', category: 'meat' }
  };
  
  const product = productDatabase[barcode];
  
  if (product) {
    res.json({
      success: true,
      product: product
    });
  } else {
    res.json({
      success: false,
      message: 'Product not found in database'
    });
  }
});

// ==================== RECIPES API ====================
app.get('/api/recipes', (req, res) => {
  const recipes = [
    { 
      id: 1, 
      name: 'Pasta Primavera', 
      ingredients: ['Pasta', 'Tomatoes', 'Bell Peppers', 'Zucchini'],
      nutrition: { calories: 350, protein: 15, carbs: 45, fat: 12 }
    },
    { 
      id: 2, 
      name: 'Fresh Garden Salad', 
      ingredients: ['Lettuce', 'Tomatoes', 'Cucumber', 'Olive Oil'],
      nutrition: { calories: 280, protein: 8, carbs: 20, fat: 18 }
    }
  ];
  
  res.json({
    success: true,
    recipes: recipes
  });
});

// ==================== DELETE ENDPOINTS ====================

// Delete pantry item FROM SUPABASE
app.delete('/api/pantry/:id', async (req, res) => {
  const itemId = parseInt(req.params.id);
  
  console.log('🗑️ Deleting pantry item ID from Supabase:', itemId);
  
  try {
    const { error } = await supabase
      .from('pantry_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', 1);
    
    if (error) {
      console.error('Supabase delete error:', error);
      return res.json({ 
        success: false, 
        message: 'Failed to delete item from database' 
      });
    }
    
    console.log('✅ Item deleted from Supabase');
    res.json({
      success: true,
      message: 'Item deleted successfully!'
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      success: false, 
      message: 'Server error deleting item' 
    });
  }
});

// Delete shopping list item FROM SUPABASE
app.delete('/api/shopping-list/:id', async (req, res) => {
  const itemId = parseInt(req.params.id);
  
  console.log('🗑️ Deleting shopping item ID from Supabase:', itemId);
  
  try {
    const { error } = await supabase
      .from('shopping_list')
      .delete()
      .eq('id', itemId)
      .eq('user_id', 1);
    
    if (error) {
      console.error('Supabase delete error:', error);
      return res.json({ 
        success: false, 
        message: 'Failed to delete item from shopping list' 
      });
    }
    
    console.log('✅ Item deleted from shopping list');
    res.json({
      success: true,
      message: 'Item removed from shopping list!'
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      success: false, 
      message: 'Server error deleting shopping item' 
    });
  }
});

// ==================== CATCH-ALL ROUTE ====================
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Pantry API: /api/pantry`);
  console.log(`🛒 Shopping API: /api/shopping-list`);
  console.log(`⚡ Preferences API: /api/preferences/:userId`);
  console.log(`🔐 Login API: /api/login`);
  console.log(`🌐 Open: http://localhost:${PORT}`);
});