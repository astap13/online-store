import './style.scss';
import './normalize.css';
import './components/product-details/product-details';
import './components/router';
import './components/catalog/catalog.scss';
import './components/app';

import App from './components/app';
import { PRODUCTS } from './products';

export const app = new App();
app.start();
app.cart.addToCart(PRODUCTS[10]);
console.log(app);
