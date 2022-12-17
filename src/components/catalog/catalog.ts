import { PRODUCTS } from '../../products';

class Products {
    render() {
        const rootProducts = document.querySelector('.products') as HTMLDivElement;
        console.log(rootProducts);
        let HTMLCatalog = '';

        PRODUCTS.forEach((element) => {
            HTMLCatalog += `
            <li class='products_item'>
                <span>${element.title}</span>
                <img src = "${element.thumbnail}"/>
            </li>
            `;
        });

        const HTMLListContainer = `<ul class="products__list">${HTMLCatalog}</ul>`;

        rootProducts.innerHTML = HTMLListContainer;
    }
}

export default Products;
