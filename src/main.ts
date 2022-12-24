import './style.scss';
import './normalize.css';
import './components/product-details/product-details';
import './components/router';
import './components/catalog/catalog.scss';
import './components/app';

import App from './components/app';

export const app = new App();
app.start();
