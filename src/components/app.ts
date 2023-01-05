import { PRODUCTS } from '../products';
import Cart from './cart/cart';
import Products from './catalog/catalog';
import Filters from './filters/filters';
import ProductDetails from './product-details/product-details';
import Router from './router';
import Search from './search/search';
import QueryString from './queryString';

class App {
    search() {
        throw new Error('Method not implemented.');
    }
    cart: Cart;
    renderDetails: ProductDetails;
    router: Router;
    products: Products;
    renderSearch: Search;
    filters: Filters;
    query: QueryString;
    constructor() {
        this.cart = new Cart(PRODUCTS[1]);
        this.renderDetails = new ProductDetails();
        this.router = new Router();
        this.products = new Products();
        this.renderSearch = new Search();
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
        window.addEventListener('load', () => {
            this.query.load();
        });
    }
}

export default App;
