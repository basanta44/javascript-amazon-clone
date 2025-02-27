import { cart, updateDeliveryDate, removeFromCart } from '../../data/cart.js';
import {
  deliveryOptions,
  getDeliveryOption,
} from '../../data/deliveryOptions.js';
import { getProduct, products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.8.9/esm/index.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderHeader } from './header.js';

export function renderOrderSummary() {
  let cartHTML = '';

  cart.forEach((cartItem) => {
    let matchingProduct = getProduct(cartItem.productId);

    let deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${
        matchingProduct.id
      }">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}

            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${
                  cartItem.quantity
                }</span>
              </span>
              <span class="update-quantity-link link-primary">
                Update
              </span>
              <span class="js-delete-link delete-quantity-link link-primary" data-product-id=${
                matchingProduct.id
              }>
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>

            ${deliveryOptionHTML(matchingProduct, cartItem)}

          </div>
        </div>
      </div>
    `;

    function deliveryOptionHTML(matchingProduct, cartItem) {
      let html = '';

      deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString =
          deliveryOption.deliveryPriceCents === 0
            ? 'FREE'
            : `${formatCurrency(deliveryOption.deliveryPriceCents)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        html += `
          <div class="delivery-option js-delivery-option" data-product-id=${
            matchingProduct.id
          } data-delivery-option-id=${deliveryOption.id}>
            <input type="radio"
              ${isChecked ? 'checked' : ''}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} Shipping
              </div>
            </div>
          </div>
        `;
      });

      return html;
    }
  });

  document.querySelector('.js-order-summary').innerHTML = cartHTML;

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryDate(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
      renderPaymentSummary();
      renderHeader();
    });
  });
}
