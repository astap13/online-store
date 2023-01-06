import { PRODUCTS } from '../products';
import Cart from './cart/cart';
import Products from './catalog/catalog';
import Filters from './filters/filters';
import ProductDetails from './product-details/product-details';
import Router from './router';
import Search from './search/search';
import QueryString from './queryString';

class App {
    /* search() {
        throw new Error('Method not implemented.');
    } */
    cart: Cart;
    renderDetails: ProductDetails;
    router: Router;
    products: Products;
    search: Search;
    filters: Filters;
    query: QueryString;
    constructor() {
        this.cart = new Cart(PRODUCTS[1]);
        this.renderDetails = new ProductDetails();
        this.router = new Router();
        this.products = new Products();
        this.search = new Search();
        this.filters = new Filters();
        this.query = new QueryString();
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
        this.addEventListeners();
    }
    addEventListeners() {
        window.addEventListener('load', () => {
            this.query.load();
            this.cart.loadCart();
        });
        window.addEventListener('beforeunload', () => {
            this.cart.saveCart();
        });
        this.cart.setEventListerners();
    }
}

export default App;
