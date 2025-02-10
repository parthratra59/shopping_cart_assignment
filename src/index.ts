import axios from 'axios';
import dotenv from 'dotenv';
import {CartItem,CartState} from './interfaces/Cart.interface';
 
dotenv.config()

const TaxRate = parseFloat(process.env.TAX_RATE || '0.125');
const PRICE_API_BASE_URL = process.env.PRICE_API_BASE_URL ;



const getProductPrice =async(productName: string): Promise<number|null>=>{
    try
    {
        const response = await axios.get(`${PRICE_API_BASE_URL}/${productName}`)
        return response.data.price;
    }
    catch(error){
        console.error(`Error fetching price for ${productName}`,error);
       
        return null;
    }

}


const addToCart = async(cartItem:CartItem[],productName: string, quantity:number):Promise<void>=>{
    try{
        const price = await getProductPrice(productName)
        if(price === null){
            console.error(`Price not found for ${productName}`);
            return;
        }
        const existingItem = cartItem.find((item)=>{
            return item.name === productName;
        })
        if(existingItem){
            existingItem.quantity = existingItem.quantity + quantity;
        }
        else{
            cartItem.push({name:productName, price:price, quantity:quantity});
        }

    }
    catch(error){
        console.error(`Error adding item to cart`,error);
    }

}

const calculateSubTotal = async(cartItem:CartItem[]):Promise<number>=>{
    return parseFloat(cartItem.reduce((subTotal, item) => {
        return subTotal + item.price * item.quantity;
    }, 0).toFixed(2));
}

const calculateTax = async(subTotal:number) :Promise<number>=>{
    return parseFloat((subTotal * TaxRate).toFixed(2));
}

const calculateTotal = async(subTotal:number,tax:number):Promise<number>=>{
    return parseFloat((subTotal + tax).toFixed(2));
}


const getCartDetails = async(cartItem:CartItem[]):Promise<CartState>=>{
   const subtotal = await calculateSubTotal(cartItem);
   const tax = await calculateTax(subtotal);
    const total = await calculateTotal(subtotal,tax);
    return {items: cartItem, subtotal, tax, total};
}


// use IIFE to test the functions

(async ()=>{
    const cartItems: CartItem[] = [];
    await addToCart(cartItems, 'cornflakes', 2);
    await addToCart(cartItems, 'cornflakes', 1);
    await addToCart(cartItems, 'weetabix', 3);
    await addToCart(cartItems, 'shreddies', 1);
    const cartDetails = await getCartDetails(cartItems);
    console.log(cartDetails);
})();

export {addToCart, getCartDetails, getProductPrice}