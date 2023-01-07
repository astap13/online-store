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
        /* this.filterCategory(PRODUCTS);
        this.filterBrand(PRODUCTS); */
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
                <label>
                    <input class="category_checkbox checkbox_filters" type="checkbox" id="${elementId}">
                    ${element}
                    <span>(${array.filter((item) => item === element).length}/${5})</span>
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
                <label>
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
    // тут мы проходим по всем фильтрам поиску и сортировке
    async filterAll(arr: IProductItem[]): Promise<IProductItem[]> {
        const products = [...arr];
        const filtredCat = await this.filterCategory(products);
        const filtredCatBra = await this.filterBrand(filtredCat);
        const filtredSear = await app.search.searchFilter(filtredCatBra);
        const sorted = await app.search.sort(filtredSear);
        const byPrice = this.filterByPrice(sorted);
        app.products.renderProducts(byPrice);
        app.catalogItems = byPrice;
        app.search.showStat();
        return byPrice;
    }
    async filterCategory(arr: IProductItem[]): Promise<IProductItem[]> {
        // const checkboxContainer = document.querySelector('.filter-list-category') as HTMLElement;
        const checkboxes = document.querySelectorAll('.category_checkbox') as NodeListOf<HTMLInputElement>;
        let newArr: IProductItem[] = [...arr];
        checkboxes.forEach((elem) => {
            if (elem.checked == true) {
                /* newArr = [...arr].filter((el) => {
                    return Object.values(el).includes(elem.id.toLowerCase());
                }); */
                console.log(111);
                newArr = [];
                arr.forEach((item) => {
                    if (item.category.toLowerCase() === elem.id) {
                        newArr.push(item);
                    }
                });
                //newArr = [...arr].filter((el) => el.category.toLowerCase() === elem.id.toLowerCase());
                // app.products.renderProducts(newArr);
                app.filters.products = newArr;
            }
        });
        return newArr;
        /* checkboxContainer.addEventListener('change', function () {
        }); */
    }

    async filterBrand(arr: IProductItem[]): Promise<IProductItem[]> {
        const products = arr;
        // const checkboxContainer = document.querySelector('.filter-list-brand') as HTMLElement;
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
        /* checkboxContainer?.addEventListener('change', function () {
        }); */
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
        //const sliderContainer = document.querySelector('.sliders_control_price') as HTMLDivElement;
        const fromSlider = document.querySelector('.sliders_control_price #fromSlider') as HTMLInputElement;
        const toSlider = document.querySelector('.sliders_control_price #toSlider') as HTMLInputElement;
        const fromData = document.querySelector('.from-data_price') as HTMLElement;
        const toData = document.querySelector('.to-data_price') as HTMLDivElement;
        const sort = [...products].sort((a, b) => (a.price > b.price ? 1 : -1));
        //fromSlider.min = sort[0].price.toString();
        fromSlider.min = sort[0].price.toString();
        fromSlider.max = sort[sort.length - 1].price.toString();
        //fromSlider.value = sort[10].price.toString();
        toSlider.max = sort[sort.length - 1].price.toString();
        toSlider.value = sort[sort.length - 1].price.toString();
        fromData.innerHTML = `${sort[0].price.toString()}`;
        //toData.innerHTML = `${sort[sort.length - 1].price.toString()}`;
        toData.innerHTML = `${toSlider.value}`;
        /* sliderContainer.addEventListener('change', () => {
            fromData.innerHTML = fromSlider.value;
            toData.innerHTML = toSlider.value;
            const newArr: IProductItem[] = [];
            products.forEach((el) => {
                if (el.price >= Number(fromSlider.value) && el.price <= Number(toSlider.value)) {
                    newArr.push(el);
                }
            });
            app.products.renderProducts(newArr);
        }); */
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
            /* let to = toSlider;
            let from = fromSlider;
            if (toSlider.value < fromSlider.value) {
                to = fromSlider;
                from = toSlider;
            } */
            //if (toSlider.value < fromSlider.value + 1) toSlider.value = fromSlider.value + 1; todo чтобы один слайдер не заходил за другой
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
        const sliderContainer = document.querySelector('.sliders_control_stock') as HTMLDivElement;
        const fromSlider = document.querySelector('.sliders_control_stock #fromSlider') as HTMLInputElement;
        const toSlider = document.querySelector('.sliders_control_stock #toSlider') as HTMLInputElement;
        const fromData = document.querySelector('.from-data_stock') as HTMLElement;
        const toData = document.querySelector('.to-data_stock') as HTMLDivElement;
        const sort = [...this.products].sort((a, b) => (a.stock > b.stock ? 1 : -1));
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
            products.forEach((el) => {
                if (el.stock >= Number(fromSlider.value) && el.stock <= Number(toSlider.value)) {
                    newArr.push(el);
                }
            });
            app.products.renderProducts(newArr);
        });
    }
    setListenersFilter() {
        console.log('listen');
    }
}

export default Filters;
