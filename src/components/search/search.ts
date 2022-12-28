import { PRODUCTS } from '../../products';

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
        // this.search();
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
    // async search() {
    //     const newPRODUCTS: {
    //         id: number;
    //         title: string;
    //         description: string;
    //         price: number;
    //         discountPercentage: number;
    //         rating: number;
    //         stock: number;
    //         brand: string;
    //         category: string;
    //         thumbnail: string;
    //         images: string[];
    //     }[] = [];
    //     const input = document.querySelector('.searhProducts') as HTMLInputElement;
    //     const elements = document.querySelectorAll('.products_item');
    //     console.log('проверка массива', elements);
    //     input.addEventListener('input', function () {
    //         if (input.value !== '') {
    //             PRODUCTS.forEach(function (el) {
    //                 if (el.title == input.value) {
    //                     newPRODUCTS.push(el);
    //                 }
    //             });
    //         }
    //         console.log(newPRODUCTS);
    //     });
    // }
    async sort() {}
}

export default Search;
