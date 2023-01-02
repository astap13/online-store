import { PRODUCTS } from '../../products';

class Filters {
    async renderFilters() {
        const root = document.querySelector('.filters') as HTMLElement;
        const route = '/pages/filters.html';
        const html = await fetch(route).then((data) => data.text());
        const filtersElement = document.createElement('div');
        filtersElement.className = 'filters-container';
        filtersElement.innerHTML = html;
        const filterListCategory = document.querySelector('.filter-list-category') as HTMLDivElement;
        root.append(filtersElement);
        this.renderItems();
    }

    async renderItems() {
        const filterListCategory = document.querySelector('.filter-list-category') as HTMLDivElement;
        const array: string[] = [];
        PRODUCTS.forEach((el) => {
            array.push(el.category);
        });
        const arrayOfCategory = Array.from(new Set(array));
        console.log(arrayOfCategory);
        arrayOfCategory.forEach((element) => {
            const filterListItem = document.createElement('div');
            filterListItem.className = 'checkbox-line';
            filterListItem.innerHTML = `
                <input type="checkbox" id="${element}">
                <label>${element}</label>
                <span>(${array.filter((item) => item === element).length}/${5})</span>
            `;
            filterListCategory.append(filterListItem);
        });
    }
}

export default Filters;
