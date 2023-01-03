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
        console.log(path);
        if (path.includes('/product-details')) {
            num = +path.split('/')[2];
            console.log(num);
            path = '/product-details';
        }
        console.log(path);
        const routes: IRoutes = {
            '/cart': '/pages/cart.html',
            '/': '/pages/main.html',
            '/product-details': '/pages/product-details.html',
            '404': '/pages/404.html',
        };
        const route = routes[path] || routes[404];
        console.log(route);
        const html = await fetch(route).then((data) => data.text());
        const main = document.querySelector('.main') as HTMLElement;
        main.innerHTML = '';
        main.innerHTML = html;
        switch (path) {
            case '/':
                app.products.renderProducts(PRODUCTS);
                // app.renderSearch.renderSearch();
                break;
            case '/cart':
                app.cart.renderCart();
                break;
            case '/product-details':
                app.renderDetails.renderItemPage(PRODUCTS[num - 1]);
                break;
        }
        app.cart.setSumNum();
    }
}

export { Router };
