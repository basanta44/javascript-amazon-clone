export function getProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}

class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  extraInfoHtml() {
    return '';
  }
}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHtml() {
    return `<a href="images/clothing-size-chart.png" target="_blank">Size chart</a>`;
  }
}

export let products = [];

export async function loadProducts() {
  try {
    const promise = await fetch('https://supersimplebackend.dev/products');
    const response = await promise.json();
    createClassProducts(response);
  } catch (error) {
    console.log(error);
  }
}

function createClassProducts(productData) {
  products = productData.map((productDetails) => {
    if (productDetails.type === 'clothing') {
      return new Clothing(productDetails);
    }
    return new Product(productDetails);
  });
}

/*
export function loadProducts() {
  const promise = fetch('https://supersimplebackend.dev/products')
    .then((response) => {
      return response.json();
    })
    .then((productData) => {
      products = productData.map((productDetails) => {
        if (productDetails.type === 'clothing') {
          return new Clothing(productDetails);
        }
        return new Product(productDetails);
      });
    });

  return promise;
}
*/
