import { PRODUCTS } from '../products';
import Cart from './cart/cart';
import Products from './catalog/catalog';
import Filters from './filters/filters';
import ProductDetails from './product-details/product-details';
import Router from './router';
import Search from './search/search';

class App {
    cart: Cart;
    renderDetails: ProductDetails;
    router: Router;
    products: Products;
    renderSearch: Search;
    filters: Filters;
    constructor() {
        this.cart = new Cart(PRODUCTS[1]);
        this.renderDetails = new ProductDetails();
        this.router = new Router();
        this.products = new Products();
        this.renderSearch = new Search();
        this.filters = new Filters();
    }
    start(): void {
        this.router.setRoutes();
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('btn_product_item')) {
                target.classList.forEach((item) => {
                    const arr = item.split('_');
                    if (item.includes('product_item_add_to_cart')) {
                        if (target.textContent?.includes('Add to cart')) {
                            this.cart.addToCart(PRODUCTS[Number(arr[6]) - 1]);
                            target.textContent = 'Drop from card';
                        } else {
                            this.cart.drop(PRODUCTS[Number(arr[6]) - 1]);
                            target.textContent = 'Add to cart';
                        }
                        this.cart.setSumNum();
                    } else if (item.includes('product_item_details_id')) {
                        this.router.route(event);
                        console.log((target as HTMLAnchorElement).href);
                    }
                });
            }
        });
    }
}

export default App;
