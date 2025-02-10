import {addToCart, getCartDetails, getProductPrice} from "./index"
import axios from "axios";
import {CartItem} from "./interfaces/Cart.interface";





// describe 

describe('shopping cart functions',()=>{
    let cartItems: CartItem[];
    

    // Reset cart before each test
    beforeEach(()=>{
        cartItems = [];
    })


    // Test 1: getProductPrice should return correct price of the product
    // both it and test serve the same purpose and can be used interchangeably
    test('should return correct price of the product',async()=>{
        const price = await getProductPrice('cornflakes');
        expect(price).toBe(4.99);
    })

    // Test 2: getProductPrice should return null for unknown product
    it('should return null for unknown product',async()=>{
        const price = await getProductPrice('chocos');
        expect(price).toBeNull();
    })


    // Test 3: addToCart should add a product to the cart
    it('should add a product to the cart',async()=>{
        await addToCart(cartItems,'cornflakes',2);
        expect(cartItems).toEqual([{name:'cornflakes',price:4.99,quantity:2}]);
    })

     // Test 4: addToCart should update the quantity if the item already exists
  it('should update the quantity of an existing item', async () => {
    await addToCart(cartItems, 'cornflakes', 2);
    await addToCart(cartItems, 'cornflakes', 1);
    expect(cartItems).toEqual([{ name: 'cornflakes', price: 4.99, quantity: 3 }]);
  });


//   Test 5: getCartDetails should return correct cart details
it('should calculate the correct subtotal, tax, and total',async()=>{
    await addToCart(cartItems, 'cornflakes', 2); // 4.99 * 2 = 9.98
    await addToCart(cartItems, 'weetabix', 1); // 7.29 * 1 = 7.29
    await addToCart(cartItems, 'shreddies', 3); // 6.49 * 3 = 19.47
    const cartDetails = await getCartDetails(cartItems);
    expect(cartDetails.subtotal).toBe(36.74);  // 9.98 + 7.29 + 19.47
    expect(cartDetails.tax).toBe(parseFloat((36.74 * 0.125).toFixed(2))); // 12.5% tax
    expect(cartDetails.total).toBe(parseFloat((cartDetails.subtotal + cartDetails.tax).toFixed(2))); // subtotal + tax

  });
})




