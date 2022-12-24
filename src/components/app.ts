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
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('btn_product_item')) {
                target.classList.forEach((item) => {
                    const arr = item.split('_');
                    if (arr[0] === 'product' && arr[1] === 'item' && arr[3] === 'to') {
                        this.cart.addToCart(PRODUCTS[Number(arr[6]) - 1]);
                        this.cart.setSumNum();
                    } else if (arr[0] === 'product' && arr[1] === 'item' && arr[2] === 'details') {
                        this.router.route(event);
                        console.log((target as HTMLAnchorElement).href);
                    }
                });
            }
        });
    }
}

export default App;
