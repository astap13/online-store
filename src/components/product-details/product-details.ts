import { PRODUCTS } from '../../products';
import { IProductItem } from '../../types';
import { capetalize, createElementWithClass } from '../../functions';
import './style.scss';

class RenderDetails {
    element: IProductItem;
    constructor(element: IProductItem) {
        this.element = element;
    }
    renderItemPage(): void {
        const template = document.querySelector('.product-details') as HTMLTemplateElement;
        const node = template.content.cloneNode(true) as HTMLElement;
        (node.querySelector('.product-details__title') as HTMLElement).textContent = capetalize(this.element.title);
        // Place path to product
        for (let i = 0; i <= 6; i++) {
            const link = document.createElement('a');
            if (i % 2) {
                link.textContent = '>>';
            } else {
                if (i === 0) link.textContent = 'STORE';
                if (i === 2) link.textContent = this.element.category.toUpperCase();
                if (i === 4) link.textContent = this.element.brand.toUpperCase();
                if (i === 6) link.textContent = this.element.title.toUpperCase();
            }
            (node.querySelector('.product-details__route') as HTMLElement).appendChild(link);
        }
        const main = document.querySelector('.main') as HTMLElement;
        main.innerHTML = '';
        main.append(node);
        // Append gallery
        const images = this.element.images;
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
        const objOfSpec = filterObject(this.element);
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
            // const specText = objOfSpec[key as keyof filtered].toString();
            // specMain.textContent = capetalize(specText);
            spec.append(specMain);
            (document.querySelector('.product-details__specs') as HTMLElement).append(spec);
        }
        // Render buttons to buy product
        const addToCartBtn = createElementWithClass('div', 'product_details__btn');
        addToCartBtn.textContent = 'ADD TO CART';
        addToCartBtn.addEventListener('click', this.addRemoveToCart);
        const buyNowBtn = createElementWithClass('div', 'product_details__btn');
        buyNowBtn.textContent = 'BUY NOW';
        buyNowBtn.addEventListener('click', this.buyNow);
        (document.querySelector('.product-details__buy') as HTMLElement).append(addToCartBtn, buyNowBtn);
    }
    buyNow(): void {
        console.log('buyNow');
    }
    addRemoveToCart(): void {
        console.log('addRemoveToCart');
    }
}

export default RenderDetails;
