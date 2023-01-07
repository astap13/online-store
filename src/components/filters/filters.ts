import { app } from '../../main';
import { PRODUCTS } from '../../products';
import { IProductItem } from '../../types';

class Filters {
    products: IProductItem[];
    constructor() {
        this.products = PRODUCTS;
    }
    async renderFilters() {
        const root = document.querySelector('.filters') as HTMLElement;
        const route = '/pages/filters.html';
        const html = await fetch(route).then((data) => data.text());
        const filtersElement = document.createElement('div');
        filtersElement.className = 'filters-container';
        filtersElement.innerHTML = html;
        root.append(filtersElement);
        this.renderItemsCategory();
        this.renderFiltersBrands();
        this.renderSliderPrice();
        this.resetFilters();
        this.renderSliderStock();
        const input = document.querySelectorAll('.category_checkbox') as NodeListOf<HTMLInputElement>;
        input.forEach((i) => {
            i.addEventListener('input', () => {
                this.filterAll(PRODUCTS);
                app.query.add('category', i.id);
                if (!i.checked) {
                    console.log('query.remove');
                    //todo query remove
                }
            });
        });
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
                <label aria-label='${element}'>
                    <input class="category_checkbox checkbox_filters" type="checkbox" id="${elementId}">
                    ${element}
                    <span>(${array.filter((item) => item === element).length}/5)</span>
                </label>
            `;
            filterListCategory.append(filterListItem);
        });
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
                <label aria-label='${element}'>
                    <input class="brand_checkbox checkbox_filters" type="checkbox" id="${elementId}">
                    ${element}
                    <span>(${array.filter((item) => item === element).length}/${5})</span>
                </label>
            `;
            filterListBrands.append(filterListItem);
        });
        const input = document.querySelectorAll('.brand_checkbox') as NodeListOf<HTMLInputElement>;
        input.forEach((i) => {
            i.addEventListener('input', () => {
                app.query.add('brand', i.id);
                this.filterAll(PRODUCTS);
            });
        });
    }
    async filterAll(arr: IProductItem[]): Promise<IProductItem[]> {
        const products = [...arr];
        const filtredCat = await this.filterCategory(products);
        const filtredCatBra = await this.filterBrand(filtredCat);
        const filtredSear = await app.search.searchFilter(filtredCatBra);
        const sorted = await app.search.sort(filtredSear);
        const byPrice = this.filterByPrice(sorted);
        const byStock = this.filterByStock(byPrice);
        app.products.renderProducts(byStock);
        app.catalogItems = byStock;
        app.search.showStat();
        this.updateFiltersData(byStock);
        return byStock;
    }
    updateFiltersData(byStock: IProductItem[]): void {
        const filterListCategories = document.querySelector('.filter-list-category') as HTMLDivElement;
        const filterListBrands = document.querySelector('.filter-list-brand') as HTMLDivElement;
        const inputsOfCategories = filterListCategories.querySelectorAll('.checkbox-line');
        const inputsOfBrands = filterListBrands.querySelectorAll('.checkbox-line');

        inputsOfCategories.forEach((input) => {
            const inputCat = input.querySelector('label')?.ariaLabel;
            const newValue = byStock.filter((item) => item.category === inputCat).length;
            input.querySelector('span')!.innerHTML = `(${newValue}/${5})`;
        });

        inputsOfBrands.forEach((input) => {
            const inputCat = input.querySelector('label')?.ariaLabel;
            const newValue = byStock.filter((item) => item.brand === inputCat).length;
            input.querySelector('span')!.innerHTML = `(${newValue}/${5})`;
        });
    }
    async filterCategory(arr: IProductItem[]): Promise<IProductItem[]> {
        const checkboxes = document.querySelectorAll('.category_checkbox') as NodeListOf<HTMLInputElement>;
        let newArr: IProductItem[] = [...arr];
        checkboxes.forEach((elem) => {
            if (elem.checked == true) {
                console.log(111);
                newArr = [];
                arr.forEach((item) => {
                    if (item.category.toLowerCase() === elem.id) {
                        newArr.push(item);
                    }
                });
                app.filters.products = newArr;
            }
        });
        return newArr;
    }

    async filterBrand(arr: IProductItem[]): Promise<IProductItem[]> {
        const products = arr;
        const checkboxes = document.querySelectorAll('.brand_checkbox') as NodeListOf<HTMLInputElement>;
        let newArr: IProductItem[] = arr;
        checkboxes.forEach((elem) => {
            if (elem.checked == true) {
                newArr = [...products].filter((el) => {
                    return Object.values(el).join('').toLowerCase().includes(elem.id);
                });
                app.products.renderProducts(newArr);
                app.filters.products = newArr;
            }
        });
        return newArr;
    }

    async resetFilters() {
        const products = this.products;
        document.querySelector('.reset-btn')?.addEventListener('click', function () {
            const checkboxesCategory = document.querySelectorAll('.category_checkbox') as NodeListOf<HTMLInputElement>;
            const checkboxesBrend = document.querySelectorAll('.brend_checkbox') as NodeListOf<HTMLInputElement>;
            checkboxesCategory.forEach((el) => {
                el.checked = false;
            });
            checkboxesBrend.forEach((el) => {
                el.checked = false;
            });
            app.products.renderProducts(products);
        });
    }

    renderSliderPrice() {
        const products = this.products;
        const fromSlider = document.querySelector('.sliders_control_price #fromSlider') as HTMLInputElement;
        const toSlider = document.querySelector('.sliders_control_price #toSlider') as HTMLInputElement;
        const fromData = document.querySelector('.from-data_price') as HTMLElement;
        const toData = document.querySelector('.to-data_price') as HTMLDivElement;
        const sort = [...products].sort((a, b) => (a.price > b.price ? 1 : -1));
        fromSlider.min = sort[0].price.toString();
        fromSlider.max = sort[sort.length - 1].price.toString();
        toSlider.max = sort[sort.length - 1].price.toString();
        toSlider.value = sort[sort.length - 1].price.toString();
        fromData.innerHTML = `${sort[0].price.toString()}`;
        toData.innerHTML = `${toSlider.value}`;
        fromSlider.addEventListener('input', () => {
            let to = Number(toSlider.value);
            let from = Number(fromSlider.value);
            if (to < from) [to, from] = [from, to];
            fromData.innerHTML = from.toString();
            toData.innerHTML = to.toString();
            const newArr: IProductItem[] = [];
            products.forEach((el) => {
                if (el.price >= from && el.price <= to) {
                    newArr.push(el);
                }
            });
            this.filterAll(newArr);
            app.query.add('price', `${from}|${to}`);
        });
        toSlider.addEventListener('input', () => {
            let to = Number(toSlider.value);
            let from = Number(fromSlider.value);
            if (to < from) [to, from] = [from, to];
            fromData.innerHTML = from.toString();
            toData.innerHTML = to.toString();
            const newArr: IProductItem[] = [];
            products.forEach((el) => {
                if (el.price >= from && el.price <= to) {
                    newArr.push(el);
                }
            });
            this.filterAll(newArr);
            app.query.add('price', `${from}|${to}`);
        });
    }
    filterByPrice(arr: IProductItem[]): IProductItem[] {
        const fromSlider = document.querySelector('.sliders_control_price #fromSlider') as HTMLInputElement;
        const toSlider = document.querySelector('.sliders_control_price #toSlider') as HTMLInputElement;
        const newArr: IProductItem[] = [];
        arr.forEach((el) => {
            if (el.price >= Number(fromSlider.value) && el.price <= Number(toSlider.value)) {
                newArr.push(el);
            }
        });
        return newArr;
    }

    renderSliderStock() {
        const products = this.products;
        const fromSlider = document.querySelector('.sliders_control_stock #fromSlider') as HTMLInputElement;
        const toSlider = document.querySelector('.sliders_control_stock #toSlider') as HTMLInputElement;
        const fromData = document.querySelector('.from-data_stock') as HTMLElement;
        const toData = document.querySelector('.to-data_stock') as HTMLDivElement;
        const sort = [...products].sort((a, b) => (a.stock > b.stock ? 1 : -1));
        fromSlider.min = sort[0].stock.toString();
        fromSlider.max = sort[sort.length - 1].stock.toString();
        toSlider.max = sort[sort.length - 1].stock.toString();
        toSlider.value = sort[sort.length - 1].stock.toString();
        fromData.innerHTML = `${sort[0].stock.toString()}`;
        toData.innerHTML = `${toSlider.value}`;
        fromSlider.addEventListener('input', () => {
            let to = Number(toSlider.value);
            let from = Number(fromSlider.value);
            if (to < from) [to, from] = [from, to];
            fromData.innerHTML = from.toString();
            toData.innerHTML = to.toString();
            const newArr: IProductItem[] = [];
            products.forEach((el) => {
                if (el.stock >= from && el.stock <= to) {
                    newArr.push(el);
                }
            });
            this.filterAll(newArr);
        });
        toSlider.addEventListener('input', () => {
            let to = Number(toSlider.value);
            let from = Number(fromSlider.value);
            if (to < from) [to, from] = [from, to];
            fromData.innerHTML = from.toString();
            toData.innerHTML = to.toString();
            const newArr: IProductItem[] = [];
            products.forEach((el) => {
                if (el.stock >= from && el.stock <= to) {
                    newArr.push(el);
                }
            });
            this.filterAll(newArr);
        });
    }
    filterByStock(arr: IProductItem[]): IProductItem[] {
        const fromSlider = document.querySelector('.sliders_control_stock #fromSlider') as HTMLInputElement;
        const toSlider = document.querySelector('.sliders_control_stock #toSlider') as HTMLInputElement;
        const newArr: IProductItem[] = [];
        arr.forEach((el) => {
            if (el.stock >= Number(fromSlider.value) && el.stock <= Number(toSlider.value)) {
                newArr.push(el);
            }
        });
        return newArr;
    }
    setListenersFilter() {
        console.log('listen');
    }
}

export default Filters;
