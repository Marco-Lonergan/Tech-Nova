(() => {
    const cartKey = "technova-demo-cart-v1";
    const products = new Set([
        "Nova's Seat",
        "TechNova Smart Glove",
        "Nova Pulse Projector Watch",
        "Lumen Pro"
    ]);
    const cartTrigger = document.querySelector(".cart-trigger");
    if (!cartTrigger) return;

    const dialog = document.createElement("dialog");
    dialog.className = "cart-dialog";
    dialog.setAttribute("aria-labelledby", "cart-title");

    const panel = document.createElement("div");
    panel.className = "cart-panel";
    const headingRow = document.createElement("div");
    headingRow.className = "cart-heading";
    const heading = document.createElement("h2");
    heading.id = "cart-title";
    heading.textContent = "Your cart";
    const closeButton = document.createElement("button");
    closeButton.className = "cart-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close cart");
    closeButton.textContent = "×";
    headingRow.append(heading, closeButton);

    const notice = document.createElement("p");
    notice.className = "cart-notice";
    notice.textContent = "Demo cart only: TechNova products are concepts and are not available to buy. No orders or payments are processed.";
    const itemsList = document.createElement("ul");
    itemsList.className = "cart-items";
    const status = document.createElement("p");
    status.className = "cart-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const actions = document.createElement("div");
    actions.className = "cart-actions";
    const clearButton = document.createElement("button");
    clearButton.className = "game-button secondary";
    clearButton.type = "button";
    clearButton.textContent = "Clear cart";
    const checkoutButton = document.createElement("button");
    checkoutButton.className = "game-button";
    checkoutButton.type = "button";
    checkoutButton.textContent = "Check availability";
    actions.append(clearButton, checkoutButton);
    panel.append(headingRow, notice, itemsList, status, actions);
    dialog.append(panel);
    document.body.append(dialog);

    function loadCart() {
        const saved = localStorage.getItem(cartKey);
        if (!saved) return [];

        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
            throw new Error("Saved cart data is not a list.");
        }
        return parsed.filter((item) =>
            item &&
            products.has(item.name) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    }

    let cart;
    try {
        cart = loadCart();
    } catch (error) {
        console.error("Could not load the saved TechNova demo cart.", error);
        cart = [];
        status.textContent = "The saved cart could not be read. A new demo cart has been started.";
    }

    function saveCart() {
        try {
            localStorage.setItem(cartKey, JSON.stringify(cart));
            return true;
        } catch (error) {
            console.error("Could not save the TechNova demo cart.", error);
            status.textContent = "Cart changes are temporary because this browser could not save them.";
            return false;
        }
    }

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartTrigger.querySelector(".cart-count").textContent = count.toString();
        cartTrigger.setAttribute("aria-label", `Open cart, ${count} ${count === 1 ? "item" : "items"}`);
    }

    function renderCart() {
        itemsList.replaceChildren();
        if (cart.length === 0) {
            const empty = document.createElement("li");
            empty.className = "cart-empty";
            empty.textContent = "Your demo cart is empty.";
            itemsList.append(empty);
        }

        cart.forEach((item) => {
            const row = document.createElement("li");
            row.className = "cart-item";
            const name = document.createElement("span");
            name.className = "cart-item-name";
            name.textContent = item.name;
            const controls = document.createElement("div");
            controls.className = "cart-item-controls";
            const decrease = document.createElement("button");
            decrease.type = "button";
            decrease.dataset.action = "decrease";
            decrease.dataset.product = item.name;
            decrease.setAttribute("aria-label", `Remove one ${item.name}`);
            decrease.textContent = "−";
            const quantity = document.createElement("span");
            quantity.textContent = item.quantity.toString();
            quantity.setAttribute("aria-label", `Quantity ${item.quantity}`);
            const increase = document.createElement("button");
            increase.type = "button";
            increase.dataset.action = "increase";
            increase.dataset.product = item.name;
            increase.setAttribute("aria-label", `Add one ${item.name}`);
            increase.textContent = "+";
            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "cart-remove";
            remove.dataset.action = "remove";
            remove.dataset.product = item.name;
            remove.textContent = "Remove";
            controls.append(decrease, quantity, increase, remove);
            row.append(name, controls);
            itemsList.append(row);
        });

        updateCartCount();
    }

    function addProduct(name) {
        if (!products.has(name)) {
            status.textContent = "That item is not available in the TechNova demo cart.";
            return;
        }

        const existing = cart.find((item) => item.name === name);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ name, quantity: 1 });
        }
        const saved = saveCart();
        renderCart();
        status.textContent = saved
            ? `${name} added to your demo cart.`
            : `${name} added for this visit, but the browser could not save the cart.`;
    }

    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => addProduct(button.dataset.product));
    });

    cartTrigger.addEventListener("click", () => {
        renderCart();
        dialog.showModal();
        closeButton.focus();
    });
    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => cartTrigger.focus());

    itemsList.addEventListener("click", (event) => {
        if (!(event.target instanceof HTMLElement)) return;
        const action = event.target.dataset.action;
        const name = event.target.dataset.product;
        if (!action || !name) return;

        const item = cart.find((entry) => entry.name === name);
        if (!item) return;
        if (action === "increase") item.quantity += 1;
        if (action === "decrease") item.quantity -= 1;
        if (action === "remove" || item.quantity <= 0) {
            cart = cart.filter((entry) => entry.name !== name);
        }
        const saved = saveCart();
        renderCart();
        status.textContent = saved
            ? "Your demo cart was updated."
            : "Your cart was updated for this visit, but the browser could not save it.";
    });

    clearButton.addEventListener("click", () => {
        cart = [];
        const saved = saveCart();
        renderCart();
        status.textContent = saved
            ? "Your demo cart is empty."
            : "The cart is empty for this visit, but the browser could not save the change.";
    });
    checkoutButton.addEventListener("click", () => {
        status.textContent = "These concept products are not currently for sale. No order or payment can be made from this website.";
    });

    renderCart();
})();
