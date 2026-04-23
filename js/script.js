const d = document;

const products = [
  {
    id: 1,
    title: "Baskets",
    price: 100,
    image: "baskets.png",
    description: "This is a basket",
  },
  {
    id: 2,
    title: "Socks",
    price: 20,
    image: "socks.png",
    description: "This is a socks",
  },
  {
    id: 3,
    title: "Bag",
    price: 50,
    image: "bag.png",
    description: "This is a Bag",
  },
];

const shoppingCart = [];

const addToShoppingCart = (product) => {
  const item = shoppingCart.find((item) => item.id === product.id);
  if (item) {
    item.quantity++;
  } else {
    shoppingCart.push({ ...product, quantity: 1, favorite: false });
  }
};

const removeFromShoppingCart = (product) => {
  const item = shoppingCart.find((item) => item.id === product.id);
  if (!item) return;
  item.quantity--;
  if (item.quantity <= 0 && !item.favorite) {
    shoppingCart.splice(shoppingCart.indexOf(item), 1);
  }
};

const deleteFromShoppingCart = (product) => {
  const item = shoppingCart.find((item) => item.id === product.id);
  if (item) {
    if (item.favorite) {
      item.quantity = 0;
    } else {
      shoppingCart.splice(shoppingCart.indexOf(item), 1);
    }
  }
};

const toggleFavorite = (product) => {
  let item = shoppingCart.find((item) => item.id === product.id);
  if (!item) {
    item = { ...product, quantity: 0, favorite: false };
    shoppingCart.push(item);
  }

  item.favorite = !item.favorite;

  if (item.quantity === 0 && !item.favorite) {
    shoppingCart.splice(shoppingCart.indexOf(item), 1);
  }
};

const getCartItem = (productId) => {
  return shoppingCart.find((item) => item.id === productId);
};

const getTotalPrice = () => {
  return shoppingCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};

const renderUI = () => {
  products.forEach((product) => {
    const item = getCartItem(product.id);
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
    totalEl.textContent = `${getTotalPrice()} $`;
  }
};

const isProductFavorite = (productId) => {
  const item = getCartItem(productId);
  return item ? item.favorite : false;
};

const getProductQuantity = (productId) => {
  const item = getCartItem(productId);
  return item ? item.quantity : 0;
};

const productsContainer = d.querySelector(".list-products");

products.forEach((product) => {
  const productQty = getProductQuantity(product.id);
  const isFavorite = isProductFavorite(product.id);

  const card = d.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
  <img src="/assets/${product.image}" class="card-img-top" alt="${product.title}">
  <div class="card-body">
    <h5 class="card-title">${product.title}</h5>
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

  if (action === "add") addToShoppingCart(product);
  if (action === "remove") removeFromShoppingCart(product);
  if (action === "delete") deleteFromShoppingCart(product);
  if (action === "favorite") toggleFavorite(product);

  renderUI();
});

renderUI();
