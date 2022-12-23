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
    amount?: number;
}

type cartAmountType = {
    amount: number;
};

type cartItemType = IProductItem & cartAmountType;
type cartItems = [cartItemType];

export { IProductItem, cartItems, cartItemType };
