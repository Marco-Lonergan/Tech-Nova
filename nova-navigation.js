(() => {
    const trigger = document.querySelector(".nova-trigger");
    if (!trigger) return;

    const dialog = document.createElement("dialog");
    dialog.className = "nova-navigator";
    dialog.setAttribute("aria-labelledby", "nova-navigator-title");

    const panel = document.createElement("div");
    panel.className = "nova-navigator-panel";

    const headingRow = document.createElement("div");
    headingRow.className = "nova-navigator-heading";
    const heading = document.createElement("h2");
    heading.id = "nova-navigator-title";
    heading.textContent = "Ask Nova";
    const closeButton = document.createElement("button");
    closeButton.className = "nova-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close Nova");
    closeButton.textContent = "×";
    headingRow.append(heading, closeButton);

    const description = document.createElement("p");
    description.textContent = "Tell me what you're looking for and I'll point you to the right page.";

    const form = document.createElement("form");
    form.className = "nova-navigator-form";
    const label = document.createElement("label");
    label.htmlFor = "nova-navigation-query";
    label.textContent = "What do you need?";
    const input = document.createElement("input");
    input.id = "nova-navigation-query";
    input.type = "search";
    input.placeholder = "Try “wheelchair”, “watch”, or “support”";
    input.required = true;
    const findButton = document.createElement("button");
    findButton.className = "game-button";
    findButton.type = "submit";
    findButton.textContent = "Find it";
    form.append(label, input, findButton);

    const results = document.createElement("div");
    results.className = "nova-navigator-results";
    results.setAttribute("role", "status");
    results.setAttribute("aria-live", "polite");

    panel.append(headingRow, description, form, results);
    dialog.append(panel);
    document.body.append(dialog);

    const destinations = [
        {
            label: "Nova's Seat",
            href: "Novas-Seat.html",
            terms: ["wheelchair", "mobility", "stairs", "stair", "nova's seat", "nova seat", "chair"]
        },
        {
            label: "Smart Glove",
            href: "Smart-Glove.html",
            terms: ["glove", "gesture", "gestures", "hand", "pairing"]
        },
        {
            label: "Nova Pulse Watch",
            href: "Nova-Pulse-Watch.html",
            terms: ["watch", "pulse", "heart rate", "projector", "projection"]
        },
        {
            label: "Lumen Pro",
            href: "Lumen-Pro.html",
            terms: ["lumen", "glasses", "mixed reality", "vr", "virtual reality"]
        },
        {
            label: "Nova Run Game",
            href: "Game.html",
            terms: ["game", "run", "obstacle", "obstacles", "play"]
        },
        {
            label: "Customer Service",
            href: "Customer-Service.html",
            terms: ["support", "service", "help", "troubleshoot", "troubleshooting", "repair", "broken", "issue", "problem"]
        },
        {
            label: "Sustainability",
            href: "Index.html#sustainability",
            terms: ["sustainability", "sustainable", "environment", "recycling", "recycled", "materials"]
        },
        {
            label: "About us",
            href: "About-Us.html",
            terms: ["about", "company", "founder", "marco", "mission", "origin"]
        },
        {
            label: "All products",
            href: "Index.html",
            terms: ["products", "catalogue", "catalog", "browse"]
        }
    ];

    trigger.addEventListener("click", () => {
        dialog.showModal();
        input.focus();
    });

    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => trigger.focus());

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = input.value.trim().toLocaleLowerCase();
        if (!query) return;

        const matches = destinations.filter((destination) =>
            destination.terms.some((term) => query.includes(term))
        );
        results.replaceChildren();

        const message = document.createElement("p");
        message.textContent = matches.length
            ? "Here are the pages that may help:"
            : "I couldn't match that to a specific page. Try the product search or browse support.";
        results.append(message);

        const links = matches.length
            ? matches
            : [
                { label: "Search products", href: `Index.html?q=${encodeURIComponent(input.value.trim())}` },
                { label: "Customer Service", href: "Customer-Service.html" },
                { label: "All products", href: "Index.html" }
            ];
        const list = document.createElement("ul");
        links.forEach((destination) => {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = destination.href;
            link.textContent = destination.label;
            item.append(link);
            list.append(item);
        });
        results.append(list);
    });
})();
