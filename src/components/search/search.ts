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
    }

    //     search() {
    //         (document.querySelector('.searhProducts') as HTMLInputElement).oninput = function () {
    //             const val = this.value.trim();
    //             const items = document.querySelectorAll('.products_item');
    //             if (val != '') {
    //                 items.forEach(function (elem) {
    //                     if (elem.innerText.search(val) == -1){
    //                         elem.classList.add('hide');
    //                     } else {elem.classList.remove('hide');}

    //                     }
    //                 });
    //             }

    //         }
    //     }
}
export default Search;
