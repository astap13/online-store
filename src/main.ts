import './style.scss';
import './normalize.css';
import './components/product-details/product-details';
import './components/router';
import './components/catalog/catalog.scss';

import Products from './components/catalog/catalog';

const productPage = new Products();
productPage.render();
