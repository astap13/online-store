import { app } from '../../main';
import { PRODUCTS } from '../../products';
import { IProductItem } from '../../types';
import { Products } from '../catalog/catalog';
// export const RenderOfProd = new Products();

class Search {
    static search() {
        throw new Error('Method not implemented.');
    }

    async renderSearch() {
        const root = document.querySelector('.products') as HTMLElement;
        const route = '/pages/search.html';
        const html = await fetch(route).then((data) => data.text());
        const searchElement = document.createElement('div');
        searchElement.innerHTML = html;
        root.prepend(searchElement);
        const stat = PRODUCTS.length;
        document.querySelector('.stat')!.innerHTML = `Found: ${stat}`;
        this.viewMode();
        this.search();
        this.sort();
    }
    async viewMode() {
        const smallBtn = document.querySelector('.small-v') as HTMLButtonElement;
        const bigBtn = document.querySelector('.big-v') as HTMLButtonElement;
        const itemInfo = document.querySelectorAll('div.item_info') as NodeListOf<Element>;
        const item = document.querySelectorAll('li.products_item') as NodeListOf<Element>;
        const products = document.querySelectorAll('.products_item');
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
        input.addEventListener('input', function () {
            // console.log(PRODUCTS);
            // console.log('123', Object.values(PRODUCTS[0]));
            // console.log('123', Object.values(PRODUCTS[0]).includes(input.value));
            const newArr = PRODUCTS.filter((el) => {
                return Object.values(el).join('').toLowerCase().includes(input.value.toLowerCase());
            });

            console.log(newArr);
            // renderResults(newArr);
        });

        // const renderResults = (newArr: IProductItem[]) => {
        //     app.products.renderProducts(newArr);
        // };
    }
    async sort() {
        const input = document.querySelector('.sort-bar') as HTMLInputElement;
        input.addEventListener('change', function () {
            console.log('величина инпута', input.value);
            if (input.value == 'price-ASC') {
                const newArr = PRODUCTS.sort((a, b) => (a.price > b.price ? 1 : -1));
                console.log(newArr);
            }
            if (input.value == 'price-DESC') {
                const newArr = PRODUCTS.sort((a, b) => (a.price < b.price ? 1 : -1));
                console.log(newArr);
            }
            if (input.value == 'rating-ASC') {
                const newArr = PRODUCTS.sort((a, b) => (a.rating > b.rating ? 1 : -1));
                console.log(newArr);
            }
            if (input.value == 'rating-DESC') {
                const newArr = PRODUCTS.sort((a, b) => (a.rating < b.rating ? 1 : -1));
                console.log(newArr);
            }
            if (input.value == 'discount-ASC') {
                const newArr = PRODUCTS.sort((a, b) => (a.discountPercentage < b.discountPercentage ? 1 : -1));
                console.log(newArr);
            }
            if (input.value == 'discount-DESC') {
                const newArr = PRODUCTS.sort((a, b) => (a.discountPercentage < b.discountPercentage ? 1 : -1));
                console.log(newArr);
            }

            // const newArr = PRODUCTS.filter((el) => {
            //     return Object.values(el).join('').toLowerCase().includes(input.value.toLowerCase());
        });

        // console.log(newArr);
        // renderResults(newArr);
    }
}

export default Search;
