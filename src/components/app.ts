import { PRODUCTS } from '../products';
import Cart from './cart/cart';
import Products from './catalog/catalog';
import ProductDetails from './product-details/product-details';
import { Router } from './router';

class App extends Products {
    cart: Cart;
    renderDetails: ProductDetails;
    router: Router;
    constructor() {
        super();
        this.cart = new Cart(PRODUCTS[1]);
        this.renderDetails = new ProductDetails();
        this.router = new Router();
    }
    start(): void {
        this.router.setRoutes();
        console.log('App.start()');
    }
}

export default App;
