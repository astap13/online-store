import { createElementWithClass } from '../../functions';
import { app } from '../../main';
import { PRODUCTS } from '../../products';

class Search {
    async renderSearch() {
        const root = document.querySelector('.main_container') as HTMLElement;
        const route = '/pages/search.html';
        const html = await fetch(route).then((data) => data.text());
        const searchElement = document.createElement('div');
        searchElement.innerHTML = html;
        root.prepend(searchElement);
        const stat = PRODUCTS.length;
        const statBlock = document.querySelector('.stat');
        if (statBlock) statBlock.innerHTML = `Found: ${stat}`;
        this.viewMode();
        this.search();
        this.sort();
    }
    async viewMode() {
        const smallBtn = document.querySelector('.small-v') as HTMLButtonElement;
        const bigBtn = document.querySelector('.big-v') as HTMLButtonElement;
        const itemInfo = document.querySelectorAll('div.item_info') as NodeListOf<Element>;
        const item = document.querySelectorAll('li.products_item') as NodeListOf<Element>;
        smallBtn.addEventListener('click', () => {
            if (bigBtn.classList.contains('active-mode')) {
                smallBtn.classList.toggle('active-mode');
                bigBtn.classList.toggle('active-mode');
                itemInfo.forEach((el) => {
                    el.classList.toggle('hide');
                });
                item.forEach((el) => {
                    el.classList.toggle('itemSmall');
                });
            }
        });
        bigBtn.addEventListener('click', () => {
            if (smallBtn.classList.contains('active-mode')) {
                smallBtn.classList.toggle('active-mode');
                bigBtn.classList.toggle('active-mode');
                itemInfo.forEach((el) => {
                    el.classList.toggle('hide');
                });
                item.forEach((el) => {
                    el.classList.toggle('itemSmall');
                });
            }
        });
    }

    search() {
        const input = document.querySelector('.searhProducts') as HTMLInputElement;
        const statBlock = document.querySelector('.stat') as Element;
        input.addEventListener('input', function () {
            const newArr = [...PRODUCTS].filter((el) => {
                return Object.values(el).join('').toLowerCase().includes(input.value.toLowerCase());
            });
            if (newArr.length > 0) {
                statBlock.innerHTML = `Found: ${newArr.length}`;
            } else {
                const statBlock = document.querySelector('.stat') as Element;
                statBlock.innerHTML = 'Not found';
            }
            app.products.renderProducts(newArr);
        });
    }
    async sort() {
        const input = document.querySelector('.sort-bar') as HTMLInputElement;
        input.addEventListener('change', function () {
            if (input.value == 'price-ASC') {
                const newArr = [...PRODUCTS].sort((a, b) => (a.price > b.price ? 1 : -1));
                app.products.renderProducts(newArr);
            }
            if (input.value == 'price-DESC') {
                const newArr = [...PRODUCTS].sort((a, b) => (a.price < b.price ? 1 : -1));
                app.products.renderProducts(newArr);
            }
            if (input.value == 'rating-ASC') {
                const newArr = [...PRODUCTS].sort((a, b) => (a.rating > b.rating ? 1 : -1));
                app.products.renderProducts(newArr);
            }
            if (input.value == 'rating-DESC') {
                const newArr = [...PRODUCTS].sort((a, b) => (a.rating < b.rating ? 1 : -1));
                app.products.renderProducts(newArr);
            }
            if (input.value == 'discount-ASC') {
                const newArr = [...PRODUCTS].sort((a, b) => (a.discountPercentage < b.discountPercentage ? 1 : -1));
                app.products.renderProducts(newArr);
            }
            if (input.value == 'discount-DESC') {
                const newArr = [...PRODUCTS].sort((a, b) => (a.discountPercentage < b.discountPercentage ? 1 : -1));
                app.products.renderProducts(newArr);
            }
        });
    }
}

export default Search;
