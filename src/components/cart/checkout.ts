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
        const inputEmail = createInput('cart_buy_personal_input', 'text', 'E-mail');
        const inputSubmit = createElementWithClass('a', 'cart_buy_btn') as HTMLAnchorElement; /*  createInput('cart_buy_btn', 'button') */
        //inputSubmit.classList.add('link_route');
        inputSubmit.textContent = 'Comfirm';
        modalBlock.addEventListener('mousedown', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('modal_buy')) {
                app.cart.checkout.closePopup();
            }
        });
        const arr = [inputName, inputPhone, inputAddress, inputEmail];
        arr.forEach((el, id) => {
            const line = createElementWithClass('div', 'input_line');
            const err = createElementWithClass('div', 'input_error');
            err.classList.add(`input_error_${id}`);
            if (id === 0) err.textContent = 'Your name has to be 2 word/3 letters each minimum';
            if (id === 1) err.textContent = 'Enter your phone number in format +123456789';
            if (id === 2) err.textContent = 'Your adress has to be 3 word/5 letters each minimum';
            if (id === 3) err.textContent = 'Enter valid email format without "#%&!*" symbols';
            line.append(el, err);
            formBlock.append(line);
        });
        window.addEventListener('mousover', (event) => {
            if ((event.target as HTMLElement).classList.contains('input_error__active')) {
                (event.target as HTMLElement).classList.remove('input_error__active');
            }
        });
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
        const cardErrors = createElementWithClass('div', 'card_errors');
        cardErrors.innerHTML =
            '<div class="card_number_error hide">Card number error: enter your cart number</div><div class="card_date_error hide">Card date error: enter your cart date</div><div class="card_cvv_error hide">Cvv error: enter your cvv</div>';
        card.append(inputCardNumber, logoCard, inputCardDate, inputCardCvv, cardErrors);
        formBlock.append(card, inputSubmit);
        inputSubmit.href = '/';
        inputSubmit.addEventListener('click', (event) => {
            event.preventDefault();
            const validArr: boolean[] = [];
            document.querySelectorAll('.cart_buy_personal_input').forEach((element) => {
                validArr.push(app.cart.checkout.validate(element as HTMLInputElement));
                if (!validArr[validArr.length - 1]) {
                    element.classList.add('input_invalid');
                }
                element.addEventListener('input', () => {
                    app.cart.checkout.validate(element as HTMLInputElement);
                });
                setTimeout(() => {
                    element.classList.remove('input_invalid');
                }, 350);
            });
            if (!validArr.includes(false)) {
                card.innerHTML = '<h1 style="text-align:center">Your order confirmed!</h1>';
                inputSubmit.innerHTML = `
                    <div class="spinner7">
                        <div class="circ2"></div>
                        <div class="circ3"></div>
                        <div class="circ4"></div>
                        <div class="circ5"></div>
                    </div>`;
                setTimeout(() => {
                    app.cart.cart.splice(0, app.cart.cart.length);
                    for (let i = 0; i < app.cart.cart.length; i++) {
                        app.cart.drop(app.cart.cart[i]);
                    }
                    app.router.route(event);
                    app.cart.saveCart();
                }, 3000);
            }
        });
    }
    closePopup() {
        const modalBlock = document.querySelector('.modal_buy') as HTMLElement;
        modalBlock.classList.remove('modal_buy__active');
    }
    validate(target: HTMLInputElement): boolean {
        target.setCustomValidity('');
        /* const cardErr = document.querySelector('.card_errors') as HTMLElement;
        const cartNumberErr = document.querySelector('.card_number_error');
        const cartDateErr = document.querySelector('.card_date_error');
        const cartCvvErr = document.querySelector('.card_cvv_error'); */
        const errors = document.querySelectorAll('.input_error');
        const valueArr = target.value.split(' ');
        const value = target.value;
        const invalidSymbols = '#%&!*';
        target.required = true;
        let valid = true;
        const arr: string[] = [];
        switch (target.placeholder) {
            case 'Name':
                if (valueArr.length <= 1) valid = false;
                valueArr.forEach((word) => {
                    if (word.length >= 3) {
                        arr.push(word);
                    }
                });
                if (arr.length < 2) {
                    valid = false;
                }
                errors[0].classList.remove('input_error__active');
                if (!valid) {
                    errors[0].classList.add('input_error__active');
                }
                break;
            case 'Phone number':
                target.pattern = '[+][0-9]{9,}';
                valid = target.checkValidity();
                errors[1].classList.remove('input_error__active');
                if (!valid) {
                    errors[1].classList.add('input_error__active');
                }
                break;
            case 'Address':
                if (valueArr.length <= 1) valid = false;
                valueArr.forEach((word) => {
                    if (word.length >= 5) {
                        arr.push(word);
                    }
                });
                if (arr.length < 3) {
                    valid = false;
                }
                errors[2].classList.remove('input_error__active');
                if (!valid) {
                    errors[2].classList.add('input_error__active');
                }
                break;
            case 'E-mail':
                if (
                    valueArr.length > 1 ||
                    value.split('@')[0].length < 3 ||
                    value.split('@')[1].split('.')[0].length < 2 ||
                    value.split('@')[1].split('.')[1].length < 2
                ) {
                    valid = false;
                }
                for (let i = 0; i < invalidSymbols.length; i++) {
                    if (value.includes(invalidSymbols[i])) valid = false;
                }
                errors[3].classList.remove('input_error__active');
                if (!valid) {
                    errors[3].classList.add('input_error__active');
                }
                break;
            case 'Card number':
                if (value.length < 19) valid = false;
                break;
            case 'MM/YY':
                if (target.value.length < 5) valid = false;
                break;
            case 'cvv':
                if (target.value.length < 3) valid = false;
                break;
        }
        if (!valid) {
            target.classList.add('invalid');
        } else {
            target.classList.remove('invalid');
        }
        return valid;
    }
}

export default Checkout;
