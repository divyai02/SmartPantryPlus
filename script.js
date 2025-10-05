console.log('🚀 script.js loaded successfully! Pantry+ is starting...');
// SIMPLE VERSION - LOAD PANTRY ITEMS
function loadPantryItemsFromBackend() {
    console.log('🔄 Trying to load pantry items...');
    
    fetch('/api/pantry')
        .then(response => response.json())
        .then(result => {
            console.log('📦 Backend response:', result);
            if (result.success) {
                const pantryGrid = document.querySelector('.pantry-grid');
                if (pantryGrid) {
                    pantryGrid.innerHTML = '';
                    result.items.forEach(item => {
    // 🆕 DEBUG: Check what's coming from database
    console.log('🔍 Item from DB:', {
        name: item.name,
        expiry: item.expiry,
        expiry_date: item.expiry_date,
        category: item.category,
        quantity: item.quantity,
        id: item.id
    });
    // FIX: Use expiry OR expiry_date, whichever is present
createIngredientCard(
    item.name,
    item.category,
    item.expiry || item.expiry_date,
    item.quantity,
    item.id
);
});
console.log('✅ Loaded', result.items.length, 'items');

// Refresh recipes if the Recipes tab is active
if (document.getElementById('recipes')?.classList.contains('active')) {
    if (typeof loadRecipesSafely === 'function') setTimeout(loadRecipesSafely, 500);
}
}
}
})
.catch(error => {
    console.error('❌ Error loading items:', error);
});
}
// Add this temporary debug function to check what your backend is actually sending
function debugBackendResponse() {
    console.log('🐛 DEBUG: Checking backend response structure...');
    
    fetch('/api/pantry')
        .then(response => response.json())
        .then(result => {
            console.log('🔍 DEBUG - Full backend response:', result);
            if (result.success && result.items.length > 0) {
                console.log('🔍 DEBUG - First item structure:', result.items[0]);
                console.log('🔍 DEBUG - All item keys:', Object.keys(result.items[0]));
                
                // Check what expiry field exists
                const firstItem = result.items[0];
                if (firstItem.expiry) {
                    console.log('✅ DEBUG: Using "expiry" field');
                } else if (firstItem.expiry_date) {
                    console.log('✅ DEBUG: Using "expiry_date" field');
                } else {
                    console.log('❌ DEBUG: No expiry field found! Available fields:', Object.keys(firstItem));
                }
            } else {
                console.log('❌ DEBUG: No items in response or API failed');
            }
        })
        .catch(error => {
            console.error('❌ DEBUG - Error:', error);
        });
}
// ==================== INITIALIZATION ====================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded - Initializing Pantry+');
    
    initializeTabs();
    initializeEventListeners();
    loadInitialData();
});

function initializeTabs() {
    // Tab Navigation - FIXED WITH EVENT DELEGATION
    document.addEventListener('click', function(e) {
        if (e.target.closest('.tab')) {
            const tab = e.target.closest('.tab');
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
            
            // Load data for specific tabs
            if (tabId === 'pantry') {
                setTimeout(loadPantryItemsFromBackend, 100);
            } else if (tabId === 'shopping') {
                setTimeout(loadShoppingListFromBackend, 100);
            } else if (tabId === 'allergy') {
                setTimeout(loadUserPreferences, 100);
            }
            // 🆕 ADD THESE 2 LINES RIGHT HERE:
            else if (tabId === 'overview') {
                setTimeout(loadOverviewData, 100);
                
            }
            else if (tabId === 'reports') {
                setTimeout(loadReportsData, 100);
            }
            // 🆕 END OF ADDITION
        }
    });
}
function initializeEventListeners() {
    console.log('🔧 Initializing event listeners...');
    
    // Shopping list checkboxes - using event delegation
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.closest('.shopping-item')) {
            e.target.closest('.shopping-item').classList.toggle('checked', e.target.checked);
        }
    });
    
    // Allergy filter toggle - FIXED WITH NULL CHECK
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            const filters = document.getElementById('allergyFilters');
            if (filters) {
                filters.style.display = filters.style.display === 'none' ? 'grid' : 'none';
            }
        });
    }
    
    // Add item button - FIXED WITH NULL CHECK
    const addItemBtn = document.getElementById('addItemBtn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', showAddItemModal);
    }
    
    // Scan item button - FIXED WITH NULL CHECK
    const scanItemBtn = document.getElementById('scanItemBtn');
    if (scanItemBtn) {
        scanItemBtn.addEventListener('click', startRealBarcodeScanner);
    }
    
    // 🆕 CRITICAL FIX: Load preferences when allergy tab is clicked
    document.addEventListener('click', function(e) {
        if (e.target.closest('.tab') && e.target.closest('.tab').getAttribute('data-tab') === 'allergy') {
            console.log('🔍 Allergy tab clicked - loading preferences...');
            setTimeout(loadUserPreferences, 100);
        }
    });
    
    // 🆕 Auto-load preferences when page loads
    setTimeout(() => {
        console.log('🔍 Auto-loading preferences on page load...');
        loadUserPreferences();
    }, 1000);
    
    // Add hover animations - FIXED WITH EVENT DELEGATION
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.ingredient-card, .recipe-card')) {
            const card = e.target.closest('.ingredient-card, .recipe-card');
            card.style.transform = 'translateY(-5px) scale(1.02)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.ingredient-card, .recipe-card')) {
            const card = e.target.closest('.ingredient-card, .recipe-card');
            card.style.transform = 'translateY(0) scale(1)';
        }
    });
}

function loadInitialData() {
    console.log('🔄 Loading initial data...');
    setTimeout(debugBackendResponse, 500);
    
    // 🆕 FORCE LOAD PANTRY ITEMS ON PAGE LOAD
    console.log('🔍 Auto-loading pantry items on page load...');
    setTimeout(loadPantryItemsFromBackend, 1000);
    
    // Load shopping list if shopping tab is active
    if (document.getElementById('shopping')?.classList.contains('active')) {
        setTimeout(loadShoppingListFromBackend, 200);
    }
    
    // 🆕 CRITICAL FIX: ALWAYS load preferences on page load, regardless of active tab
    console.log('🔍 AUTO-LOADING preferences on page load...');
    setTimeout(loadUserPreferences, 300);
}
// ==================== MODAL FUNCTIONS ====================

function showAddItemModal() {
    const modalHTML = `
        <div class="modal-overlay" id="addItemModal" style="display: flex;">
            <div class="modal-content">
                <h3>🍎 Add New Item to Pantry</h3>
                <form id="addItemForm">
                    <input type="text" id="itemName" placeholder="Item Name (e.g., Milk, Eggs)" required>
                    <select id="itemCategory">
                        <option value="dairy">🥛 Dairy</option>
                        <option value="vegetables">🥦 Vegetables</option>
                        <option value="fruits">🍎 Fruits</option>
                        <option value="meat">🍗 Meat</option>
                        <option value="grains">🍞 Grains</option>
                        <option value="other">📦 Other</option>
                    </select>
                    <input type="date" id="expiryDate" required>
                    <input type="number" id="itemQuantity" placeholder="Quantity" value="1" min="1">
                    
                    <div class="modal-buttons">
                        <button type="submit" class="btn" style="flex: 1;">Add Item</button>
                        <button type="button" onclick="closeModal()" class="btn" style="background: #6c757d; flex: 1;">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add form submit listener
    document.getElementById('addItemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('itemName').value;
        const category = document.getElementById('itemCategory').value;
        const expiry = document.getElementById('expiryDate').value;
        const quantity = document.getElementById('itemQuantity').value;
        
        saveItemToBackend(name, category, expiry, quantity);
        closeModal();
    });
}

function closeModal() {
    const modal = document.getElementById('addItemModal');
    if (modal) modal.remove();
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.id === 'addItemModal') {
        closeModal();
    }
});

// ==================== PANTRY ITEM FUNCTIONS ====================

function createIngredientCard(name, category, expiry, quantity, itemId) {
    console.log('📅 DEBUG: Processing item:', name, 'Expiry:', expiry, 'Type:', typeof expiry);
    
    // 🆕 FIXED: Simple and reliable date calculation
    let expiryDisplay = 'No date set';
    
    try {
    // Check if we have a valid expiry date
    if (expiry && expiry !== 'null' && expiry !== 'undefined' && expiry !== '0000-00-00') {
        console.log('🔍 DEBUG: Raw expiry value:', expiry);

        // Parse expiry value (ISO string from backend)
        const expiryDate = new Date(expiry);
        const today = new Date();

        // Simple validation - check if it's a valid date
        if (expiryDate instanceof Date && !isNaN(expiryDate.getTime())) {
            // Calculate difference in days
            const diffTime = expiryDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            console.log('✅ DEBUG: Date calculation successful - Days:', diffDays);

            // Format display
            if (diffDays === 0) {
                expiryDisplay = 'Today';
            } else if (diffDays === 1) {
                expiryDisplay = 'Tomorrow';
            } else if (diffDays > 1) {
                expiryDisplay = `${diffDays} days`;
            } else if (diffDays === -1) {
                expiryDisplay = 'Yesterday';
            } else {
                expiryDisplay = 'Expired';
            }
        } else {
            console.log('❌ DEBUG: Invalid date object');
            expiryDisplay = 'Invalid date';
        }
    } else {
        console.log('❌ DEBUG: Missing or empty expiry date');
        expiryDisplay = 'No date set';
    }
} catch (error) {
    console.error('❌ DEBUG: Date error:', error, 'Expiry value:', expiry);
    expiryDisplay = 'Date error';
}
    // Rest of your function remains the same...
    const icons = {
        'dairy': '🥛',
        'vegetables': '🥦', 
        'fruits': '🍎',
        'meat': '🍗',
        'grains': '🍞',
        'beverages': '🥤',
        'other': '📦'
    };
    
    const icon = icons[category] || '🍎';
    
    // Create the card HTML
    const newCardHTML = `
        <div class="ingredient-card">
            <div class="ingredient-icon">${icon}</div>
            <h3>${name}</h3>
            <p>Expires: ${expiryDisplay}</p>
            <p>Qty: ${quantity}</p>
            <span class="allergy-tag">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
            
            <div class="action-buttons">
                <button class="edit-btn" onclick="showEditModal(${itemId}, '${name.replace(/'/g, "\\'")}', '${category}', '${expiry}', ${quantity})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" onclick="deletePantryItem(${itemId}, '${name}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    // Add to the pantry grid
    const pantryGrid = document.querySelector('.pantry-grid');
    if (pantryGrid) {
        pantryGrid.insertAdjacentHTML('beforeend', newCardHTML);
    }
}
// 🆕 EDIT MODAL FUNCTION
function showEditModal(itemId, currentName, currentCategory, currentExpiry, currentQuantity) {
    const modalHTML = `
        <div class="modal-overlay" id="editItemModal" style="display: flex;">
            <div class="modal-content">
                <h3>✏️ Edit Item</h3>
                <form id="editItemForm">
                    <input type="text" id="editItemName" value="${currentName}" placeholder="Item Name" required>
                    
                    <select id="editItemCategory">
                        <option value="dairy" ${currentCategory === 'dairy' ? 'selected' : ''}>🥛 Dairy</option>
                        <option value="vegetables" ${currentCategory === 'vegetables' ? 'selected' : ''}>🥦 Vegetables</option>
                        <option value="fruits" ${currentCategory === 'fruits' ? 'selected' : ''}>🍎 Fruits</option>
                        <option value="meat" ${currentCategory === 'meat' ? 'selected' : ''}>🍗 Meat</option>
                        <option value="grains" ${currentCategory === 'grains' ? 'selected' : ''}>🍞 Grains</option>
                        <option value="beverages" ${currentCategory === 'beverages' ? 'selected' : ''}>🥤 Beverages</option>
                        <option value="other" ${currentCategory === 'other' ? 'selected' : ''}>📦 Other</option>
                    </select>
                    
                    <input type="date" id="editExpiryDate" value="${currentExpiry}" required>
                    <input type="number" id="editItemQuantity" value="${currentQuantity}" min="1" max="100">
                    
                    <div class="modal-buttons">
                        <button type="submit" class="btn" style="flex: 1;">💾 Save Changes</button>
                        <button type="button" onclick="closeEditModal()" class="btn" style="background: #6c757d; flex: 1;">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add form submit listener
    document.getElementById('editItemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('editItemName').value;
        const category = document.getElementById('editItemCategory').value;
        const expiry = document.getElementById('editExpiryDate').value;
        const quantity = document.getElementById('editItemQuantity').value;
        
        updatePantryItem(itemId, name, category, expiry, quantity);
        closeEditModal();
    });
}

// 🆕 CLOSE EDIT MODAL
function closeEditModal() {
    const modal = document.getElementById('editItemModal');
    if (modal) modal.remove();
}

// 🆕 UPDATE PANTRY ITEM
async function updatePantryItem(itemId, name, category, expiry, quantity) {
    try {
        const response = await fetch(`/api/pantry/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                category: category,
                expiry: expiry,
                quantity: quantity
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage(`✅ ${result.message}`);
            loadPantryItemsFromBackend(); // Refresh the list
        } else {
            showErrorMessage('❌ Failed to update item');
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('❌ Could not connect to server');
    }
}

async function saveItemToBackend(name, category, expiry, quantity) {
    try {
        const response = await fetch('/api/pantry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                category: category,
                expiry: expiry,
                quantity: quantity
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            createIngredientCard(name, category, expiry, quantity, result.item.id);
            showSuccessMessage(`✅ ${result.message}`);
        } else {
            showErrorMessage('❌ Failed to save item');
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('❌ Could not connect to server');
    }
}

// ==================== RECIPE FILTERING ====================

function filterRecipes() {
    const showDairy = document.getElementById('dairy')?.checked ?? true;
    const showNuts = document.getElementById('nuts')?.checked ?? true;
    
    document.querySelectorAll('.recipe-card').forEach(card => {
        const isSafe = !card.querySelector('.allergy-warning');
        const containsDairy = card.textContent.includes('Dairy');
        const containsNuts = card.textContent.includes('Nuts');
        
        let shouldShow = true;
        
        if (!showDairy && containsDairy) shouldShow = false;
        if (!showNuts && containsNuts) shouldShow = false;
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// ==================== ENHANCED BARCODE SCANNER ====================

async function startRealBarcodeScanner() {
    const scannerHTML = `
        <div class="scanner-overlay" id="scannerModal">
            <div class="scanner-container">
                <h3>📷 Scan Barcode</h3>
                <div class="scanner-frame">
                    <video id="scanner-video" autoplay playsinline></video>
                </div>
                <p>Point camera at barcode - it will scan automatically</p>
                <div class="modal-buttons">
                    <button class="btn" onclick="stopScanner()">Cancel</button>
                </div>
            </div>
            <div class="scanner-instructions">
                <p>💡 Hold steady and ensure good lighting</p>
                <p>📱 Works with QR codes and product barcodes</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', scannerHTML);
    await initializeRealScanner();
}

async function initializeRealScanner() {
    const video = document.getElementById('scanner-video');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        video.srcObject = stream;
        document.getElementById('scannerModal').style.display = 'flex';
        startBarcodeDetection(video);
        
    } catch (error) {
        showErrorMessage('Camera access denied or not supported. Please allow camera permissions.');
        stopScanner();
    }
}

function startBarcodeDetection(video) {
    if (!('BarcodeDetector' in window)) {
        showErrorMessage('Barcode scanning not supported in this browser. Try Chrome or Edge.');
        stopScanner();
        return;
    }
    
    const barcodeDetector = new BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code']
    });
    
    let scanCount = 0;
    const maxScans = 50;
    
    function detectBarcode() {
        if (scanCount >= maxScans) return;
        scanCount++;
        
        barcodeDetector.detect(video)
            .then(barcodes => {
                if (barcodes.length > 0) {
                    const barcode = barcodes[0];
                    handleRealScannedBarcode(barcode.rawValue, barcode.format);
                } else {
                    setTimeout(detectBarcode, 500);
                }
            })
            .catch(error => {
                console.error('Barcode detection error:', error);
                setTimeout(detectBarcode, 1000);
            });
    }
    
    video.addEventListener('playing', () => {
        setTimeout(detectBarcode, 1000);
    });
}

// 🎯 HYBRID BARCODE LOOKUP
async function lookupProductOnline(barcode) {
    console.log(`🔍 Hybrid lookup for: ${barcode}`);
    
    // 1. Open Food Facts API
    let product = await lookupOpenFoodFacts(barcode);
    if (product) return product;
    
    // 2. Indian Products Database
    product = lookupExpandedIndianDatabase(barcode);
    if (product) return product;
    
    // 3. Smart Guess
    return generateSmartGuessFromBarcode(barcode);
}

async function lookupOpenFoodFacts(barcode) {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();
        
        if (data.status === 1 && data.product) {
            const product = data.product;
            return {
                name: product.product_name || product.generic_name || 'Unknown Product',
                category: getCategoryFromProduct(product),
                brand: product.brands || '',
                source: 'Open Food Facts'
            };
        }
    } catch (error) {
        console.error('Open Food Facts lookup failed:', error);
    }
    return null;
}

function lookupExpandedIndianDatabase(barcode) {
    const indianProducts = {
        // Biscuits & Snacks
        '8901012000018': { name: 'Parle-G Biscuits', category: 'grains' },
        '8901012001244': { name: 'Parle-G Glucose Biscuits', category: 'grains' },
        '8901063100012': { name: 'Britannia Good Day Biscuits', category: 'grains' },
        '8901063700015': { name: 'Britannia Bourbon Biscuits', category: 'grains' },
        '8901063900018': { name: 'Britannia Tiger Kreemz', category: 'grains' },
        '8901063300019': { name: 'Britannia Milk Bikis', category: 'grains' },
        '8901063800012': { name: 'Britannia 50-50 Biscuits', category: 'grains' },
        '8901063200016': { name: 'Britannia Marie Gold', category: 'grains' },
        
        // Tea & Coffee
        '8901491000016': { name: 'Tata Tea Premium', category: 'beverages' },
        '8901491000023': { name: 'Tata Tea Gold', category: 'beverages' },
        '8901051000014': { name: 'Brooke Bond Red Label Tea', category: 'beverages' },
        
        // Noodles & Pasta
        '8901063000017': { name: 'Maggi Noodles', category: 'grains' },
        '8901063000024': { name: 'Maggi Masala Noodles', category: 'grains' },
        
        // Dairy
        '8904004200016': { name: 'Amul Milk', category: 'dairy' },
        '8904004200047': { name: 'Amul Butter', category: 'dairy' },
        '8904004200054': { name: 'Amul Cheese', category: 'dairy' },
        
        // Chocolates
        '8901012000254': { name: 'Nestle Munch', category: 'other' },
        '8901012000261': { name: 'Nestle KitKat', category: 'other' },
    };
    
    return indianProducts[barcode] || null;
}

function generateSmartGuessFromBarcode(barcode) {
    const barcodeStr = barcode.toString();
    let guessedName = 'Food Product';
    let guessedCategory = 'other';
    
    if (barcodeStr.startsWith('8901')) {
        guessedName = 'Indian Packaged Food';
        guessedCategory = 'grains';
    }
    else if (barcodeStr.startsWith('8901063')) {
        guessedName = 'Noodles/Pasta Product';
        guessedCategory = 'grains';
    }
    else if (barcodeStr.startsWith('8901491')) {
        guessedName = 'Tea/Coffee Product';
        guessedCategory = 'beverages';
    }
    else if (barcodeStr.startsWith('8904004')) {
        guessedName = 'Dairy Product';
        guessedCategory = 'dairy';
    }
    
    return {
        name: guessedName,
        category: guessedCategory,
        source: 'Smart Guess'
    };
}

function getCategoryFromProduct(product) {
    const categories = product.categories || '';
    const productName = (product.product_name || product.generic_name || '').toLowerCase();
    
    if (productName.includes('biscuit') || productName.includes('cookie') || categories.includes('biscuits')) return 'grains';
    if (productName.includes('tea') || productName.includes('coffee') || categories.includes('tea')) return 'beverages';
    if (productName.includes('noodle') || productName.includes('pasta') || categories.includes('noodles')) return 'grains';
    if (productName.includes('chocolate') || categories.includes('chocolate')) return 'other';
    if (productName.includes('milk') || productName.includes('cheese') || categories.includes('dairy')) return 'dairy';
    if (productName.includes('bread') || categories.includes('bread')) return 'grains';
    
    return 'other';
}

// 🆕 AUTOMATIC BARCODE HANDLING - FIXED VERSION
async function handleRealScannedBarcode(barcodeData, format) {
    console.log(`📷 Scanned barcode: ${barcodeData}`);
    stopScanner();
    showScanningMessage('Searching global food databases...');
    
    const productInfo = await lookupProductOnline(barcodeData);
    
    // 🚨 FIX: Automatically add to pantry after scanning
    if (productInfo && productInfo.name) {
        console.log('✅ Product found, adding to pantry:', productInfo);
        
        // Calculate expiry date (7 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        const expiryString = expiryDate.toISOString().split('T')[0];
        
        // Add to pantry directly
        await saveItemToBackend(productInfo.name, productInfo.category, expiryString, 1);
        
        showSuccessMessage(`✅ Added "${productInfo.name}" to pantry!`);
        
        // Refresh pantry if on pantry tab
        if (document.getElementById('pantry')?.classList.contains('active')) {
            loadPantryItemsFromBackend();
        }
    } else {
        showErrorMessage('❌ Could not find product information');
    }
}

async function autoAddToPantry(productInfo, barcodeData) {
    const name = productInfo.name;
    const category = productInfo.category;
    const source = productInfo.source || 'Unknown';
    
    const expiryDays = getDefaultExpiryDays(category);
    const expiryDate = new Date(expiry);
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    try {
        const response = await fetch('/api/pantry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                category: category,
                expiry: expiryDate.toISOString().split('T')[0],
                quantity: 1,
                source: source,
                barcode: barcodeData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage(`✅ Added: ${name} (Source: ${source})`);
            if (document.getElementById('pantry')?.classList.contains('active')) {
                loadPantryItemsFromBackend();
            }
        }
    } catch (error) {
        console.error('Auto-add failed:', error);
        showErrorMessage('❌ Failed to add item automatically');
    }
}

function getDefaultExpiryDays(category) {
    const expiryDefaults = {
        'dairy': 7,
        'fruits': 5,
        'vegetables': 7,
        'meat': 3,
        'grains': 30,
        'beverages': 90,
        'other': 30
    };
    return expiryDefaults[category] || 30;
}

function stopScanner() {
    const scannerModal = document.getElementById('scannerModal');
    if (scannerModal) {
        const video = document.getElementById('scanner-video');
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        scannerModal.remove();
    }
}

// ==================== SHOPPING LIST FUNCTIONS ====================

function addToShoppingList(itemName) {
    fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: itemName
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showSuccessMessage(`✅ ${result.message}`);
            loadShoppingListFromBackend();
        }
    });
}

async function loadShoppingListFromBackend() {
    try {
        const response = await fetch('/api/shopping-list');
        const result = await response.json();
        
        if (result.success) {
            const shoppingListContainer = document.querySelector('.shopping-list');
            if (shoppingListContainer) {
                shoppingListContainer.innerHTML = '';
                
                const completedItems = result.items.filter(item => item.completed);
                if (completedItems.length > 0) {
                    const clearButtonHTML = `
                        <div class="shopping-actions">
                            <button class="btn-clear" onclick="clearCompletedShoppingItems()">
                                <i class="fas fa-broom"></i> Clear Completed (${completedItems.length})
                            </button>
                        </div>
                    `;
                    shoppingListContainer.insertAdjacentHTML('beforeend', clearButtonHTML);
                }
                
                result.items.forEach(item => {
                    const itemHTML = `
                        <div class="shopping-item ${item.completed ? 'checked' : ''}">
                            <input type="checkbox" ${item.completed ? 'checked' : ''} 
                                   onchange="toggleShoppingItem(${item.id}, this.checked)">
                            <span>${item.name}</span>
                            <button class="delete-btn-small" onclick="deleteShoppingItem(${item.id}, '${item.name}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    shoppingListContainer.insertAdjacentHTML('beforeend', itemHTML);
                });
            }
        }
    } catch (error) {
        console.error('Error loading shopping list:', error);
    }
}

function toggleShoppingItem(itemId, completed) {
    console.log(`Item ${itemId} marked as ${completed ? 'completed' : 'incomplete'}`);
}

function addManualShoppingItem() {
    const itemName = prompt('Enter item name:');
    if (itemName) {
        addToShoppingList(itemName);
    }
}

// ==================== DELETE FUNCTIONS ====================

async function deletePantryItem(itemId, itemName) {
    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
        try {
            const response = await fetch(`/api/pantry/${itemId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessMessage(`✅ ${result.message}`);
                loadPantryItemsFromBackend();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            showErrorMessage('❌ Could not delete item');
        }
    }
}

async function deleteShoppingItem(itemId, itemName) {
    if (confirm(`Remove "${itemName}" from shopping list?`)) {
        try {
            const response = await fetch(`/api/shopping-list/${itemId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessMessage(`✅ ${result.message}`);
                loadShoppingListFromBackend();
            }
        } catch (error) {
            console.error('Error deleting shopping item:', error);
            showErrorMessage('❌ Could not remove item');
        }
    }
}

function clearCompletedShoppingItems() {
    if (confirm('Clear all completed items?')) {
        showSuccessMessage('✅ Completed items cleared!');
        loadShoppingListFromBackend();
    }
}

// ==================== USER PREFERENCES FUNCTIONS ====================

// 🆕 DEBUG VERSION: Create custom allergy UI function
function createCustomAllergyUI(allergyName, customId = null) {
    console.log('🔧 [DEBUG] Creating custom allergy UI for:', allergyName);
    
    const newAllergyId = customId || 'custom-allergy-' + allergyName.toLowerCase().replace(/\s+/g, '-');
    
    // Check if this allergy already exists
    const existingAllergy = document.querySelector(`[data-allergy-name="${allergyName.toLowerCase()}"]`);
    if (existingAllergy) {
        console.log('⚠️ [DEBUG] Allergy already exists, skipping:', allergyName);
        return;
    }
    
    console.log('✅ [DEBUG] No duplicate found, creating new allergy:', allergyName);
    
    const allergyHTML = `
        <div class="allergy-option" id="${newAllergyId}" data-allergy-name="${allergyName.toLowerCase()}">
            <input type="checkbox" id="${newAllergyId}-input" checked>
            <span class="allergy-icon">⚠️</span>
            <label for="${newAllergyId}-input" data-allergy="${allergyName.toLowerCase()}">
                <strong>Avoid ${allergyName}</strong><br><small>Custom allergy</small>
            </label>
            <button class="delete-btn-small" onclick="deleteCustomItem('${newAllergyId}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    const allergySection = document.querySelector('#allergy .card:first-child .allergy-filters');
    if (allergySection) {
        console.log('✅ [DEBUG] Adding allergy to section:', allergyName);
        allergySection.insertAdjacentHTML('beforeend', allergyHTML);
    } else {
        console.log('❌ [DEBUG] ERROR: Allergy section not found!');
    }
}

// Load user preferences from backend - FIXED VERSION
async function loadUserPreferences() {
    try {
        console.log('🔍 Loading user preferences from API...');
        const response = await fetch('/api/preferences/1');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📦 API Response:', result);
        
        if (result.success) {
            console.log('✅ Loaded preferences from database:', result.preferences);
            updatePreferencesUI(result.preferences);
            return result.preferences;
        } else {
            console.error('❌ API returned error:', result.message);
            showErrorMessage('Failed to load preferences: ' + result.message);
        }
    } catch (error) {
        console.error('❌ Error loading preferences:', error);
        showErrorMessage('Could not connect to server');
    }
    return null;
}

// Update UI with current preferences - FIXED VERSION
function updatePreferencesUI(preferences) {
    if (!preferences) {
        console.log('❌ No preferences to update');
        return;
    }
    
    console.log('🎨 Updating UI with preferences:', preferences);
    
    // Update allergy checkboxes
    const allergyMap = {
        'dairy': 'dairy',
        'nuts': 'nuts', 
        'gluten': 'gluten',
        'eggs': 'eggs',
        'seafood': 'seafood',
        'soy': 'soy'
    };
    
    // Update diet checkboxes
    const dietMap = {
        'vegetarian': 'vegetarian',
        'vegan': 'vegan',
        'low-carb': 'low-carb',
        'low-calorie': 'low-calorie'
    };
    
    // Set allergy checkboxes
    Object.entries(allergyMap).forEach(([prefKey, checkboxId]) => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            const shouldBeChecked = preferences.allergies.includes(prefKey);
            checkbox.checked = shouldBeChecked;
            console.log(`📝 Setting ${checkboxId} to ${shouldBeChecked} (allergy: ${prefKey})`);
        } else {
            console.log(`❌ Checkbox not found: ${checkboxId}`);
        }
    });
    
    // Set diet checkboxes
    Object.entries(dietMap).forEach(([prefKey, checkboxId]) => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            const shouldBeChecked = preferences.diets.includes(prefKey);
            checkbox.checked = shouldBeChecked;
            console.log(`📝 Setting ${checkboxId} to ${shouldBeChecked} (diet: ${prefKey})`);
        } else {
            console.log(`❌ Checkbox not found: ${checkboxId}`);
        }
    });
    
    // 🆕 FIXED: RECREATE CUSTOM ALLERGIES FROM DATABASE
    preferences.allergies.forEach(allergy => {
        const predefined = ['dairy', 'nuts', 'gluten', 'eggs', 'seafood', 'soy'];
        if (!predefined.includes(allergy)) {
            createCustomAllergyUI(allergy);
        }
    });
    
    console.log('✅ UI update complete');
}

// 🆕 FIXED: Get ALL allergies including custom ones
function getAllAllergies() {
    const allergies = [];
    
    // Get predefined allergy checkboxes
    const allergyCheckboxes = {
        'dairy': 'dairy',
        'nuts': 'nuts',
        'gluten': 'gluten', 
        'eggs': 'eggs',
        'seafood': 'seafood',
        'soy': 'soy'
    };
    
    // Add predefined allergies
    Object.entries(allergyCheckboxes).forEach(([key, checkboxId]) => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox && checkbox.checked) {
            allergies.push(key);
        }
    });
    
    // 🆕 FIXED: ADD CUSTOM ALLERGIES
const customAllergies = document.querySelectorAll('[id^="custom-allergy-"] input[type="checkbox"]');
customAllergies.forEach(checkbox => {
    if (checkbox.checked) {
        const label = checkbox.closest('.allergy-option').querySelector('label');
        
        // 🆕 SIMPLE FIX: Use data attribute instead of text parsing
        const allergyName = label.getAttribute('data-allergy');
        
        console.log('🔍 DEBUG: Extracted allergy from data attribute:', allergyName);
        
        if (allergyName) {
            allergies.push(allergyName);
        }
    }
});
    
    console.log('📋 All allergies to save:', allergies);
    return allergies;
}

// Save preferences to backend - UPDATED TO INCLUDE CUSTOM ALLERGIES
async function savePreferencesToBackend() {
    const allergies = getAllAllergies(); // 🆕 Use the new function
    const diets = [];
    
    console.log('💾 Starting to save preferences...');
    
    // Collect diet preferences
    const dietCheckboxes = {
        'vegetarian': 'vegetarian',
        'vegan': 'vegan', 
        'low-carb': 'low-carb',
        'low-calorie': 'low-calorie'
    };
    
    Object.entries(dietCheckboxes).forEach(([key, checkboxId]) => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox && checkbox.checked) {
            diets.push(key);
        }
    });
    
    console.log('📦 Final data to save:', { allergies, diets });
    
    try {
        const response = await fetch('/api/preferences/1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                allergies: allergies,
                diets: diets,
                notifications_enabled: true
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Preferences saved successfully!');
            showSuccessMessage('✅ Preferences saved successfully!');
        } else {
            console.error('❌ Failed to save preferences:', result.message);
            showErrorMessage('❌ Failed to save preferences');
        }
    } catch (error) {
        console.error('Error saving preferences:', error);
        showErrorMessage('❌ Could not connect to server');
    }
}

// ==================== ALLERGY & PREFERENCE FUNCTIONS ====================

function addNewAllergy() {
    const allergyName = prompt('Enter new allergy name (e.g., Shellfish, Sesame, etc.):');
    if (allergyName && allergyName.trim() !== '') {
        createCustomAllergyUI(allergyName);
        showSuccessMessage(`✅ Added "${allergyName}" to allergies`);
        
        // 🆕 AUTO-SAVE after adding new allergy
        setTimeout(savePreferencesToBackend, 500);
    }
}

function addNewDietPreference() {
    const dietName = prompt('Enter new diet preference (e.g., Paleo, Mediterranean, etc.):');
    if (dietName && dietName.trim() !== '') {
        const newDietId = 'custom-diet-' + Date.now();
        
        const dietHTML = `
            <div class="allergy-option" id="${newDietId}">
                <input type="checkbox" id="${newDietId}-input" checked>
                <span class="allergy-icon">🍽️</span>
                <label for="${newDietId}-input"><strong>${dietName}</strong><br><small>Custom diet</small></label>
                <button class="delete-btn-small" onclick="deleteCustomItem('${newDietId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        const dietSection = document.querySelector('#allergy .card:last-child .allergy-filters');
        if (dietSection) {
            dietSection.insertAdjacentHTML('beforeend', dietHTML);
            showSuccessMessage(`✅ Added "${dietName}" to diet preferences`);
        }
    }
}

function deleteCustomItem(itemId) {
    const itemElement = document.getElementById(itemId);
    if (itemElement) {
        const itemName = itemElement.querySelector('label').textContent.split('\n')[0];
        if (confirm(`Remove "${itemName}"?`)) {
            itemElement.remove();
            showSuccessMessage(`✅ Removed "${itemName}"`);
            // 🆕 AUTO-SAVE after deleting custom item
            setTimeout(savePreferencesToBackend, 500);
        }
    }
}

function saveAllPreferences() {
    console.log('💾 Save All button clicked!');
    savePreferencesToBackend();
}

function clearAllPreferences() {
    if (confirm('Clear all custom allergies and diets?')) {
        const customItems = document.querySelectorAll('[id^="custom-allergy-"], [id^="custom-diet-"]');
        customItems.forEach(item => item.remove());
        showSuccessMessage('✅ All custom preferences cleared!');
        // 🆕 AUTO-SAVE after clearing
        setTimeout(savePreferencesToBackend, 500);
    }
}

// ==================== UTILITY FUNCTIONS ====================

function showScanningMessage(message) {
    console.log(`🔍 ${message}`);
}

function showSuccessMessage(message) {
    // Create a success toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #40c057;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        font-weight: bold;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

function showErrorMessage(message) {
    // Create an error toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        font-weight: bold;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// ==================== RECEIPT SCANNING ====================

function processReceipt() {
    const receiptText = document.getElementById('receiptText')?.value;
    
    if (!receiptText?.trim()) {
        showErrorMessage('Please paste your receipt text first!');
        return;
    }
    
    const items = extractItemsFromReceipt(receiptText);
    
    if (items.length === 0) {
        showErrorMessage('No items found in receipt. Please check the format.');
        return;
    }
    
    items.forEach(item => {
        saveItemToBackend(item.name, item.category, item.expiry, item.quantity);
    });
    
    showSuccessMessage(`✅ Added ${items.length} items from receipt to your pantry!`);
    document.getElementById('receiptText').value = '';
}

function extractItemsFromReceipt(text) {
    const lines = text.split('\n');
    const items = [];
    const ignoreWords = ['total', 'subtotal', 'tax', 'cash', 'change', 'balance', 'card', 'thank', 'store', 'mart', 'price', 'amount'];
    
    for (let line of lines) {
        let cleanLine = line.trim();
        
        if (!cleanLine || ignoreWords.some(word => cleanLine.toLowerCase().includes(word))) {
            continue;
        }
        
        const productName = extractProductName(cleanLine);
        
        if (productName && productName.length > 2) {
            const category = guessCategory(productName);
            const quantity = extractQuantity(cleanLine);
            
        const expiryDate = new Date(expiry);
        expiryDate.setDate(expiryDate.getDate() + 7);
        
    
        items.push({
            name: productName,
            category: category,
            expiry: expiryDate.toISOString().split('T')[0],
            quantity: quantity || 1
        });
        }
    }
    
    return items;
}

function extractProductName(line) {
    let name = line.replace(/\d+\.\d{2}/g, '');
    name = name.replace(/\d+/g, '');
    name = name.replace(/[@#]/g, '');
    
    const words = name.split(' ')
        .filter(word => word.length > 2)
        .filter(word => !['LB', 'PK', 'GAL', 'L', 'ML', 'OZ', 'EA'].includes(word.toUpperCase()));
    
    return words.join(' ').trim();
}

function guessCategory(productName) {
    const name = productName.toLowerCase();
    
    if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || name.includes('butter')) return 'dairy';
    if (name.includes('egg')) return 'dairy';
    if (name.includes('bread') || name.includes('pasta') || name.includes('rice') || name.includes('cereal')) return 'grains';
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || name.includes('fish')) return 'meat';
    if (name.includes('apple') || name.includes('banana') || name.includes('orange') || name.includes('berry')) return 'fruits';
    if (name.includes('tomato') || name.includes('carrot')) return 'vegetables';
    
    return 'other';
}
// ==================== SIMPLE OVERVIEW FUNCTIONS ====================

// Load overview data
async function loadOverviewData() {
    console.log('🔄 Loading overview data...');
    
    try {
        // Load pantry items
        const pantryResponse = await fetch('/api/pantry');
        const pantryResult = await pantryResponse.json();
        
        if (pantryResult.success) {
            // Update pantry count
            document.getElementById('pantryCount').textContent = pantryResult.items.length;
            
            // Count expiring items (≤5 days)
            const expiringItems = pantryResult.items.filter(item => {
                if (!item.expiry && !item.expiry_date) return false;
                const expiry = item.expiry || item.expiry_date;
                const expiryDate = new Date(expiry);
                const today = new Date();
                const diffTime = expiryDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 5 && diffDays >= 0;
            });
            
            document.getElementById('expiringCount').textContent = expiringItems.length;
            
            // Update expiry alerts
            updateExpiryAlerts(pantryResult.items);
        }
        
        // Load allergy count
        const prefResponse = await fetch('/api/preferences/1');
        const prefResult = await prefResponse.json();
        if (prefResult.success) {
            document.getElementById('allergyFiltersCount').textContent = prefResult.preferences.allergies.length;
        }
        
        // Set safe recipes count
        document.getElementById('safeRecipesCount').textContent = "0";
        
    } catch (error) {
        console.error('❌ Error loading overview:', error);
    }
}

// Update expiry alerts
function updateExpiryAlerts(pantryItems) {
    const container = document.getElementById('expiryAlertsContainer');
    
    if (pantryItems.length === 0) {
        container.innerHTML = `
            <div class="alert-item">
                <i class="fas fa-check-circle"></i>
                <div style="margin-left: 15px;">
                    <strong>No pantry items found!</strong>
                </div>
            </div>
        `;
        return;
    }
    
    let alertsHTML = '';
    let hasExpiring = false;
    
    pantryItems.forEach(item => {
        if (!item.expiry && !item.expiry_date) return;
        
        const expiry = item.expiry || item.expiry_date;
        const expiryDate = new Date(expiry);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 5 && diffDays >= 0) {
            hasExpiring = true;
            const isUrgent = diffDays <= 2;
            
            alertsHTML += `
                <div class="alert-item ${isUrgent ? 'expiring' : ''}">
                    <i class="fas ${isUrgent ? 'fa-exclamation-triangle' : 'fa-clock'}"></i>
                    <div style="margin-left: 15px;">
                        <strong>${item.name}</strong> expires in ${diffDays} day${diffDays !== 1 ? 's' : ''}!
                    </div>
                </div>
            `;
        }
    });
    
    if (!hasExpiring) {
        alertsHTML = `
            <div class="alert-item">
                <i class="fas fa-check-circle"></i>
                <div style="margin-left: 15px;">
                    <strong>No items expiring in the next 5 days!</strong>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = alertsHTML;
}

// Auto-load overview when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('overview')?.classList.contains('active')) {
        setTimeout(loadOverviewData, 1000);
    }
});
// ==================== REPORTS PAGE FUNCTIONS ====================

// Load reports data
async function loadReportsData() {
    console.log('📊 Loading reports data...');
    
    try {
        // Load pantry items
        const pantryResponse = await fetch('/api/pantry');
        const pantryResult = await pantryResponse.json();
        
        if (pantryResult.success) {
            updateReportsStats(pantryResult.items);
            updateCategoryChart(pantryResult.items);
            updateExpiryTimeline(pantryResult.items);
            updateWasteStats(pantryResult.items);
        }
        
        // Load allergy count
        const prefResponse = await fetch('/api/preferences/1');
        const prefResult = await prefResponse.json();
        if (prefResult.success) {
            document.getElementById('activeFilters').textContent = prefResult.preferences.allergies.length;
        }
        
    } catch (error) {
        console.error('❌ Error loading reports:', error);
    }
}

// Update reports statistics
function updateReportsStats(pantryItems) {
    document.getElementById('totalItems').textContent = pantryItems.length;
    
    // Count expired items
    const expiredItems = pantryItems.filter(item => {
        if (!item.expiry && !item.expiry_date) return false;
        const expiry = item.expiry || item.expiry_date;
        const expiryDate = new Date(expiry);
        const today = new Date();
        return expiryDate < today;
    });
    
    document.getElementById('expiredItems').textContent = expiredItems.length;
    document.getElementById('safeRecipesCount').textContent = "0"; // You can calculate this later
}

// Update category chart
function updateCategoryChart(pantryItems) {
    const container = document.getElementById('categoryChart');
    
    if (pantryItems.length === 0) {
        container.innerHTML = '<div class="loading-chart">📦 No pantry items to display</div>';
        return;
    }
    
    // Count items by category
    const categoryCount = {};
    pantryItems.forEach(item => {
        const category = item.category || 'other';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    const totalItems = pantryItems.length;
    let chartHTML = '';
    
    Object.entries(categoryCount).forEach(([category, count]) => {
        const percentage = Math.round((count / totalItems) * 100);
        const categoryNames = {
            'dairy': 'Dairy 🥛',
            'vegetables': 'Vegetables 🥦',
            'fruits': 'Fruits 🍎',
            'meat': 'Meat 🍗',
            'grains': 'Grains 🍞',
            'beverages': 'Beverages 🥤',
            'other': 'Other 📦'
        };
        
        const displayName = categoryNames[category] || category;
        
        chartHTML += `
            <div class="chart-bar-item">
                <div class="chart-bar-label">${displayName}</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: ${percentage}%">
                        <span class="chart-bar-value">${count} items</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = chartHTML;
}

// Update expiry timeline
function updateExpiryTimeline(pantryItems) {
    const container = document.getElementById('expiryTimeline');
    
    if (pantryItems.length === 0) {
        container.innerHTML = '<div class="loading-timeline">📦 No pantry items to display</div>';
        return;
    }
    
    // Filter items with expiry dates and sort by date
    const itemsWithExpiry = pantryItems
        .filter(item => item.expiry || item.expiry_date)
        .sort((a, b) => {
            const dateA = new Date(a.expiry || a.expiry_date);
            const dateB = new Date(b.expiry || b.expiry_date);
            return dateA - dateB;
        })
        .slice(0, 10); // Show only top 10
    
    if (itemsWithExpiry.length === 0) {
        container.innerHTML = '<div class="loading-timeline">📅 No items with expiry dates</div>';
        return;
    }
    
    let timelineHTML = '';
    const today = new Date();
    
    itemsWithExpiry.forEach(item => {
        const expiry = item.expiry || item.expiry_date;
        const expiryDate = new Date(expiry);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let status = 'future';
        let statusText = '';
        
        if (diffDays < 0) {
            status = 'expired';
            statusText = 'Expired';
        } else if (diffDays <= 2) {
            status = 'expiring';
            statusText = 'Expiring soon';
        } else {
            statusText = `${diffDays} days left`;
        }
        
        timelineHTML += `
            <div class="timeline-item ${status}">
                <div class="timeline-date">${expiry}</div>
                <div class="timeline-content">
                    <strong>${item.name}</strong>
                    <div class="timeline-days">${statusText}</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = timelineHTML;
}

// Update waste statistics
function updateWasteStats(pantryItems) {
    const totalItems = pantryItems.length;
    
    // Count expired items (wasted)
    const wastedItems = pantryItems.filter(item => {
        if (!item.expiry && !item.expiry_date) return false;
        const expiry = item.expiry || item.expiry_date;
        const expiryDate = new Date(expiry);
        const today = new Date();
        return expiryDate < today;
    }).length;
    
    // Calculate usage rate (simple mock)
    const usedItems = Math.max(0, totalItems - wastedItems);
    const usageRate = totalItems > 0 ? Math.round(((totalItems - wastedItems) / totalItems) * 100) : 0;
    
    document.getElementById('usedItems').textContent = usedItems;
    document.getElementById('wastedItems').textContent = wastedItems;
    document.getElementById('usageRate').textContent = usageRate + '%';
}

// Load reports when tab is clicked
document.addEventListener('click', function(e) {
    if (e.target.closest('.tab') && e.target.closest('.tab').getAttribute('data-tab') === 'reports') {
        console.log('📊 Reports tab clicked - loading data...');
        setTimeout(loadReportsData, 100);
    }

});
