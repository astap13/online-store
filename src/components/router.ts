import { cart } from '../main';
import Products from './catalog/catalog';

function route(event: Event): void {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, '', (event.target as HTMLAnchorElement).href);
    handleLocation();
}
interface routes {
    [key: string]: string;
}

const routes: routes = {
    '/cart': '/pages/cart.html',
    '/': '/pages/main.html',
};

document.querySelectorAll('.link_route').forEach((element) => {
    element.addEventListener('click', route);
});
const handleLocation: () => void = async () => {
    const path = window.location.pathname;
    const productPage = new Products();
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    const main = document.querySelector('.main') as HTMLElement;
    main.innerHTML = '';
    main.innerHTML = html;
    switch (path) {
        case '/':
            productPage.render();
            break;
        case '/cart':
            cart.renderCart();
            break;
    }
    cart.setSumNum();
};
window.onpopstate = handleLocation;
handleLocation();

declare global {
    interface Window {
        route: (event: Event) => void;
    }
}
window.route = route;
export { route };
