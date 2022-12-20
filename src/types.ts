interface IProductItem {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}
type cartItemType = {
    id: number;
    amount: number;
};

type cartItems = [cartItemType?];
export { IProductItem, cartItems };
