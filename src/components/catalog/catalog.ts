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
                <div class='item_info'>
                    <p class='item_content'>Category: ${element.category}</p>
                    <p class='item_content'>Brand: ${element.brand}</p>
                    <p class='item_content'>Price: ${element.price}EU</p>
                    <p class='item_content'>Discount: ${element.discountPercentage}</p>
                    <p class='item_content'>Rating: ${element.rating}</p>
                    <p class='item_content'>Stock: ${element.stock}</p>
                </div>
                <img class='products_img' src = "${element.thumbnail}"/>
                
            </li>
            `;
        });

        const HTMLListContainer = `<ul class="products__list">${HTMLCatalog}</ul>`;

        rootProducts.innerHTML = HTMLListContainer;
    }
}

export default Products;
