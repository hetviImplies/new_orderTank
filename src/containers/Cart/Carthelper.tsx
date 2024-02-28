import AsyncStorage from '@react-native-async-storage/async-storage';
import utils from '../../helper/utils';

const CART_KEY = 'MyCart';
const ADDRESS_KEY = 'MyAddressList';

// Function to retrieve cart items from AsyncStorage
const getCartItems = async (cartKey?: any) => {
  try {
    const cartItems = await AsyncStorage.getItem(cartKey ? cartKey : CART_KEY);
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.log('Error getting cart items:', error);
    return [];
  }
};

// Function to update cart items in AsyncStorage
const updateCartItems = async (cartItems: any, cartKey?: any) => {
  try {
    await AsyncStorage.setItem(
      cartKey ? cartKey : CART_KEY,
      JSON.stringify(cartItems),
    );
  } catch (error) {
    console.log('Error updating cart items:', error);
  }
};

// Function to add an item to the cart in AsyncStorage
const addToCart = async (item: any, cartKey?: any) => {
  try {
    let updatedCartItems = await getCartItems(cartKey);
    // Check if the item already exists in the cart
    const existingItemIndex = updatedCartItems.findIndex(
      (cartItem: any) => cartItem.id === item.id,
    );

    if (existingItemIndex !== -1) {
      const newItemQuantity = updatedCartItems[existingItemIndex].quantity + 1;
      if (
        updatedCartItems[existingItemIndex].product.maxOrderQuantity === 0 ||
        newItemQuantity <=
          updatedCartItems[existingItemIndex].product.maxOrderQuantity
      ) {
        updatedCartItems[existingItemIndex].quantity = newItemQuantity;
      } else {
        console.log('Max quantity reached for item:', item.id);
      }
    } else {
      const initialQuantity =
        item.product.minOrderQuantity > 1 ? item.product.minOrderQuantity : 1;
      updatedCartItems.push({...item, quantity: initialQuantity});
    }

    await updateCartItems(updatedCartItems, cartKey);
    return updatedCartItems;
  } catch (error) {
    console.log('Error adding item to cart:', error);
  }
};

// Function to increment quantity of an item in the cartr
const incrementCartItem = async (itemId: any, cartKey?: any) => {
  try {
    let updatedCartItems = await getCartItems(cartKey);
    let itemToIncrement = updatedCartItems.find((cartItem: any) => {
      return Number(cartItem?.id) === itemId;
    });

    if (itemToIncrement) {
      if (itemToIncrement.product.maxOrderQuantity < 1) {
        itemToIncrement.quantity += 1;
        await updateCartItems(updatedCartItems, cartKey);
      } else {
        if (
          itemToIncrement.product.maxOrderQuantity &&
          itemToIncrement.quantity >= itemToIncrement.product.maxOrderQuantity
        ) {
          utils.showWarningToast('Max quantity reached for item');
        } else {
          itemToIncrement.quantity += 1;
          await updateCartItems(updatedCartItems, cartKey);
        }
      }
    }
    return updatedCartItems;
  } catch (error) {
    console.log('Error incrementing item quantity:', error);
  }
};

// Function to decrement quantity of an item in the cart
const decrementCartItem = async (itemId: any, from: string, cartKey?: any) => {
  try {
    let updatedCartItems = await getCartItems(cartKey);

    let itemToDecrement = updatedCartItems.find(
      (cartItem: any) => cartItem.id === itemId,
    );

    if (itemToDecrement) {
      if (
        itemToDecrement.product.minOrderQuantity < 1 &&
        itemToDecrement.quantity === 1
      ) {
        itemToDecrement.quantity = 1;
        await updateCartItems(updatedCartItems, cartKey);
      } else {
        if (
          itemToDecrement.product.minOrderQuantity &&
          itemToDecrement.quantity <= itemToDecrement.product.minOrderQuantity
        ) {
          utils.showWarningToast('Min quantity reached for item');
        } else {
          itemToDecrement.quantity -= 1;
          await updateCartItems(updatedCartItems, cartKey);
        }
      }
    }
    return updatedCartItems;
  } catch (error) {
    console.log('Error decrementing item quantity:', error);
  }
};

const removeCartItem = async (itemId: any, cartKey?: any) => {
  try {
    let updatedCartItems = await getCartItems(cartKey);

    updatedCartItems = updatedCartItems.filter(
      (cartItem: any) => cartItem.id !== itemId,
    );

    await updateCartItems(updatedCartItems, cartKey);
    return updatedCartItems;
  } catch (error) {
    console.log('Error removing item from cart:', error);
  }
};

const calculateTotalPrice = async (cartKey?: any) => {
  try {
    const cartItems = await getCartItems(cartKey);
    const totalPrice = cartItems.reduce(
      (total: any, item: any) => total + item.quantity * item.price,
      0,
    );
    return Number(totalPrice);
  } catch (error) {
    console.log('Error calculating total price:', error);
    return 0;
  }
};

const getAddressList = async (addKey?: any) => {
  try {
    const addressList = await AsyncStorage.getItem(
      addKey ? addKey : ADDRESS_KEY,
    );
    return addressList ? JSON.parse(addressList) : [];
  } catch (error) {
    console.log('Error getting address items:', error);
    return [];
  }
};

// Function to update address items in AsyncStorage
const updateAddressList = async (addressList: any, addKey?: any) => {
  try {
    await AsyncStorage.setItem(
      addKey ? addKey : ADDRESS_KEY,
      JSON.stringify(addressList),
    );
  } catch (error) {
    console.log('Error updating cart items:', error);
  }
};

const mergeArrays = async (apiAddress: any, addKey?: any) => {
  let addressData = await getAddressList(addKey);
  let resultArray: any = [];

  if (apiAddress && addressData.length < 1) {
    resultArray = apiAddress.map((address: any, index: any) => {
      if (index === 0) {
        return {
          ...address,
          deliveryAdd: true,
          billingAdd: true,
        };
      } else {
        return {
          ...address,
          deliveryAdd: false,
          billingAdd: false,
        };
      }
    });
  } else {
    resultArray = apiAddress.map((address: any) => {
      let find: any = addressData.find(
        (addressItem: any) =>
          addressItem?.id.toString() === address?.id.toString(),
      );
      if (!find) {
        return {
          ...address,
          deliveryAdd: false,
          billingAdd: false,
        };
      } else {
        return {
          ...address,
          deliveryAdd: find.deliveryAdd || false,
          billingAdd: find.billingAdd || false,
        };
      }
    });
  }
  return resultArray;
};

export {
  addToCart,
  incrementCartItem,
  decrementCartItem,
  getCartItems,
  removeCartItem,
  updateCartItems,
  calculateTotalPrice,
  getAddressList,
  updateAddressList,
  mergeArrays,
};
