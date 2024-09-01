import { cart } from '../../data/cart.js';

export function renderHeader() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const headerHTML = `
    Checkout (<a class="return-to-home-link" href="amazon.html">${cartQuantity} items</a>)
  `;

  document.querySelector('.js-checkout-header').innerHTML = headerHTML;
}
