// src/game.js

// DOM References
const shopContainer = document.getElementById("shop-container");
const inventoryList = document.getElementById("inventory-list");
const messageContainer = document.getElementById("message-container");
const craftButton = document.getElementById("craft-button");

// Player Data
const player = {
  gold: 20,
  inventory: [],
  reputation: 0
};

// Game Content
let content = {
  shops: [],
  recipes: []
};

// Fetch content.json
async function loadContent() {
  try {
    const response = await fetch('/content.json');
    content = await response.json();
    showShops();
    updateInventory();
  } catch (err) {
    console.error("Error loading content.json:", err);
    showMessage("Failed to load game content.");
  }
}

// Display shops and items
function showShops() {
  shopContainer.innerHTML = "";
  content.shops.forEach((shop, shopIdx) => {
    const shopDiv = document.createElement("div");
    shopDiv.className = "mb-3 p-2 border rounded bg-cream-light";
    shopDiv.innerHTML = `<h3 class="text-lg font-semibold">${shop.name}</h3>`;

    shop.items.forEach((item, itemIdx) => {
      const btn = document.createElement("button");
      btn.textContent = `${item.name} - ${item.price} gold`;
      btn.className = "m-1 bg-green-200 px-2 py-1 rounded";
      btn.onclick = () => buyItem(shopIdx, itemIdx);
      shopDiv.appendChild(btn);
    });

    shopContainer.appendChild(shopDiv);
  });
}

// Buy an item
function buyItem(shopIdx, itemIdx) {
  const item = content.shops[shopIdx].items[itemIdx];
  const shop = content.shops[shopIdx];

  // Price may adjust based on shop personality
  let finalPrice = item.price;
  if (shop.personality === "friendly") finalPrice = Math.max(1, Math.floor(item.price * 0.9));
  if (shop.personality === "grumpy") finalPrice = Math.ceil(item.price * 1.2);

  if (player.gold >= finalPrice) {
    player.gold -= finalPrice;
    player.inventory.push(item.name);
    updateInventory();
    showMessage(`${shop.name} sold you ${item.name} for ${finalPrice} gold!`);
  } else {
    showMessage(`${shop.name} says: Not enough gold for ${item.name}`);
  }
}

// Update inventory display
function updateInventory() {
  inventoryList.innerHTML = "";
  player.inventory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

// Show a message
function showMessage(msg) {
  messageContainer.textContent = msg;
}

// Crafting
craftButton.addEventListener("click", () => {
  if (player.inventory.length < 2) {
    showMessage("You need at least 2 ingredients to craft!");
    return;
  }

  // Check all recipe combinations
  let craftedItem = null;
  for (const recipe of content.recipes) {
    if (recipe.ingredients.every(ing => player.inventory.includes(ing))) {
      craftedItem = recipe.name;
      // Remove used ingredients
      recipe.ingredients.forEach(ing => {
        const index = player.inventory.indexOf(ing);
        if (index > -1) player.inventory.splice(index, 1);
      });
      break;
    }
  }

  if (craftedItem) {
    updateInventory();
    showMessage(`You crafted: ${craftedItem}!`);
    player.reputation += 1;
  } else {
    showMessage("Combination didn't match any known recipe. Keep experimenting!");
  }
});

// Initialize game
loadContent();
