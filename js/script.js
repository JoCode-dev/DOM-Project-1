const d = document;

class Product {
  constructor(id, name, price, image, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.description = description;
  }
}

class ShoppingCartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
    this.favorite = false;
  }

  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  getTotalPrice() {
    return this.items.reduce(
      (total, item) => total + item.getTotalPrice(),
      0,
    );
  }

  addItem(product) {
    const item = this.items.find(
      (cartItem) => cartItem.product.id === product.id,
    );
    if (item) {
      item.quantity++;
    } else {
      this.items.push(new ShoppingCartItem(product, 1));
    }
  }

  removeItem(product) {
    const item = this.items.find(
      (cartItem) => cartItem.product.id === product.id,
    );
    if (!item) return;
    item.quantity--;
    if (item.quantity <= 0 && !item.favorite) {
      this.items.splice(this.items.indexOf(item), 1);
    }
  }

  deleteItem(product) {
    const item = this.items.find(
      (cartItem) => cartItem.product.id === product.id,
    );
    if (!item) return;
    if (item.favorite) {
      item.quantity = 0;
    } else {
      this.items.splice(this.items.indexOf(item), 1);
    }
  }

  toggleFavorite(product) {
    let item = this.items.find(
      (cartItem) => cartItem.product.id === product.id,
    );
    if (!item) {
      item = new ShoppingCartItem(product, 0);
      this.items.push(item);
    }

    item.favorite = !item.favorite;

    if (item.quantity === 0 && !item.favorite) {
      this.items.splice(this.items.indexOf(item), 1);
    }
  }

  getCartItem(productId) {
    return this.items.find((item) => item.product.id === productId);
  }

  displayCartItems() {
    return this.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      total: item.getTotalPrice(),
      favorite: item.favorite,
    }));
  }
}

const products = [
  new Product(1, "Baskets", 100, "baskets.png", "This is a basket"),
  new Product(2, "Socks", 20, "socks.png", "This is a socks"),
  new Product(3, "Bag", 50, "bag.png", "This is a Bag"),
];

const shoppingCart = new ShoppingCart();

const renderUI = () => {
  products.forEach((product) => {
    const item = shoppingCart.getCartItem(product.id);
    const quantity = item?.quantity || 0;
    const favorite = item?.favorite || false;

    const quantityEl = d.querySelector(`#quantity-${product.id}`);
    if (quantityEl) {
      quantityEl.textContent = quantity;
    }

    const heartEl = d.querySelector(
      `.fa-heart[data-action="favorite"][data-id="${product.id}"]`,
    );
    if (heartEl) {
      heartEl.classList.toggle("text-danger", favorite);
    }
  });

  const totalEl = d.querySelector(".total");
  if (totalEl) {
    totalEl.textContent = `${shoppingCart.getTotalPrice()} $`;
  }
};

const isProductFavorite = (productId) => {
  const item = shoppingCart.getCartItem(productId);
  return item ? item.favorite : false;
};

const getProductQuantity = (productId) => {
  const item = shoppingCart.getCartItem(productId);
  return item ? item.quantity : 0;
};

const productsContainer = d.querySelector(".list-products");

products.forEach((product) => {
  const productQty = getProductQuantity(product.id);
  const isFavorite = isProductFavorite(product.id);

  const card = d.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
  <img src="/assets/${product.image}" class="card-img-top" alt="${product.name}">
  <div class="card-body">
    <h5 class="card-title">${product.name}</h5>
    <p class="card-text">${product.description}</p>
    <h4 class="unit-price">${product.price} $</h4>
    <div>
      <i class="fas fa-plus-circle" data-action="add" data-id="${product.id}"></i>
      <span class="quantity" id="quantity-${product.id}">${productQty}</span>
      <i class="fas fa-minus-circle" data-action="remove" data-id="${product.id}"></i>
    </div>
    <div>
      <i class="fas fa-trash-alt" data-action="delete" data-id="${product.id}"></i>
      <i class="fas fa-heart ${isFavorite ? "text-danger" : ""}" data-action="favorite" data-id="${product.id}"></i>
    </div>
  </div>
`;
  productsContainer?.appendChild(card);
});

productsContainer?.addEventListener("click", (e) => {
  const target = e.target.closest("i[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  const productId = Number(target.dataset.id);
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  if (action === "add") shoppingCart.addItem(product);
  if (action === "remove") shoppingCart.removeItem(product);
  if (action === "delete") shoppingCart.deleteItem(product);
  if (action === "favorite") shoppingCart.toggleFavorite(product);

  renderUI();
});

renderUI();
