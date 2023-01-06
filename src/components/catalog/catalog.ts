import { app } from '../../main';
import { IProductItem } from '../../types';

export class Products {
    renderProducts(arrProducts: IProductItem[]) {
        const rootProducts = document.querySelector('.products') as HTMLDivElement;
        let HTMLCatalog = '';

        arrProducts.forEach((element) => {
            let textBtn = 'Add to cart';
            if (app.cart.cart.find((item) => item.description === element.description)) {
                textBtn = 'Drop from card';
            }
            HTMLCatalog += `
            <li class='products_item' style="background-image: url('${element.thumbnail}'), url('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png')">
                <div class='item_title'>${element.title}</div>
                <div class='item_info'>
                    <p class='item_content'>Category: ${element.category}</p>
                    <p class='item_content'>Brand: ${element.brand}</p>
                    <p class='item_content'>Price: ${element.price}EU</p>
                    <p class='item_content'>Discount: ${element.discountPercentage}</p>
                    <p class='item_content'>Rating: ${element.rating}</p>
                    <p class='item_content'>Stock: ${element.stock}</p>
                </div>
                <div class='button_container'>
                <button class='btn_product_item product_item_add_to_cart_id_${element.id}'>${textBtn}</button>
                <a class='btn_product_item product_item_details_id_${element.id}' href="/product-details/${element.id}">Details</a></div>
            </li>
            `;
        });
        const HTMLListContainer = `<ul class="products__list">${HTMLCatalog}</ul>`;

        rootProducts.innerHTML = HTMLListContainer;
    }
}

export default Products;
