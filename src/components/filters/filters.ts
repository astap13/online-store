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
        //this.resetFilters();
        this.renderSliderStock();
        const input = document.querySelectorAll('.category_checkbox') as NodeListOf<HTMLInputElement>;
        input.forEach((i) => {
            i.addEventListener('input', () => {
                this.filterAll(PRODUCTS);
            });
        });
        setTimeout(() => {
            this.loadAllFilter();
        }, 100);
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
                    <span>(${array.filter((item) => item === element).length}/${
                PRODUCTS.filter((item) => item.category === element).length
            })</span>
                </label>
            `;
            if (filterListCategory) {
                filterListCategory.append(filterListItem);
            }
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
                    <span>(${array.filter((item) => item === element).length}/${
                PRODUCTS.filter((item) => item.brand === element).length
            })</span>
                </label>
            `;
            if (filterListBrands) {
                filterListBrands.append(filterListItem);
            }
        });
        const input = document.querySelectorAll('.brand_checkbox') as NodeListOf<HTMLInputElement>;
        input.forEach((i) => {
            i.addEventListener('input', () => {
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
        const result = byStock;
        app.products.renderProducts(result);
        app.catalogItems = result;
        this.updateFiltersData(result);
        app.search.showStat();
        return result;
    }
    updateFiltersData(byStock: IProductItem[]): void {
        const filterListCategories = document.querySelector('.filter-list-category') as HTMLDivElement;
        const filterListBrands = document.querySelector('.filter-list-brand') as HTMLDivElement;
        if (filterListBrands && filterListCategories) {
            const inputsOfCategories = filterListCategories.querySelectorAll('.checkbox-line');
            const inputsOfBrands = filterListBrands.querySelectorAll('.checkbox-line');
            inputsOfCategories.forEach((input) => {
                const inputCat = input.querySelector('label')?.ariaLabel;
                const newValue = byStock.filter((item) => item.category === inputCat).length;
                const newValue2 = PRODUCTS.filter((item) => item.category === inputCat).length;
                const span = input.querySelector('span') as HTMLSpanElement;
                span.innerHTML = `(${newValue}/${newValue2})`;
            });
            inputsOfBrands.forEach((input) => {
                const inputCat = input.querySelector('label')?.ariaLabel;
                const newValue = byStock.filter((item) => item.brand === inputCat).length;
                const newValue2 = PRODUCTS.filter((item) => item.brand === inputCat).length;
                const span = input.querySelector('span') as HTMLSpanElement;
                span.innerHTML = `(${newValue}/${newValue2})`;
            });
        }
    }
    async filterCategory(arr: IProductItem[]): Promise<IProductItem[]> {
        const checkboxes = document.querySelectorAll('.category_checkbox') as NodeListOf<HTMLInputElement>;
        let newArr: IProductItem[] = [...arr];
        newArr = [];
        const checked: string[] = [];
        checkboxes.forEach((elem) => {
            if (elem.checked == true) {
                checked.push(elem.id);
                arr.forEach((item) => {
                    if (item.category.toLowerCase() === elem.id) {
                        newArr.push(item);
                    }
                });
                app.filters.products = newArr;
            }
        });
        if (checked.length === 0) {
            app.query.add('category', '');
            return arr;
        }
        const query = checked.join('|');
        app.query.add('category', query);
        return newArr;
    }

    async filterBrand(arr: IProductItem[]): Promise<IProductItem[]> {
        const checkboxes = document.querySelectorAll('.brand_checkbox') as NodeListOf<HTMLInputElement>;
        let newArr: IProductItem[] = [...arr];
        newArr = [];
        const checked: string[] = [];
        checkboxes.forEach((elem) => {
            if (elem.checked === true) {
                checked.push(elem.id);
                arr.forEach((item) => {
                    if (item.brand.toLowerCase() === elem.id.split('_').join(' ')) {
                        newArr.push(item);
                    }
                });
                app.filters.products = newArr;
            }
        });
        if (checked.length === 0) {
            app.query.add('brand', '');
            return arr;
        }
        const query = checked.join('|');
        app.query.add('brand', query);
        return newArr;
    }

    async resetFilters() {
        document.querySelector('.reset-btn')?.addEventListener('click', () => {
            const checkboxesCategory = document.querySelectorAll('.category_checkbox') as NodeListOf<HTMLInputElement>;
            const checkboxesBrend = document.querySelectorAll('.brand_checkbox') as NodeListOf<HTMLInputElement>;
            checkboxesCategory.forEach((el) => {
                el.checked = false;
            });
            checkboxesBrend.forEach((el) => {
                el.checked = false;
            });
            /* const sort = document.querySelector('.sort-bar') as HTMLInputElement;
            if (sort) sort.value = 'sort-title';
            const search = document.querySelector('.searhProducts') as HTMLInputElement;
            if (search) search.value = '';
            const fromPrice = document.querySelector('#fromSliderPrice') as HTMLInputElement;
            const toPrice = document.querySelector('#toSliderPrice') as HTMLInputElement;
            if (fromPrice && toPrice) {
                fromPrice.value = fromPrice.min;
                toPrice.value = toPrice.max;
            } */
            window.history.pushState({}, '', '/');
            this.filterAll(PRODUCTS);
        });
    }

    renderSliderPrice() {
        const products = this.products;
        const fromSlider = document.querySelector('#fromSliderPrice') as HTMLInputElement;
        const toSlider = document.querySelector('#toSliderPrice') as HTMLInputElement;
        const fromData = document.querySelector('.from-data_price') as HTMLElement;
        const toData = document.querySelector('.to-data_price') as HTMLDivElement;
        if (!(fromSlider || toSlider || toSlider || fromData || toData)) {
            return;
        }
        const sort = [...products].sort((a, b) => (a.price > b.price ? 1 : -1));
        fromSlider.min = sort[0].price.toString();
        fromSlider.max = sort[sort.length - 1].price.toString();
        toSlider.max = fromSlider.max;
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
        const fromSlider = document.querySelector('#fromSliderPrice') as HTMLInputElement;
        const toSlider = document.querySelector('#toSliderPrice') as HTMLInputElement;
        if (fromSlider && toSlider) {
            const newArr: IProductItem[] = [];
            arr.forEach((el) => {
                if (el.price >= Number(fromSlider.value) && el.price <= Number(toSlider.value)) {
                    newArr.push(el);
                }
            });
            return newArr;
        }
        return arr;
    }

    renderSliderStock() {
        const products = this.products;
        const fromSlider = document.querySelector('#fromSliderStock') as HTMLInputElement;
        const toSlider = document.querySelector('#toSliderStock') as HTMLInputElement;
        const fromData = document.querySelector('.from-data_stock') as HTMLElement;
        const toData = document.querySelector('.to-data_stock') as HTMLDivElement;
        if (!(fromSlider || toSlider || toSlider || fromData || toData)) {
            return;
        }
        const sort = [...products].sort((a, b) => (a.stock > b.stock ? 1 : -1));
        fromSlider.min = sort[0].stock.toString();
        fromSlider.max = sort[sort.length - 1].stock.toString();
        toSlider.max = fromSlider.max;
        toSlider.value = toSlider.max;
        fromSlider.value = fromSlider.min;
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
            app.query.add('stock', `${from}|${to}`);
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
            app.query.add('stock', `${from}|${to}`);
        });
    }
    filterByStock(arr: IProductItem[]): IProductItem[] {
        const fromSlider = document.querySelector('#fromSliderStock') as HTMLInputElement;
        const toSlider = document.querySelector('#toSliderStock') as HTMLInputElement;
        const newArr: IProductItem[] = [];
        if (fromSlider && toSlider) {
            arr.forEach((el) => {
                if (el.stock >= Number(fromSlider.value) && el.stock <= Number(toSlider.value)) {
                    newArr.push(el);
                }
            });
            return newArr;
        }
        return arr;
    }
    loadAllFilter() {
        const params = app.query.load();
        const category = params.get('category');
        const checkboxesCat = document.querySelectorAll('.category_checkbox') as NodeListOf<HTMLInputElement>;
        checkboxesCat.forEach((el) => {
            if (category?.includes(el.id)) {
                el.checked = true;
            }
        });
        const brand = params.get('brand');
        const checkboxesBra = document.querySelectorAll('.brand_checkbox') as NodeListOf<HTMLInputElement>;
        checkboxesBra.forEach((el) => {
            if (brand?.includes(el.id)) {
                el.checked = true;
            }
        });
        const fromSliderStock = document.querySelector('#fromSliderStock') as HTMLInputElement;
        const toSliderStock = document.querySelector('#toSliderStock') as HTMLInputElement;
        if (fromSliderStock && toSliderStock) {
            if (params.get('stock')) {
                const from = params.get('stock')?.split('|')[0] as string;
                const to = params.get('stock')?.split('|')[1] as string;
                fromSliderStock.value = from;
                toSliderStock.value = to;
            }
        }
        const fromSliderPrice = document.querySelector('#fromSliderPrice') as HTMLInputElement;
        const toSliderPrice = document.querySelector('#toSliderPrice') as HTMLInputElement;
        if (fromSliderPrice && toSliderPrice) {
            if (params.get('price')) {
                const from = params.get('price')?.split('|')[0] as string;
                const to = params.get('price')?.split('|')[1] as string;
                fromSliderPrice.value = from;
                toSliderPrice.value = to;
            }
        }
    }
}

export default Filters;
