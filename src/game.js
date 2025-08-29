// src/game.js

// Game Data
const player = {
  gold: 20,
  inventory: []
};

const shops = [
  { name: "Herbalist's Hut", items: [{ name: "Lavender", price: 5 }, { name: "Rosemary", price: 3 }] },
  { name: "Crystal Cave", items: [{ name: "Amethyst", price: 10 }, { name: "Quartz", price: 7 }] }
];

// DOM References
const shopContainer = document.getElementById("shop-container");
const inventoryList = document.getElementById("inventory-list");
const messageContainer = document.getElementById("message-container");
const craftButton = document.getElementById("craft-button");

// Functions
function showShops() {
  shopContainer.innerHTML = "";
  shops.forEach((shop, idx) => {
    const shopDiv = document.createElement("div");
    shopDiv.innerHTML = `<h3>${shop.name}</h3>`;
    shop.items.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.textContent = `${item.name} - ${item.price} gold`;
      btn.onclick = () => buyItem(idx, i);
      shopDiv.appendChild(btn);
    });
    shopContainer.appendChild(shopDiv);
  });
}

function buyItem(shopIdx, itemIdx) {
  const item = shops[shopIdx].items[itemIdx];
  if (player.gold >= item.price) {
    player.gold -= item.price;
    player.inventory.push(item.name);
    updateInventory();
    showMessage(`Bought ${item.name}!`);
  } else {
    showMessage(`Not enough gold for ${item.name}`);
  }
}

function updateInventory() {
  inventoryList.innerHTML = "";
  player.inventory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

function showMessage(msg) {
  messageContainer.textContent = msg;
}

// Crafting
craftButton.addEventListener("click", () => {
  if (player.inventory.length >= 2) {
    const crafted = player.inventory.splice(0, 2).join(" + ");
    updateInventory();
    showMessage(`You crafted a potion: ${crafted}`);
  } else {
    showMessage("Not enough ingredients to craft");
  }
});

// Initialize
showShops();
updateInventory();

