import { PRODUCTS } from '../../products';

class Products {
    render() {
        PRODUCTS.forEach((element) => {
            console.log(element);
        });
    } //Метод render() {} - отображение данных на странице
}

export default Products;
