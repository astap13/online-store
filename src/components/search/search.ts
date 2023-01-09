import { app } from '../../main';
import { PRODUCTS } from '../../products';
import { IProductItem } from '../../types';

class Search {
    bigTile: boolean;
    products: IProductItem[];
    constructor() {
        this.bigTile = true;
        this.products = PRODUCTS;
    }
    async renderSearch() {
        const root = document.querySelector('.main_container') as HTMLElement;
        const route = '/pages/search.html';
        const html = await fetch(route).then((data) => data.text());
        const searchElement = document.createElement('div');
        searchElement.innerHTML = html;
        root.prepend(searchElement);
        const stat = PRODUCTS.length;
        const statBlock = document.querySelector('.stat') as HTMLElement;
        if (statBlock) statBlock.innerHTML = `Found: ${stat}`;
        this.viewMode();
        const inputSort = document.querySelector('.sort-bar') as HTMLInputElement;
        if (inputSort) {
            inputSort.addEventListener('change', () => {
                app.filters.filterAll(PRODUCTS);
            });
        }
        const input = document.querySelector('.searhProducts') as HTMLInputElement;
        if (input) {
            input.addEventListener('input', async () => {
                app.catalogItems = await app.filters.filterAll(PRODUCTS);
                this.showStat();
            });
        }
        this.loadSort();
    }
    showStat() {
        const statBlock = document.querySelector('.stat') as HTMLElement;
        if (statBlock) {
            if (app.catalogItems.length > 0) {
                statBlock.innerHTML = `Found: ${app.catalogItems.length}`;
            } else {
                const statBlock = document.querySelector('.stat') as Element;
                statBlock.innerHTML = 'Not found';
            }
        }
    }
    toggleView(view: string) {
        const smallBtn = document.querySelector('.small-v') as HTMLButtonElement;
        const bigBtn = document.querySelector('.big-v') as HTMLButtonElement;
        const itemInfo = document.querySelectorAll('div.item_info') as NodeListOf<Element>;
        const item = document.querySelectorAll('li.products_item') as NodeListOf<Element>;
        const btnContainer = document.querySelectorAll('.button_container') as NodeListOf<Element>;
        if (view === 'big') {
            smallBtn.classList.remove('active-mode');
            bigBtn.classList.add('active-mode');
            itemInfo.forEach((el) => {
                el.classList.remove('hide');
            });
            item.forEach((el) => {
                el.classList.remove('itemSmall');
            });
            btnContainer.forEach((el) => {
                el.classList.remove('small_mode_btn');
            });
            this.bigTile = false;
        } else if (view === 'small') {
            smallBtn.classList.add('active-mode');
            bigBtn.classList.remove('active-mode');
            itemInfo.forEach((el) => {
                el.classList.add('hide');
            });
            item.forEach((el) => {
                el.classList.add('itemSmall');
            });
            btnContainer.forEach((el) => {
                el.classList.add('small_mode_btn');
            });
            this.bigTile = true;
        }
        app.query.add('view', view);
    }
    async viewMode() {
        const smallBtn = document.querySelector('.small-v') as HTMLButtonElement;
        const bigBtn = document.querySelector('.big-v') as HTMLButtonElement;
        if (!(smallBtn || bigBtn)) return;
        smallBtn.addEventListener('click', () => {
            this.toggleView('small');
        });
        bigBtn.addEventListener('click', () => {
            this.toggleView('big');
        });
    }
    searchFilter(arr: IProductItem[]): IProductItem[] {
        const input = document.querySelector('.searhProducts') as HTMLInputElement;
        if (input) {
            const newArr = [...arr].filter((el) => {
                return Object.values(el).join('').toLowerCase().includes(input.value.toLowerCase());
            });
            app.query.add('search', input.value);
            return newArr;
        }
        return arr;
    }
    async sort(arr: IProductItem[]): Promise<IProductItem[]> {
        const input = document.querySelector('.sort-bar') as HTMLInputElement;
        if (!input) return arr;
        let newArr: IProductItem[] = arr;
        if (input.value == 'price-ASC') {
            newArr = [...arr].sort((a, b) => (a.price > b.price ? 1 : -1));
            //app.products.renderProducts(newArr);
        }
        if (input.value == 'price-DESC') {
            newArr = [...arr].sort((a, b) => (a.price < b.price ? 1 : -1));
            //app.products.renderProducts(newArr);
        }
        if (input.value == 'rating-ASC') {
            newArr = [...arr].sort((a, b) => (a.rating > b.rating ? 1 : -1));
            //app.products.renderProducts(newArr);
        }
        if (input.value == 'rating-DESC') {
            newArr = [...arr].sort((a, b) => (a.rating < b.rating ? 1 : -1));
            //app.products.renderProducts(newArr);
        }
        if (input.value == 'discount-ASC') {
            newArr = [...arr].sort((a, b) => (a.discountPercentage > b.discountPercentage ? 1 : -1));
            //app.products.renderProducts(newArr);
        }
        if (input.value == 'discount-DESC') {
            newArr = [...arr].sort((a, b) => (a.discountPercentage < b.discountPercentage ? 1 : -1));
            //app.products.renderProducts(newArr);
        }
        if (input.value === 'sort-title') {
            app.query.add('sort', '');
        } else {
            app.query.add('sort', input.value);
        }
        return newArr;
    }
    loadSort() {
        const params = app.query.load();
        const inputSort = document.querySelector('.sort-bar') as HTMLInputElement;
        if (inputSort) {
            let sort = params.get('sort') as string;
            if (sort === undefined) sort = 'sort-title';
            inputSort.value = sort;
        }
        const inputSearch = document.querySelector('.searhProducts') as HTMLInputElement;
        if (inputSearch) {
            let search = params.get('search') as string;
            if (search === undefined) search = '';
            inputSearch.value = search;
        }
        if (params.get('view')) {
            this.toggleView(params.get('view') as string);
        }
    }
}

export default Search;
