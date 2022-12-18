import './style.scss';
import './normalize.css';
import './components/product-details/product-details';

function route(event: Event): any {
    event = event || window.event;
    event.preventDefault();
    console.log(event);
    window.history.pushState({}, '', (event.target as HTMLAnchorElement).href);
    console.log(window.location.pathname);
}

async function handle(): Promise<void> {
    const path = window.location.pathname;
    const route = 1;
}

document.querySelectorAll('.link').forEach((el) => {
    el.addEventListener('click', route);
});
