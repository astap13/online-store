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
                    <input type="checkbox" id="${elementId}">
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
                    <input type="checkbox" id="${elementId}">
                    ${element}
                    <span>(${array.filter((item) => item === element).length}/${5})</span>
                </label>
            `;
            filterListBrands.append(filterListItem);
        });
    }
}

export default Filters;
