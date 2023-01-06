import { IProductItem } from '../../types';
import { capetalize, createElementWithClass } from '../../functions';
import './product-details.scss';
import { app } from '../../main';

class ProductDetails {
    renderItemPage(element: IProductItem): void {
        const node = document.querySelector('.product-details') as HTMLElement;
        (node.querySelector('.product-details__title') as HTMLElement).textContent = capetalize(element.title);
        // Place path to product
        for (let i = 0; i <= 6; i++) {
            const link = document.createElement('a');
            if (i % 2) {
                link.textContent = '>>';
            } else {
                if (i === 0) link.textContent = 'STORE';
                if (i === 2) link.textContent = element.category.toUpperCase();
                if (i === 4) link.textContent = element.brand.toUpperCase();
                if (i === 6) link.textContent = element.title.toUpperCase();
            }
            (node.querySelector('.product-details__route') as HTMLElement).appendChild(link);
        }
        const main = document.querySelector('.main') as HTMLElement;
        main.innerHTML = '';
        main.append(node);
        // Append gallery
        const images = element.images;
        images.forEach((src, id) => {
            const image = createElementWithClass('img', 'product_gallery_image') as HTMLImageElement;
            image.src = src;
            (document.querySelector('.product_images') as HTMLElement).appendChild(image);
            image.addEventListener('click', () => {
                const images = document.querySelectorAll('.product_gallery_image');
                for (let i = 0; i < images.length; i++) {
                    images[i].classList.remove('product_galery_active');
                }
                image.classList.add('product_galery_active');
                (document.querySelector('.image__active') as HTMLImageElement).src = src;
            });
            if (id === 0) {
                (document.querySelector('.image__active') as HTMLImageElement).src = src;
                image.classList.add('product_galery_active');
            }
        });
        // Render specs of product
        type filtered = Omit<IProductItem, 'id' | 'title' | 'thumbnail' | 'images'>;
        function filterObject(obj: IProductItem): filtered {
            return Object.fromEntries(
                Object.entries(obj).filter(([key]) => !['id', 'title', 'thumbnail', 'images'].includes(key))
            ) as filtered;
        }
        const objOfSpec = filterObject(element);
        for (const key in objOfSpec) {
            const spec = createElementWithClass('div', 'product_spec');
            const specHead = createElementWithClass('div', 'spec_head');
            const specMain = createElementWithClass('div', 'spec_main');
            spec.append(specHead);
            if (key === 'discountPercentage') {
                specHead.textContent = capetalize(key.split('P').join(' P'));
            } else {
                specHead.textContent = capetalize(key);
            }
            specMain.textContent = capetalize(element[key]?.toString() as string);
            if (key === 'price') specMain.textContent = `€${element[key]?.toFixed(2)}`;
            spec.append(specMain);
            (document.querySelector('.product-details__specs') as HTMLElement).append(spec);
        }
        // Render buttons to buy product
        const addToCartBtn = createElementWithClass('div', 'product_details__btn');
        if (JSON.stringify(app.cart.cart).includes(element.description)) {
            addToCartBtn.textContent = 'DROP FROM CART';
        } else {
            addToCartBtn.textContent = 'ADD TO CART';
        }
        addToCartBtn.addEventListener('click', () => {
            if (!JSON.stringify(app.cart.cart).includes(element.description)) {
                app.cart.addToCart(element);
                addToCartBtn.textContent = 'DROP FROM CART';
            } else {
                app.cart.drop(element);
                addToCartBtn.textContent = 'ADD TO CART';
            }
        });
        const buyNowBtn = createElementWithClass('a', 'product_details__btn') as HTMLAnchorElement;
        buyNowBtn.href = '/cart';
        buyNowBtn.classList.add('.link_roite');
        buyNowBtn.textContent = 'BUY NOW';
        buyNowBtn.addEventListener('click', (e) => {
            if (!app.cart.cart.find((el) => el.description === element.description)) {
                app.cart.addToCart(element);
            }
            app.router.route(e);
            this.buyNow();
            setTimeout(() => {
                app.cart.checkout.openPopup();
            }, 200);
        });
        (document.querySelector('.product-details__buy') as HTMLElement).append(addToCartBtn, buyNowBtn);
    }
    buyNow(): void {
        console.log('buyNow');
    }
    addRemoveToCart(): void {
        console.log('addRemoveToCart');
    }
}

export default ProductDetails;
