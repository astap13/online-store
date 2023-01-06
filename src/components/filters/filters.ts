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
        this.sliderPrice();
        this.resetFilters();
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

    async resetFilters() {
        document.querySelector('.reset-btn')?.addEventListener('click', function () {
            const checkboxesCategory = document.querySelectorAll('.category_checkbox') as NodeListOf<HTMLInputElement>;
            const checkboxesBrend = document.querySelectorAll('.brend_checkbox') as NodeListOf<HTMLInputElement>;
            checkboxesCategory.forEach((el) => {
                el.checked = false;
            });
            checkboxesBrend.forEach((el) => {
                el.checked = false;
            });
            app.products.renderProducts(PRODUCTS);
        });
    }

    async sliderPrice() {
        const sliderContainer = document.querySelector('.sliders_control_price') as HTMLDivElement;
        const fromSlider = document.querySelector('.sliders_control_price #fromSlider') as HTMLInputElement;
        const toSlider = document.querySelector('.sliders_control_price #toSlider') as HTMLInputElement;
        const fromData = document.querySelector('.from-data_price') as HTMLElement;
        const toData = document.querySelector('.to-data_price') as HTMLDivElement;
        sliderContainer.addEventListener('change', function () {
            fromData.innerHTML = fromSlider.value;
            toData.innerHTML = toSlider.value;
        });
    }
}

export default Filters;
