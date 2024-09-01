import { cart } from '../../data/cart.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { addOrder, orders } from '../../data/orders.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';

export function renderPaymentSummary() {
  let cartQuantity = 0;
  let cartPriceCents = 0;
  let cartDeliveryPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);

    cartQuantity += cartItem.quantity;
    cartPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    cartDeliveryPriceCents += deliveryOption.deliveryPriceCents;
  });

  const totalBeforeTaxCents = cartPriceCents + cartDeliveryPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const cartTotalCents = totalBeforeTaxCents + taxCents;

  const paymentHTML = `

    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">$${formatCurrency(
        cartPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(
        cartDeliveryPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(
        totalBeforeTaxCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(
        cartTotalCents
      )}</div>
    </div>

    <button class="js-place-order place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentHTML;

  document
    .querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cart: cart,
          }),
        });

        const order = await response.json();
        addOrder(order);
      } catch (error) {
        console.log(error);
      }

      window.location.href = 'orders.html';
    });
}
