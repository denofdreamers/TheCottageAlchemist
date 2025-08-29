// Cottage Alchemist Game Code

// Example items and shops
const shops = [
  { name: 'Herb Shop', items: ['Lavender', 'Chamomile', 'Mint'] },
  { name: 'Potion Supplies', items: ['Crystal Vial', 'Glass Jar', 'Magic Powder'] },
];

const inventory = [];

// DOM elements
const shopContainer = document.getElementById('shop-container');
const inventoryList = document.getElementById('inventory-list');
const craftButton = document.getElementById('craft-button');
const messageContainer = document.getElementById('message-container');

// Render shops
function renderShops() {
  shopContainer.innerHTML = '';
  shops.forEach((shop, index) => {
    const div = document.createElement('div');
    div.className = 'mb-2';
    div.innerHTML = `<strong>${shop.name}</strong> - Items: ${shop.items.join(', ')}
                     <button data-index="${index}" class="buy-button ml-2 px-1 py-0.5 bg-green-200 rounded">Buy Random</button>`;
    shopContainer.appendChild(div);
  });

  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', () => {
      const shopIndex = button.getAttribute('data-index');
      buyItem(shopIndex);
    });
  });
}

// Buy random item from shop
function buyItem(shopIndex) {
  const shop = shops[shopIndex];
  const item = shop.items[Math.floor(Math.random() * shop.items.length)];
  inventory.push(item);
  updateInventory();
  showMessage(`You bought a ${item} from ${shop.name}!`);
}

// Update inventory display
function updateInventory() {
  inventoryList.innerHTML = '';
  inventory.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

// Crafting logic
craftButton.addEventListener('click', () => {
  if (inventory.length >= 2) {
    const craftedItem = `Potion of ${inventory.shift()} & ${inventory.shift()}`;
    showMessage(`You crafted a ${craftedItem}!`);
    updateInventory();
  } else {
    showMessage('You need at least 2 items to craft a potion.');
  }
});

// Show messages
function showMessage(msg) {
  messageContainer.textContent = msg;
}

// Initial render
renderShops();
updateInventory();
