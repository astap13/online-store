import { app } from '../../main';
import { PRODUCTS } from '../../products';
import { IProductItem } from '../../types';

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
        this.sliderStock();
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
        const sort = [...PRODUCTS].sort((a, b) => (a.price > b.price ? 1 : -1));
        fromSlider.min = sort[0].price.toString();
        fromSlider.min = sort[0].price.toString();
        fromSlider.max = sort[sort.length - 1].price.toString();
        toSlider.max = sort[sort.length - 1].price.toString();
        fromSlider.value = sort[0].price.toString();
        toSlider.value = sort[sort.length - 1].price.toString();
        fromData.innerHTML = `${sort[0].price.toString()}`;
        toData.innerHTML = `${sort[sort.length - 1].price.toString()}`;
        sliderContainer.addEventListener('change', function () {
            fromData.innerHTML = fromSlider.value;
            toData.innerHTML = toSlider.value;
            const newArr: IProductItem[] = [];
            PRODUCTS.forEach((el) => {
                if (el.price >= Number(fromSlider.value) && el.price <= Number(toSlider.value)) {
                    newArr.push(el);
                }
            });
            app.products.renderProducts(newArr);
        });
    }

    async sliderStock() {
        const sliderContainer = document.querySelector('.sliders_control_stock') as HTMLDivElement;
        const fromSlider = document.querySelector('.sliders_control_stock #fromSlider') as HTMLInputElement;
        const toSlider = document.querySelector('.sliders_control_stock #toSlider') as HTMLInputElement;
        const fromData = document.querySelector('.from-data_stock') as HTMLElement;
        const toData = document.querySelector('.to-data_stock') as HTMLDivElement;
        const sort = [...PRODUCTS].sort((a, b) => (a.stock > b.stock ? 1 : -1));
        fromSlider.min = sort[0].stock.toString();
        fromSlider.min = sort[0].stock.toString();
        fromSlider.max = sort[sort.length - 1].stock.toString();
        toSlider.max = sort[sort.length - 1].stock.toString();
        fromSlider.value = sort[0].stock.toString();
        toSlider.value = sort[sort.length - 1].stock.toString();
        fromData.innerHTML = `${sort[0].stock.toString()}`;
        toData.innerHTML = `${sort[sort.length - 1].stock.toString()}`;
        sliderContainer.addEventListener('change', function () {
            fromData.innerHTML = fromSlider.value;
            toData.innerHTML = toSlider.value;
            const newArr: IProductItem[] = [];
            PRODUCTS.forEach((el) => {
                if (el.stock >= Number(fromSlider.value) && el.stock <= Number(toSlider.value)) {
                    newArr.push(el);
                }
            });
            app.products.renderProducts(newArr);
        });
    }
}

export default Filters;
