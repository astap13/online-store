import './cart.scss';
import { cartItems, IProductItem, cartItemType } from '../../types';
import { capetalize, createElementWithClass, createInput } from '../../functions';
import Checkout from './checkout';
import { app } from '../../main';

class Cart {
    activePromos: { rs: number; epam: number };
    discount: number;
    page: number;
    itemsOnPage: number;
    cart: cartItems;
    checkout: Checkout;
    _cartSum: number;
    _cartNum: number;
    cartByPage: [cartItemType[]?];
    constructor(cart: IProductItem) {
        this.cart = [
            {
                ...cart,
                amount: 1,
            },
        ];
        this.cartByPage = [this.cart];
        this.cart.pop();
        this._cartSum = cart.price;
        this._cartNum = 1;
        this.checkout = new Checkout();
        this.page = 1;
        this.itemsOnPage = 3;
        this.discount = 0;
        this.activePromos = {
            rs: 0,
            epam: 0,
        };
    }
    async renderCart(): Promise<void> {
        if (this.cart.length < 1) {
            const cart = document.querySelector('.cart') as HTMLElement;
            cart.innerHTML = '<h1>Cart is Empty</h1>';
            return;
        }
        this.page = 1;
        this.itemsOnPage = 3;
        const route = '/pages/cart.html';
        const html = await fetch(route).then((data) => data.text());
        const cartElement = document.createElement('div');
        const itemsOnPage = document.querySelector('.cart_items_on_page') as HTMLInputElement;
        const params = app.query.load();
        if (params.has('items')) {
            const itemOnPage = params.get('items') as string;
            if (!isNaN(Number(itemOnPage))) {
                this.itemsOnPage = +itemOnPage;
            }
        }
        if (itemsOnPage) {
            itemsOnPage.value = this.itemsOnPage.toString();
            const cartPage = document.querySelector('.cart_page_number') as HTMLElement;
            if (cartPage && params.has('page')) {
                let page = params.get('page') as string;
                if (!isNaN(Number(page))) {
                    if (+page - 1 > this.cart.length / +this.itemsOnPage) {
                        page = Math.ceil(this.cart.length / +this.itemsOnPage).toString();
                        console.log(this.cart.length / +this.itemsOnPage);
                    }
                    this.page = +page;
                    cartPage.textContent = page;
                } else {
                    cartPage.textContent = this.page.toString();
                }
                console.log(this.page);
            }
            itemsOnPage.addEventListener('input', () => {
                if (+itemsOnPage.value > 10) itemsOnPage.value = '10';
                this.itemsOnPage = +itemsOnPage.value;
                this.renderItems(this.getPage(this.page));
                app.query.add('items', itemsOnPage.value);
            });
            cartElement.innerHTML = '';
            cartElement.innerHTML = html;
            this.renderItems(this.getPage(this.page));
            this.setSumNum();
        }
    }
    renderItems(cart: cartItems) {
        const cartProducts = document.querySelector('.cart_products__body') as HTMLElement;
        cartProducts.innerHTML = '';
        if (cart.length <= 0) return;
        cart.forEach((product, id) => {
            const cartItem = createElementWithClass('div', 'cart_item');
            const cartNumberItem = createElementWithClass('div', 'cart_item_number');
            const cartItemInfo = createElementWithClass('div', 'cart_item_info');
            const cartItemSpecs = createElementWithClass('a', 'cart_item_specs') as HTMLAnchorElement;
            cartItemSpecs.classList.add('link_route');
            cartItemSpecs.href = `/product-details/${product.id}`;
            cartItemSpecs.addEventListener('click', (e) => {
                app.router.route(e);
            });
            const cartAmount = createElementWithClass('div', 'cart_item_amount');
            const cartItemImg = createElementWithClass('img', 'cart_item_img') as HTMLImageElement;
            cartNumberItem.textContent = (this.itemsOnPage * this.page + id - this.itemsOnPage + 1).toString();
            const specs = `<div class="cart_item_title">${capetalize(product.title)}</div>
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
                <div class="cart_item_price">€${product.price.toFixed(2)}</div>`;
            cartItem.append(cartNumberItem, cartItemInfo, cartAmount);
            cartProducts.append(cartItem);
            const plusBtn = createElementWithClass('button', 'cart_plus_btn') as HTMLButtonElement;
            plusBtn.textContent = '+';
            plusBtn.classList.add('btn_mini');
            const itemAmount = createElementWithClass('div', 'cart_item_amount_num');
            itemAmount.textContent = product.amount.toString();
            const minusBtn = createElementWithClass('button', 'cart_minus_btn') as HTMLButtonElement;
            minusBtn.classList.add('btn_mini');
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
    }
    renderSum() {
        const sumBody = document.querySelector('.cart_summary__body') as HTMLElement;
        sumBody.innerHTML = '';
        const numOfProducts = createElementWithClass('div', 'cart_num_products');
        const totalOfProducts = createElementWithClass('div', 'cart_total_products');
        numOfProducts.textContent = `Products: ${this.cartNum}`;
        totalOfProducts.textContent = `Total: ${this.cartSum}`;
        const buyBtn = createElementWithClass('button', 'cart_buy_btn') as HTMLButtonElement;
        const promoInput = createInput('promo_input', 'text', 'Promo(type epam or rs)');
        const promoSpan = createElementWithClass('div', 'promo_span') as HTMLElement;
        const promoApplied = createElementWithClass('div', 'promo_applied') as HTMLElement;
        promoApplied.classList.add('hide');
        promoApplied.innerHTML = `Applied code <div class="epam_promo hide">EPAM Systems 10% <button class="btn_mini remove_promo_btn remove_epam">-</button></div>
            <div class="rs_promo hide">Rolling Scopes School 10% <button class="btn_mini remove_promo_btn remove_rs">-</button></div>`;
        promoSpan.classList.add('hide');
        const promoAdd = createElementWithClass('div', 'promo_add') as HTMLElement;
        if (promoSpan) {
            promoSpan.textContent = `Total: ${this.cartSum * this.discount}`;
        }
        promoInput.addEventListener('input', () => {
            if (promoInput.value.toLowerCase() === 'rs') {
                promoAdd.innerHTML = '<span>Rolling Scopes School - 10%</span> <button class="btn_mini add_promo_btn">+</button>';
            } else if (promoInput.value.toLowerCase() === 'epam') {
                promoAdd.innerHTML = '<span>EPAM Systems - 10% </span><button class="btn_mini add_promo_btn">+</button>';
            } else {
                promoAdd.innerHTML = '';
            }

            promoAdd.lastChild?.addEventListener('click', () => {
                const val = promoInput.value;
                if (val === 'rs') this.activePromos.rs = 10;
                if (val === 'epam') this.activePromos.epam = 10;
                promoInput.value = '';
                promoAdd.innerHTML = '';
                this.renderPromos();
            });
        });
        window.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('remove_rs')) {
                this.activePromos.rs = 0;
                this.renderPromos();
            }
            if (target.classList.contains('remove_epam')) {
                this.activePromos.epam = 0;
                this.renderPromos();
            }
        });
        buyBtn.textContent = 'BUY NOW';
        buyBtn.addEventListener('click', this.checkout.openPopup);
        sumBody.append(numOfProducts, totalOfProducts, promoSpan, promoApplied, promoInput, promoAdd, buyBtn);
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
            totalOfProducts.textContent = `Total: €${this.cartSum.toFixed(2)}`;
        }
        cartItems.textContent = `${this.cartNum}`;
        cartSum.textContent = `€${this.cartSum.toFixed(2)}`;
        this.renderPromos();
    }
    addToCart(item: IProductItem): void {
        const productInCart: cartItemType = {
            ...item,
            amount: 1,
        };
        if (!JSON.stringify(this.cart).includes(item.description)) {
            this.cart.push(productInCart);
        } else if (this.cart.find((el) => el.amount === 0)) {
            const elem = this.cart.find((el) => el.amount === 0);
            if (elem) elem.amount++;
        }
        this.setSumNum();
        this.saveCart();
    }
    increaseAmountItem(item: cartItemType): void {
        this.cart.forEach((el) => {
            if (el.id === item.id) {
                el.amount++;
            }
            if (el.amount > el.stock) el.amount = el.stock;
        });
        this.setSumNum();
        this.saveCart();
    }
    decreaseAmountItem(item: cartItemType): void {
        if (item.amount === 1) {
            this.drop(item);
        } else {
            item.amount--;
        }
        this.setSumNum();
        this.saveCart();
    }
    drop(item: IProductItem) {
        if (this.cart.length <= 1) this.cart.pop();
        for (let i = 0; i < this.cart.length; i++) {
            if (this.cart[i].description === item.description) {
                this.cart.splice(i, 1);
            }
        }
        if (window.location.href.includes('/cart')) {
            if (!(this.cart.length % this.itemsOnPage)) {
                this.page--;
            }
            if (this.page < 1) {
                this.page = 1;
                this.renderCart();
            } else {
                this.renderItems(this.getPage(this.page));
            }
        }
        this.saveCart();
        this.setSumNum();
    }
    saveCart() {
        const cart = JSON.stringify(this.cart);
        const promo = JSON.stringify(this.activePromos);
        localStorage.setItem('cart', cart);
        localStorage.setItem('promo', promo);
    }
    loadCart() {
        this.cart = JSON.parse(localStorage.cart);
        this.activePromos = JSON.parse(localStorage.promo);
    }
    setCartByPages(number: number) {
        this.cartByPage.length = 0;
        let counter = 0;
        this.cartByPage[0] = [];
        this.cart.forEach((item) => {
            if (this.cartByPage[counter]) {
                if (this.cartByPage[counter]?.length === number) {
                    counter++;
                    this.cartByPage[counter] = [];
                }
            }
            this.cartByPage[counter]?.push(item);
        });
        return this.cartByPage;
    }
    getPage(number: number) {
        number--;
        this.setCartByPages(this.itemsOnPage);
        if (!this.cartByPage[number]) {
            this.page--;
            app.query.add('page', this.page.toString());
            const itemsOnPage = document.querySelector('.cart_page_number') as HTMLElement;
            itemsOnPage.textContent = this.page.toString();
            return this.cartByPage[this.cartByPage.length - 1] as cartItems;
        }
        return this.cartByPage[number] as cartItems;
    }
    renderPromos() {
        if (!window.location.href.includes('/cart')) return;
        const promoBlock = document.querySelector('.promo_applied') as HTMLElement;
        const promoSpan = document.querySelector('.promo_span') as HTMLElement;
        const cartTotal = document.querySelector('.cart_total_products') as HTMLElement;
        if (promoBlock) {
            if (Object.values(this.activePromos).includes(10)) {
                promoBlock.classList.remove('hide');
                cartTotal.classList.add('overline');
                const rs = document.querySelector('.rs_promo') as HTMLElement;
                const epam = document.querySelector('.epam_promo') as HTMLElement;
                rs.classList.add('hide');
                epam.classList.add('hide');
                if (this.activePromos.rs === 10) {
                    rs.classList.remove('hide');
                }
                if (this.activePromos.epam === 10) {
                    epam.classList.remove('hide');
                }
                promoSpan.classList.remove('hide');
            } else {
                promoBlock.classList.add('hide');
                promoSpan.classList.add('hide');
                cartTotal.classList.remove('overline');
            }
        }
        if (promoSpan) {
            promoSpan.textContent = `Total: €${this.cartSum * this.discount}`;
        }
        const discountPrice = this.cartSum - ((this.activePromos.epam + this.activePromos.rs) * this.cartSum) / 100;
        promoSpan.textContent = `Total: €${discountPrice.toFixed(2)}`;
    }
    setEventListerners() {
        window.addEventListener('load', () => {
            const itemsOnPage = document.querySelector('.cart_page_number') as HTMLSpanElement;
            const params = app.query.load();
            if (params.has('page') && itemsOnPage) {
                this.page = Number(params.get('page'));
                itemsOnPage.textContent = this.page.toString();
            }
        });
        window.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            if (target.classList.contains('btn_mini')) {
                if (target.textContent === '>') {
                    if (this.page < this.cartByPage.length) {
                        this.page++;
                    } else {
                        this.page = this.cartByPage.length;
                    }
                } else if (target.textContent === '<') {
                    if (this.page > 1) {
                        this.page--;
                    } else if (this.page === 1) {
                        this.page = 1;
                    }
                }
                const itemsOnPage = document.querySelector('.cart_page_number') as HTMLElement;
                itemsOnPage.textContent = this.page.toString();
                app.query.add('page', this.page.toString());
                this.renderItems(this.getPage(this.page));
            }
        });
    }
}

export default Cart;

document.querySelectorAll('.details_btn');
