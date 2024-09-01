import { addToCart, cart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

async function renderProducts() {
  await loadProducts();

  updateCartQuantity();

  let productHTML = '';

  function renderproductHTML(product) {
    return `
      <div class='product-container'>
        <div class='product-image-container'>
          <img
            class='product-image'
            src='${product.image}'
          />
        </div>

        <div class='product-name limit-text-to-2-lines'>
          ${product.name}
        </div>

        <div class='product-rating-container'>
          <img class='product-rating-stars' src='images/ratings/rating-${
            product.rating.stars * 10
          }.png' />
          <div class='product-rating-count link-primary'>${
            product.rating.count
          }</div>
        </div>

        <div class='product-price'>$${formatCurrency(product.priceCents)}</div>

        <div class='product-quantity-container'>
          <select>
            <option selected value='1'>
              1
            </option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
          </select>
        </div>

        <div class='product-spacer'></div>

        ${product.extraInfoHtml()}  

        <div class='added-to-cart js-added-to-cart-${product.id}'>
          
        </div>

        <button class='add-to-cart-button button-primary js-add-to-cart' data-product-id=${
          product.id
        }>Add to Cart</button>
      </div>
    `;
  }

  products.forEach((product) => {
    productHTML += renderproductHTML(product);
  });

  function displayMessage(productId) {
    const html = `<img src='images/icons/checkmark.png' />
          Added`;
    document.querySelector(
      `.js-added-to-cart-${productId}`
    ).style.opacity = 100;
    document.querySelector(`.js-added-to-cart-${productId}`).innerHTML = html;
  }

  function updateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }

  document.querySelector('.js-products-grid').innerHTML = productHTML;

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId);
      updateCartQuantity();
      displayMessage(productId);
    });
  });

  function searchProducts() {
    const searchValue = document
      .querySelector('.js-search-bar')
      .value.toLowerCase();
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchValue)
    );
    let html = '';
    filteredProducts.forEach((product) => {
      html += renderproductHTML(product);
    });
    document.querySelector('.js-products-grid').innerHTML = html;
  }

  document.querySelector('.js-search-button').addEventListener('click', () => {
    searchProducts();
  });

  document
    .querySelector('.js-search-bar')
    .addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        searchProducts();
      }
    });
}

renderProducts();
