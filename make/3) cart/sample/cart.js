const cartForm = document.querySelector('#cart-form');
const cartList = document.querySelector('#cart-list');
const cart = [];

function addItem(name, quantity) {
  cart.push({ name: name, quantity: quantity });
}

function removeItem(index) {
  cart.splice(index, 1);
}

function renderCart() {
  cartList.innerHTML = '';
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const li = document.createElement('li');
    li.innerHTML = `${item.name} - ${item.quantity}
                    <button data-index="${i}" class="remove-btn">X</button>`;
    cartList.appendChild(li);
  }
}

cartForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nameInput = document.querySelector('#item-name');
  const quantityInput = document.querySelector('#item-quantity');
  const name = nameInput.value;
  const quantity = parseInt(quantityInput.value);
  addItem(name, quantity);
  nameInput.value = '';
  quantityInput.value = '';
  renderCart();
});

cartList.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-btn')) {
    const index = event.target.dataset.index;
    removeItem(index);
    renderCart();
  }
});

renderCart();