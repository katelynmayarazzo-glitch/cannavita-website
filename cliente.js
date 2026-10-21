document.addEventListener("DOMContentLoaded", () => {
  const products = {
    oleo: {
      id: "oleo",
      name: "Óleo Cannavita",
      price: 89.90,
      image: "assets/images/oleo-cannavita.jpg.png"
    },
    creme: {
      id: "creme",
      name: "Creme Cannavita",
      price: 69.90,
      image: "assets/images/cuidado-cannavita.jpg.png"
    },
    pomada: {
      id: "pomada",
      name: "Pomada Cannavita",
      price: 59.90,
      image: "assets/images/produtos.jpg.png"
    }
  };

  const cart = new Map();

  const cartPanel = document.getElementById("cartPanel");
  const cartBackdrop = document.getElementById("cartBackdrop");
  const cartItems = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartSummary = document.getElementById("cartSummary");
  const cartCount = document.getElementById("cartCount");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const checkoutModal = document.getElementById("checkoutModal");
  const toast = document.getElementById("toast");

  let lastFocusedElement = null;
  let toastTimer;

  const money = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("visible");
    }, 2600);
  }

  function openCart() {
    lastFocusedElement = document.activeElement;

    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
    cartPanel.inert = false;
    cartBackdrop.hidden = false;
    document.body.classList.add("no-scroll");

    document.getElementById("closeCart").focus();
  }

  function closeCart() {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
    cartPanel.inert = true;
    cartBackdrop.hidden = true;
    document.body.classList.remove("no-scroll");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function addToCart(id) {
    const product = products[id];

    if (!product) return;

    const current = cart.get(id);

    if (current) {
      current.quantity += 1;
    } else {
      cart.set(id, { ...product, quantity: 1 });
    }

    renderCart();
    showToast(`${product.name} adicionado à sacola!`);
  }

  function changeQuantity(id, amount) {
    const item = cart.get(id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
      cart.delete(id);
    }

    renderCart();
  }

  function removeItem(id) {
    const item = cart.get(id);

    if (!item) return;

    cart.delete(id);
    renderCart();
    showToast(`${item.name} removido da sacola.`);
  }

  function renderCart() {
    const items = Array.from(cart.values());
    const totalQuantity = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    cartCount.textContent = totalQuantity;
    cartItems.replaceChildren();

    cartEmpty.hidden = items.length > 0;
    cartSummary.hidden = items.length === 0;

    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "cart-item";

      const image = document.createElement("img");
      image.src = item.image;
      image.alt = "";
      image.width = 76;
      image.height = 90;

      const details = document.createElement("div");

      const name = document.createElement("h3");
      name.textContent = item.name;

      const price = document.createElement("p");
      price.className = "cart-item-price";
      price.textContent = `${money(item.price)} por unidade`;

      const actions = document.createElement("div");
      actions.className = "cart-item-actions";

      const quantityControl = document.createElement("div");
      quantityControl.className = "quantity-control";
      quantityControl.setAttribute(
        "aria-label",
        `Quantidade de ${item.name}`
      );

      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.textContent = "−";
      decrease.setAttribute("aria-label", `Diminuir ${item.name}`);
      decrease.addEventListener("click", () => {
        changeQuantity(item.id, -1);
      });

      const quantity = document.createElement("span");
      quantity.textContent = item.quantity;
      quantity.setAttribute("aria-live", "polite");

      const increase = document.createElement("button");
      increase.type = "button";
      increase.textContent = "+";
      increase.setAttribute("aria-label", `Aumentar ${item.name}`);
      increase.addEventListener("click", () => {
        changeQuantity(item.id, 1);
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-item";
      remove.textContent = "Remover";
      remove.addEventListener("click", () => {
        removeItem(item.id);
      });

      quantityControl.append(decrease, quantity, increase);
      actions.append(quantityControl, remove);
      details.append(name, price, actions);
      article.append(image, details);
      cartItems.append(article);
    });

    cartSubtotal.textContent = money(subtotal);
  }

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.add);
    });
  });

  document.getElementById("openCart").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("closingCart").addEventListener("click", openCart);
  document.getElementById("continueLink").addEventListener("click", closeCart);

  cartBackdrop.addEventListener("click", closeCart);

  document.getElementById("continueShopping").addEventListener("click", () => {
    closeCart();
    document.getElementById("produtos").scrollIntoView({
      behavior: "smooth"
    });
  });

  document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.size === 0) return;

    closeCart();
    checkoutModal.hidden = false;
    document.getElementById("closeCheckout").focus();
  });

  function closeCheckout() {
    checkoutModal.hidden = true;
    document.getElementById("closingCart").focus();
  }

  document.getElementById("closeCheckout").addEventListener(
    "click",
    closeCheckout
  );

  document.getElementById("finishDemo").addEventListener("click", () => {
    checkoutModal.hidden = true;
    cart.clear();
    renderCart();

    document.getElementById("produtos").scrollIntoView({
      behavior: "smooth"
    });

    showToast("Demonstração concluída. Obrigado por conhecer a Cannavita!");
  });

  checkoutModal.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
      closeCheckout();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!checkoutModal.hidden) {
        closeCheckout();
      } else if (cartPanel.classList.contains("open")) {
        closeCart();
      }
    }
  });

  document.getElementById("currentYear").textContent =
    new Date().getFullYear();

  renderCart();
});