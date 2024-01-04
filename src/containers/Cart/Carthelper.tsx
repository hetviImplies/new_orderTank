import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'MyCart';

// Function to retrieve cart items from AsyncStorage
const getCartItems = async () => {
  try {
    const cartItems = await AsyncStorage.getItem(CART_KEY);
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

// Function to update cart items in AsyncStorage
const updateCartItems = async (cartItems: any) => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error updating cart items:', error);
  }
};

// Function to add an item to the cart in AsyncStorage
const addToCart = async (item: any) => {
  try {
    let updatedCartItems = await getCartItems();
    console.log('updatedCartItems', updatedCartItems);

    // Check if the item already exists in the cart
    const existingItemIndex = updatedCartItems.findIndex(
      (cartItem: any) => cartItem._id === item._id,
    );

    console.log('existingItemIndex', existingItemIndex);

    if (existingItemIndex !== -1) {
      // If the item exists, increment its quantity
      updatedCartItems[existingItemIndex].quantity += 1;
    } else {
      // If the item is not in the cart, add it with a quantity of 1
      updatedCartItems.push({...item, quantity: 1});
    }

    await updateCartItems(updatedCartItems);
    return updatedCartItems;
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
};

// Function to increment quantity of an item in the cart
const incrementCartItem = async (itemId: any) => {
  try {
    let updatedCartItems = await getCartItems();

    const itemToIncrement = updatedCartItems.find(
      (cartItem: any) => cartItem._id === itemId,
    );

    if (itemToIncrement) {
      itemToIncrement.quantity += 1;
      await updateCartItems(updatedCartItems);
      return updatedCartItems;
    }
  } catch (error) {
    console.error('Error incrementing item quantity:', error);
  }
};

// Function to decrement quantity of an item in the cart
const decrementCartItem = async (itemId: any) => {
  try {
    let updatedCartItems = await getCartItems();

    const itemToDecrement = updatedCartItems.find(
      (cartItem: any) => cartItem._id === itemId,
    );

    if (itemToDecrement && itemToDecrement.quantity > 1) {
      itemToDecrement.quantity -= 1;
      await updateCartItems(updatedCartItems);
      return updatedCartItems;
    } else if (itemToDecrement && itemToDecrement.quantity === 1) {
      updatedCartItems = updatedCartItems.filter(
        (cartItem: any) => cartItem._id !== itemId,
      );
      await updateCartItems(updatedCartItems);
      return updatedCartItems;
    }
  } catch (error) {
    console.error('Error decrementing item quantity:', error);
  }
};

const removeCartItem = async (itemId: any) => {
  try {
    let updatedCartItems = await getCartItems();

    updatedCartItems = updatedCartItems.filter(
      (cartItem: any) => cartItem._id !== itemId,
    );

    await updateCartItems(updatedCartItems);
    return updatedCartItems;
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
};

const calculateTotalPrice = async () => {
  try {
    const cartItems = await getCartItems();
    const totalPrice = cartItems.reduce(
      (total: any, item: any) => total + item.quantity * item.price,
      0,
    );
    return totalPrice;
  } catch (error) {
    console.error('Error calculating total price:', error);
    return 0;
  }
};

export {
  addToCart,
  incrementCartItem,
  decrementCartItem,
  getCartItems,
  removeCartItem,
  updateCartItems,
  calculateTotalPrice,
};
