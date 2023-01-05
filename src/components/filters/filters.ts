import { app } from '../../main';
import { PRODUCTS } from '../../products';

class Filters {
    async renderFilters() {
        const root = document.querySelector('.filters') as HTMLElement;
        const route = '/pages/filters.html';
        const html = await fetch(route).then((data) => data.text());
        const filtersElement = document.createElement('div');
        filtersElement.className = 'filters-container';
        filtersElement.innerHTML = html;
        root.append(filtersElement);
        this.renderItemsCategory();
        this.filterCategory();
        this.filterBrand();
    }

    async renderItemsCategory() {
        const filterListCategory = document.querySelector('.filter-list-category') as HTMLDivElement;
        const array: string[] = [];
        PRODUCTS.forEach((el) => {
            array.push(el.category);
        });
        const arrayOfCategory = Array.from(new Set(array));
        arrayOfCategory.forEach((element) => {
            const filterListItem = document.createElement('div');
            filterListItem.className = 'checkbox-line';
            const elementId = element.split(' ').join('_').toLowerCase();
            filterListItem.innerHTML = `
                <label>
                    <input class="category_checkbox" type="checkbox" id="${elementId}">
                    ${element}
                    <span>(${array.filter((item) => item === element).length}/${5})</span>
                </label>
            `;
            filterListCategory.append(filterListItem);
        });
        this.renderFiltersBrands();
    }

    async renderFiltersBrands() {
        const filterListBrands = document.querySelector('.filter-list-brand') as HTMLDivElement;
        const array: string[] = [];
        PRODUCTS.forEach((el) => {
            array.push(el.brand);
        });
        const arrayOfBrands = Array.from(new Set(array));
        arrayOfBrands.forEach((element) => {
            const filterListItem = document.createElement('div');
            filterListItem.className = 'checkbox-line';
            const elementId = element.split(' ').join('_').toLowerCase();
            filterListItem.innerHTML = `
                <label>
                    <input class="brend_checkbox" type="checkbox" id="${elementId}">
                    ${element}
                    <span>(${array.filter((item) => item === element).length}/${5})</span>
                </label>
            `;
            filterListBrands.append(filterListItem);
        });
    }

    async filterCategory() {
        const checkboxContainer = document.querySelector('.filter-list-category') as HTMLElement;
        const checkboxes = document.querySelectorAll('.category_checkbox') as NodeListOf<HTMLInputElement>;
        checkboxContainer?.addEventListener('change', function () {
            checkboxes.forEach((elem) => {
                if (elem.checked == true) {
                    const newArr = [...PRODUCTS].filter((el) => {
                        return Object.values(el).includes(elem.id.toLowerCase());
                    });
                    console.log(newArr);
                    app.products.renderProducts(newArr);
                }
            });
        });
    }

    async filterBrand() {
        const checkboxContainer = document.querySelector('.filter-list-brand') as HTMLElement;
        const checkboxes = document.querySelectorAll('.brend_checkbox') as NodeListOf<HTMLInputElement>;
        checkboxContainer?.addEventListener('change', function () {
            checkboxes.forEach((elem) => {
                if (elem.checked == true) {
                    const newArr = [...PRODUCTS].filter((el) => {
                        return Object.values(el).join('').toLowerCase().includes(elem.id);
                    });
                    console.log(elem.id);
                    console.log(newArr);
                    app.products.renderProducts(newArr);
                }
            });
        });
    }
}

export default Filters;
