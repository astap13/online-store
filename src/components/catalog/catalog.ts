import { app } from '../../main';
import { IProductItem } from '../../types';

export class Products {
    renderProducts(arrProducts: IProductItem[]) {
        const rootProducts = document.querySelector('.products') as HTMLDivElement;
        let HTMLCatalog = '';
        const params = app.query.load();
        let bigstyle = '';
        let infoClass = '';
        let smallMode = '';
        if (params.get('view') === 'small') {
            bigstyle = 'itemSmall';
            infoClass = 'hide';
            smallMode = 'small_mode_btn';
        }
        arrProducts.forEach((element) => {
            let textBtn = 'Add to cart';
            if (app.cart.cart.find((item) => item.description === element.description)) {
                textBtn = 'Drop from card';
            }
            HTMLCatalog += `
            <li class='products_item ${bigstyle}' style="background-image: url('${element.thumbnail}'), url('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png')">
                <div class='item_title'>${element.title}</div>
                <div class='item_info ${infoClass}'>
                    <p class='item_content'>Category: ${element.category}</p>
                    <p class='item_content'>Brand: ${element.brand}</p>
                    <p class='item_content'>Price: ${element.price}EU</p>
                    <p class='item_content'>Discount: ${element.discountPercentage}</p>
                    <p class='item_content'>Rating: ${element.rating}</p>
                    <p class='item_content'>Stock: ${element.stock}</p>
                </div>
                <div class='button_container ${smallMode}'>
                <button class='btn_product_item product_item_add_to_cart_id_${element.id}'>${textBtn}</button>
                <a class='btn_product_item product_item_details_id_${element.id}' href="/product-details/${element.id}">Details</a></div>
            </li>
            `;
        });
        let HTMLListContainer = `<ul class="products__list">${HTMLCatalog}</ul>`;
        if (arrProducts.length === 0) {
            HTMLListContainer = '<h1 style="text-align:center">Items not found</h1>';
        }
        if (rootProducts) {
            rootProducts.innerHTML = HTMLListContainer;
        }
    }
    renderPreloader() {
        const rootProducts = document.querySelector('.products') as HTMLDivElement;
        rootProducts.innerHTML = `
        <div class="preloader_products">
            <div class="spinner">
                <div class="dot1"></div>
                <div class="dot2"></div>
            </div>
        </div>`;
    }
}

export default Products;
