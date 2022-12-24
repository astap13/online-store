import './style.scss';
import './normalize.css';
import './components/product-details/product-details';
import './components/router';
import './components/catalog/catalog.scss';
import './components/search/search.scss';

import Cart from './components/cart/cart';
import { PRODUCTS } from './products';
import Products from './components/catalog/catalog';

export const productPage = new Products();

export const cart = new Cart(PRODUCTS[1]);
cart.addToCart(PRODUCTS[12]);
cart.addToCart(PRODUCTS[14]);
