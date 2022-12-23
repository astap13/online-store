import { app } from '../main';
import { IRoutes } from '../types';

class Router {
    routes: IRoutes;
    constructor() {
        this.routes = {
            '/cart': '/pages/cart.html',
            '/': '/pages/main.html',
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
        console.log(1);
    }
    route(event: Event): void {
        event = event || window.event;
        event.preventDefault();
        window.history.pushState({}, '', (event.target as HTMLAnchorElement).href);
        this.handleLocation();
    }
    async handleLocation(): Promise<void> {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes[404];
        const html = await fetch(route).then((data) => data.text());
        const main = document.querySelector('.main') as HTMLElement;
        main.innerHTML = '';
        main.innerHTML = html;
        switch (path) {
            case '/':
                app.renderProducts();
                break;
            case '/cart':
                app.cart.renderCart();
                break;
        }
        app.cart.setSumNum();
    }
}

export { Router };
