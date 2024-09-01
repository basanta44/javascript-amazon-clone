import { formatCurrency } from '../scripts/utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.8.9/esm/index.js';
import { getProduct, loadProducts } from './products.js';
import { addToCart, cart } from './cart.js';

export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

async function renderOrders() {
  await loadProducts();

  updateCartQuantity();

  let orderHTML = '';

  function updateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }

  orders.forEach((orderDetails) => {
    const orderTime = orderDetails.orderTime;
    const dateFormat = dayjs(orderTime).format('MMMM D');

    orderHTML += `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${dateFormat}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(orderDetails.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${orderDetails.id}</div>
        </div>
      </div>

      <div class="order-details-grid">
        
      ${orderDetailsInfo(orderDetails)}
        
      </div>
    </div>  
    `;

    function orderDetailsInfo(orderDetails) {
      let html = '';

      orderDetails.products.forEach((productDetails) => {
        let matchingProduct = getProduct(productDetails.productId);

        html += `
          <div class="product-image-container">
            <img src="${matchingProduct.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format(
                'MMMM D'
              )}
            </div>
            <div class="product-quantity">
              Quantity: ${productDetails.quantity}
            </div>
            <button class="buy-again-button button-primary js-buy-again" data-product-id=${
              matchingProduct.id
            }>
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${orderDetails.id}&productId=${
          matchingProduct.id
        }">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        `;
      });

      return html;
    }
  });
  document.querySelector('.js-orders-grid').innerHTML = orderHTML;

  document.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId);

      button.innerHTML = 'Added';
      button.classList.add('is-added');
      updateCartQuantity();
    });
  });
}

renderOrders();

export function getOrder(orderId) {
  let matchingOrder;
  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });

  return matchingOrder;
}
