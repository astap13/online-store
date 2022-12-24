interface IProductItem {
    [key: string]: number | string | string[] | undefined;
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

interface IRoutes {
    [key: string]: string;
}
declare global {
    interface Window {
        route: (event: Event) => void;
    }
}
export { IProductItem, cartItems, cartItemType, IRoutes };
