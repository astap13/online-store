import { cartItems, IProductItem } from '../../types';

class Cart {
    cart: cartItems;
    constructor() {
        this.cart = [];
    }
    renderCart(): void {
        console.log('renderCart');
    }
    addToCart(item: IProductItem): void {
        console.log('addToCart');
        this.cart.push({
            id: item.id,
            amount: 1,
        });
    }
    removeFromCart(item: IProductItem): void {
        console.log('removeFromCart');
        this.cart.forEach((el, ind) => {
            if (el!.id === item.id) {
                this.cart.splice(ind, 1);
            }
        });
    }
    increaseAmountItem(item: IProductItem): void {
        console.log('increaseAmountItem');
        this.cart.forEach((el) => {
            if (el!.id === item.id) {
                el!.amount = el!.amount + 1;
            }
        });
    }
    decreaseAmountItem(item: IProductItem): void {
        console.log('decreaseAmountItem');
        this.cart.forEach((el, ind) => {
            if (el!.id === item.id) {
                el!.amount = el!.amount - 1;
            }
            if (el?.amount === 0) {
                this.cart.splice(ind, 1);
            }
        });
    }
    showCart(): void {
        console.log(this.cart);
    }
}

export default Cart;
