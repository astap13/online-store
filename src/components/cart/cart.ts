import './cart.scss';
import { cartItems, IProductItem, cartItemType } from '../../types';
import { createElementWithClass } from '../../functions';

class Cart {
    cart: cartItems;
    _cartSum: number;
    _cartNum: number;
    constructor(cart: IProductItem) {
        this.cart = [
            {
                ...cart,
                amount: 1,
            },
        ];
        this._cartSum = cart.price;
        this._cartNum = 1;
    }
    async renderCart(): Promise<void> {
        console.log('renderCart');
        const route = '/pages/cart.html';
        const html = await fetch(route).then((data) => data.text());
        const cartElement = document.createElement('div');
        cartElement.innerHTML = html;
        this.cart.forEach((product, id) => {
            const cartItem = createElementWithClass('div', 'cart_item');
            const cartNumberItem = createElementWithClass('div', 'cart_item_number');
            const cartItemInfo = createElementWithClass('div', 'cart_item_info');
            const cartItemSpecs = createElementWithClass('div', 'cart_item_specs');
            const cartAmount = createElementWithClass('div', 'cart_item_amount');
            const cartItemImg = createElementWithClass('img', 'cart_item_img') as HTMLImageElement;
            cartNumberItem.textContent = (id + 1).toString();
            const specs = `<div class="cart_item_title">${product.title}</div>
                <p class="cart_item_description">${product.description}</p>
                <span class="cart_item_rating">Rating: ${product.rating}</span>
                <span class="cart_item_discount">Discount: ${product.discountPercentage}%</span>`;
            cartItemSpecs.innerHTML = specs;
            cartItemImg.src = product.thumbnail;
            cartItemInfo.append(cartItemImg, cartItemSpecs);
            cartAmount.innerHTML = `
                <div class="cart_item_stock">Stock: ${product.stock}</div>
                    <div class="cart_item_amount_controller">
                    </div>
                <div class="cart_item_price">€${product.price}</div>`;
            cartItem.append(cartNumberItem, cartItemInfo, cartAmount);
            const cartProducts = document.querySelector('.cart_products__body');
            cartProducts?.append(cartItem);
            const plusBtn = createElementWithClass('button', 'cart_plus_btn') as HTMLButtonElement;
            plusBtn.textContent = '+';
            const itemAmount = createElementWithClass('div', 'cart_item_amount_num');
            itemAmount.textContent = product.amount.toString();
            const minusBtn = createElementWithClass('button', 'cart_minus_btn') as HTMLButtonElement;
            minusBtn.textContent = '-';
            const cartControlles = cartAmount.childNodes[3] as HTMLElement;
            cartControlles?.append(minusBtn, itemAmount, plusBtn);
            minusBtn.addEventListener('click', () => {
                this.decreaseAmountItem(product);
                itemAmount.textContent = this.cart[id].amount.toString();
                this.setSumNum();
            });
            plusBtn.addEventListener('click', () => {
                this.increaseAmountItem(product);
                itemAmount.textContent = this.cart[id].amount.toString();
                this.setSumNum();
            });
        });
        const sumBody = document.querySelector('.cart_summary__body') as HTMLElement;
        const numOfProducts = createElementWithClass('div', 'cart_num_products');
        const totalOfProducts = createElementWithClass('div', 'cart_total_products');
        numOfProducts.textContent = `Products: ${this.cartNum}`;
        totalOfProducts.textContent = `Total: ${this.cartSum}`;
        const buyBtn = createElementWithClass('button', 'cart_buy_btn') as HTMLButtonElement;
        buyBtn.textContent = 'BUY NOW';
        sumBody.append(numOfProducts, totalOfProducts, buyBtn);
        this.setSumNum();
    }
    get cartSum() {
        return this.cart.reduce((acc, item) => (acc += item.price * item.amount), 0);
    }
    get cartNum() {
        return this.cart.reduce((acc, item) => (acc += item.amount), 0);
    }
    setSumNum() {
        const numOfProducts = document.querySelector('.cart_num_products');
        const totalOfProducts = document.querySelector('.cart_total_products');
        const cartItems = document.querySelector('.cart_items') as HTMLElement;
        const cartSum = document.querySelector('.cart_sum') as HTMLElement;
        if (numOfProducts && totalOfProducts) {
            numOfProducts.textContent = `Products: ${this.cartNum}`;
            totalOfProducts.textContent = `Total: €${this.cartSum}`;
        }
        cartItems.textContent = `${this.cartNum.toString()}`;
        cartSum.textContent = `€${this.cartSum.toString()}`;
    }
    addToCart(item: IProductItem): void {
        console.log('addToCart');
        const productInCart: cartItemType = {
            ...item,
            amount: 1,
        };
        this.cart.push(productInCart);
    }
    increaseAmountItem(item: cartItemType): void {
        console.log('increaseAmountItem');
        this.cart.forEach((el) => {
            if (el.id === item.id) {
                el.amount++;
            }
        });
    }
    decreaseAmountItem(item: cartItemType): void {
        console.log('decreaseAmountItem');
        item.amount--;
        if (!item.amount) {
            this.cart.forEach((el, n) => {
                if (el.id === item.id) this.cart.splice(n, 1);
            });
        }
    }
    showCart(): void {
        console.log(this.cart);
        console.log(this.cartNum, this.cartSum);
    }
}

export default Cart;

document.querySelectorAll('.details_btn');
