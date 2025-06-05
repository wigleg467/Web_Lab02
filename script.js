document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "key";

  const input = document.querySelector(".item-adder__input");
  const addButton = document.querySelector(".item-adder__button");
  const itemList = document.querySelector(".item-list");
  const summaryRemaining = document.querySelectorAll(".summary__list")[0];
  const summaryBought = document.querySelectorAll(".summary__list")[1];

  const stored = localStorage.getItem(STORAGE_KEY);
  const products = stored
    ? JSON.parse(stored)
    : [
        { name: "Помідори", quantity: 2, bought: true },
        { name: "Печиво", quantity: 2, bought: false },
        { name: "Сир", quantity: 1, bought: false },
      ];

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  function updateSummary() {
    summaryRemaining.innerHTML = "";
    summaryBought.innerHTML = "";
    products.forEach((p) => {
      const html = `<span class="summary__item${p.bought ? "--bought" : ""}">
        <span class="summary__name">${p.name}</span>
        <span class="summary__count">${p.quantity}</span>
      </span>`;
      (p.bought ? summaryBought : summaryRemaining).insertAdjacentHTML(
        "beforeend",
        html
      );
    });
  }

  function render() {
    itemList.innerHTML = "";

    products.forEach((p, index) => {
      const item = document.createElement("div");
      item.className = "item";

      // left
      const left = document.createElement("div");
      left.className = "item__left-part";

      const span = document.createElement("span");
      if (!p.bought) {
        span.className = "item__name";
        span.textContent = p.name;
        left.appendChild(span);
        span.addEventListener("click", () => {
          var lastName = span.textContent;

          const input = document.createElement("input");
          input.className = "item__rename-input";
          input.value = span.textContent;
          left.replaceChild(input, span);
          input.focus();

          input.addEventListener("input", () => {
            p.name = input.value.trim();
            save();
            updateSummary();
          });

          input.addEventListener("blur", () => {
            if (input.value.trim() === "") {
              input.value = lastName.trim();
            }
            p.name = input.value.trim();
            span.textContent = input.value.trim();
            left.replaceChild(span, input);
            save();
            updateSummary();
          });
        });
      } else {
        span.className = "item__name--bought";
        span.textContent = p.name;
        left.appendChild(span);
      }

      // center
      const center = document.createElement("div");
      center.className = "item__center-part";

      const qty = document.createElement("span");
      qty.className = "item__quantity";
      qty.textContent = p.quantity;

      if (!p.bought) {
        const minus = document.createElement("button");
        minus.className = "item__minus-button";
        minus.textContent = "−";
        minus.disabled = p.quantity === 1;
        minus.setAttribute(
          "data-tooltip",
          minus.disabled ? "Обрано мінімальну кількість" : "Прибрати"
        );
        minus.classList.toggle("item__minus-button--min", p.quantity === 1);
        minus.addEventListener("click", () => {
          if (p.quantity > 1) p.quantity--;
          save();
          render();
          updateSummary();
        });

        const plus = document.createElement("button");
        plus.className = "item__plus-button";
        plus.textContent = "+";
        plus.setAttribute("data-tooltip", "Додати");
        plus.addEventListener("click", () => {
          p.quantity++;
          save();
          render();
          updateSummary();
        });
        center.append(minus, qty, plus);
      } else {
        center.append(qty);
      }

      // right
      const right = document.createElement("div");
      right.className = "item__right-part";

      const toggle = document.createElement("button");
      toggle.className = "item__status-button";
      toggle.textContent = p.bought ? "Не куплено" : "Куплено";
      toggle.setAttribute("data-tooltip", "Статус товару");
      toggle.addEventListener("click", () => {
        p.bought = !p.bought;
        save();
        render();
        updateSummary();
      });
      right.appendChild(toggle);

      if (!p.bought) {
        const remove = document.createElement("button");
        remove.className = "item__remove-button";
        remove.textContent = "✖";
        remove.setAttribute("data-tooltip", "Скасувати");
        remove.addEventListener("click", () => {
          products.splice(index, 1);
          save();
          render();
          updateSummary();
        });
        right.appendChild(remove);
      }

      item.append(left, center, right);
      itemList.appendChild(item);
    });
  }

  addButton.addEventListener("click", () => {
    const name = input.value.trim();
    if (!name) return;
    products.push({ name, quantity: 1, bought: false });
    input.value = "";
    save();
    render();
    updateSummary();
  });

  render();
  updateSummary();
});
