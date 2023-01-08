import { app } from '../main';
import { PRODUCTS } from '../products';
import { IRoutes } from '../types';

class Router {
    routes: IRoutes;
    constructor() {
        this.routes = {
            '/cart': '/pages/cart.html',
            '/': '/pages/main.html',
            '/product-details': '/pages/products-details.html',
            '404': '/pages/404.html',
        };
    }
    setRoutes(): void {
        document.querySelectorAll('.link_route').forEach((element) => {
            element.addEventListener('click', (event) => {
                this.route(event);
            });
        });
        this.handleLocation();
        window.onpopstate = this.handleLocation;
        window.route = this.handleLocation;
    }
    route(event: Event): void {
        event = event || window.event;
        event.preventDefault();
        window.history.pushState({}, '', (event.target as HTMLAnchorElement).href || (event.target as HTMLInputElement).src);
        this.handleLocation();
    }
    async handleLocation(): Promise<void> {
        let path: string = window.location.pathname;
        let num = 0;
        if (path.includes('/product-details')) {
            num = +path.split('/')[2];
            path = '/product-details';
        }
        const routes: IRoutes = {
            '/cart': '/pages/cart.html',
            '/': '/pages/main.html',
            '/product-details': '/pages/product-details.html',
            '404': '/pages/404.html',
        };
        const route = routes[path] || routes[404];
        const html = await fetch(route).then((data) => data.text());
        const main = document.querySelector('.main') as HTMLElement;
        main.innerHTML = '';
        main.innerHTML = html;
        switch (path) {
            case '/':
                app.search.renderSearch();
                app.filters.renderFilters();
                app.filters.filterAll(PRODUCTS);
                break;
            case '/cart':
                app.cart.renderCart();
                app.cart.renderSum();
                break;
            case '/product-details':
                app.renderDetails.renderItemPage(PRODUCTS[num - 1]);
                break;
        }
        app.cart.setSumNum();
    }
}

export default Router;
