import { createElementWithClass, createInput } from '../../functions';
import { app } from '../../main';

class Checkout {
    check: string;
    constructor() {
        this.check = '1';
    }
    openPopup() {
        const formBlock = document.querySelector('.buy_block') as HTMLElement;
        formBlock.innerHTML = '<span>Personal details</span>';
        const modalBlock = document.querySelector('.modal_buy') as HTMLElement;
        modalBlock.classList.add('modal_buy__active');
        const inputName = createInput('cart_buy_personal_input', 'text', 'Name');
        const inputPhone = createInput('cart_buy_personal_input', 'text', 'Phone number');
        const inputAddress = createInput('cart_buy_personal_input', 'text', 'Address');
        const inputEmail = createInput('cart_buy_personal_input', 'email', 'E-mail');
        const inputSubmit = createElementWithClass('a', 'cart_buy_btn') as HTMLAnchorElement; /*  createInput('cart_buy_btn', 'button') */
        inputSubmit.classList.add('link_route');
        inputSubmit.textContent = 'Comfirm';
        modalBlock.addEventListener('mousedown', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('modal_buy')) {
                app.cart.checkout.closePopup();
            }
        });
        formBlock.append(inputName, inputPhone, inputAddress, inputEmail);
        formBlock.innerHTML += '<span>Credit card details</span>';
        const card = createElementWithClass('div', 'cart_credit_card');
        const logoCard = document.createElement('img');
        logoCard.classList.add('logo_card');
        logoCard.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/CCardBack.svg/1920px-CCardBack.svg.png';
        const inputCardNumber = createInput('cart_buy_card_input', 'text', 'Card number');
        inputCardNumber.classList.add('cart_buy_personal_input', 'card_number');
        inputCardNumber.addEventListener('input', (event) => {
            const events = event as InputEvent;
            const target = event.target as HTMLInputElement;
            if (isNaN(+target.value.slice(-1))) {
                target.value = target.value.slice(0, -1);
            }
            if (!((target.value.length + 1) % 5)) {
                if (!events.data) {
                    target.value = target.value.slice(0, -1);
                    return;
                }
                target.value += ' ';
            }
            if (target.value.length >= 19) {
                target.value = target.value.slice(0, 19);
            }
            switch (target.value[0]) {
                case '5':
                    logoCard.src =
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/772px-Mastercard-logo.svg.png';
                    break;
                case '4':
                    logoCard.src = 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg';
                    break;
                case '3':
                    logoCard.src = 'https://1000logos.net/wp-content/uploads/2016/10/American-Express-Color.png';
                    break;
            }
        });
        const inputCardDate = createInput('cart_buy_card_input', 'text', 'MM/YY');
        inputCardDate.classList.add('cart_buy_personal_input', 'valid_date');
        inputCardDate.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            const events = event as InputEvent;
            if (isNaN(+target.value.slice(-1))) {
                target.value = target.value.slice(0, -1);
            }
            if (target.value.length === 2) {
                if (+target.value > 12) target.value = '12';
                target.value += '/';
                if (!events.data) {
                    target.value = target.value.slice(0, -1);
                    return;
                }
            }
            if (target.value.length === 3 && target.value[2] !== '/') {
                target.value = target.value[0] + target.value[1] + '/' + target.value[2];
            }
            if (target.value.length === 6) {
                target.value = target.value.slice(0, 5);
            }
        });
        const inputCardCvv = createInput('cart_buy_card_input', 'text', 'cvv');
        inputCardCvv.classList.add('cart_buy_personal_input', 'cvv');
        inputCardCvv.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            if (isNaN(+target.value.slice(-1))) {
                target.value = target.value.slice(0, -1);
            }
            if (target.value.length > 3) {
                target.value = target.value.slice(0, 3);
            }
        });
        inputCardNumber.title = 'Please enter your card number';
        inputCardDate.classList.add('card_half_width');
        inputCardDate.title = 'Please enter your date valid';
        inputCardCvv.classList.add('card_half_width');
        inputCardCvv.title = 'Please enter your cvv';
        card.append(inputCardNumber, logoCard, inputCardDate, inputCardCvv);
        formBlock.append(card, inputSubmit);
        inputSubmit.href = '/';
        inputSubmit.addEventListener('click', (event) => {
            event.preventDefault();
            let valid = true;
            document.querySelectorAll('.cart_buy_personal_input').forEach((element) => {
                app.cart.checkout.validate(element as HTMLInputElement);
                element.addEventListener('input', () => {
                    app.cart.checkout.validate(element as HTMLInputElement);
                });
                if (!(element as HTMLInputElement).checkValidity()) {
                    valid = false;
                }
            });
            if (valid) {
                inputSubmit.innerHTML = `
                    <div class="spinner7">
                        <div class="circ2"></div>
                        <div class="circ3"></div>
                        <div class="circ4"></div>
                        <div class="circ5"></div>
                    </div>`;
                setTimeout(() => {
                    const cart = app.cart.cart;
                    cart.splice(0, cart.length);
                    for (let i = 0; i < cart.length; i++) {
                        console.log(cart[i]);
                    }
                    app.router.route(event);
                }, 3000);
            }
        });
    }
    closePopup() {
        const modalBlock = document.querySelector('.modal_buy') as HTMLElement;
        modalBlock.classList.remove('modal_buy__active');
    }
    validate(target: HTMLInputElement) {
        //const target = event.target as HTMLInputElement;
        //const target = targettt as InputEvent
        const value = target.value.split(' ');
        target.required = true;
        switch (target.placeholder) {
            case 'Name':
                if (value.length >= 2) {
                    let valid = true;
                    value.forEach((word, id) => {
                        if (word.length < 3) {
                            valid = false;
                        }
                        if (id === value.length - 1 && !valid) {
                            target.setCustomValidity('Invalid field.');
                        } else if (valid) {
                            target.setCustomValidity('');
                        }
                    });
                } else {
                    target.setCustomValidity('Invalid field.');
                }
                break;
            case 'Phone number':
                target.pattern = '[+][0-9]{9,}';
                break;
            case 'Address':
                if (value.length >= 3) {
                    let valid = true;
                    value.forEach((word, id) => {
                        if (word.length < 5) {
                            valid = false;
                        }
                        if (id === value.length - 1 && !valid) {
                            target.setCustomValidity('Invalid field.');
                        } else if (valid) {
                            target.setCustomValidity('');
                        }
                    });
                } else {
                    target.setCustomValidity('Invalid field.');
                }
                break;
            case 'Card number':
                if (target.value.length < 19) target.setCustomValidity('Invalid field.');
                else target.setCustomValidity('');
                break;
            case 'MM/YY':
                if (target.value.length < 5) target.setCustomValidity('Invalid field.');
                else target.setCustomValidity('');
                break;
            case 'cvv':
                if (target.value.length < 3) target.setCustomValidity('Invalid field.');
                else target.setCustomValidity('');
                break;
        }
    }
}

export default Checkout;
