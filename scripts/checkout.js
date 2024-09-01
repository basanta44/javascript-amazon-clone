import { loadProducts } from '../data/products.js';
import { renderHeader } from './checkout/header.js';
import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';

async function loadCheckoutPage() {
  try {
    await loadProducts();
  } catch (error) {
    console.log(error);
  }

  renderHeader();
  renderOrderSummary();
  renderPaymentSummary();
}

loadCheckoutPage();
