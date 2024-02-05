import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'MyCart';
const ADDRESS_KEY = 'MyAddressList';

// Function to retrieve cart items from AsyncStorage
const getCartItems = async () => {
  try {
    const cartItems = await AsyncStorage.getItem(CART_KEY);
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.log('Error getting cart items:', error);
    return [];
  }
};

// Function to update cart items in AsyncStorage
const updateCartItems = async (cartItems: any) => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.log('Error updating cart items:', error);
  }
};

// Function to add an item to the cart in AsyncStorage
const addToCart = async (item: any) => {
  try {
    let updatedCartItems = await getCartItems();

    // Check if the item already exists in the cart
    const existingItemIndex = updatedCartItems.findIndex(
      (cartItem: any) => cartItem.id === item.id,
    );

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
    console.log('Error adding item to cart:', error);
  }
};

// Function to increment quantity of an item in the cart
const incrementCartItem = async (itemId: any) => {
  try {
    let updatedCartItems = await getCartItems();

    const itemToIncrement = updatedCartItems.find(
      (cartItem: any) => cartItem.id === itemId,
    );

    if (itemToIncrement) {
      itemToIncrement.quantity += 1;
      await updateCartItems(updatedCartItems);
      return updatedCartItems;
    }
  } catch (error) {
    console.log('Error incrementing item quantity:', error);
  }
};

// Function to decrement quantity of an item in the cart
const decrementCartItem = async (itemId: any, from: string) => {
  try {
    let updatedCartItems = await getCartItems();

    const itemToDecrement = updatedCartItems.find(
      (cartItem: any) => cartItem.id === itemId,
    );

    if (itemToDecrement && itemToDecrement.quantity > 1) {
      itemToDecrement.quantity -= 1;
      await updateCartItems(updatedCartItems);
      return updatedCartItems;
    } else if (itemToDecrement && itemToDecrement.quantity === 1) {
      updatedCartItems =
        from === 'Product'
          ? updatedCartItems.filter((cartItem: any) => cartItem.id !== itemId)
          : updatedCartItems;
      await updateCartItems(updatedCartItems);
      return updatedCartItems;
    }
  } catch (error) {
    console.log('Error decrementing item quantity:', error);
  }
};

const removeCartItem = async (itemId: any) => {
  try {
    let updatedCartItems = await getCartItems();

    updatedCartItems = updatedCartItems.filter(
      (cartItem: any) => cartItem.id !== itemId,
    );

    await updateCartItems(updatedCartItems);
    return updatedCartItems;
  } catch (error) {
    console.log('Error removing item from cart:', error);
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
    console.log('Error calculating total price:', error);
    return 0;
  }
};

const getAddressList = async () => {
  try {
    const addressList = await AsyncStorage.getItem(ADDRESS_KEY);
    return addressList ? JSON.parse(addressList) : [];
  } catch (error) {
    console.log('Error getting address items:', error);
    return [];
  }
};

// Function to update address items in AsyncStorage
const updateAddressList = async (addressList: any) => {
  try {
    await AsyncStorage.setItem(ADDRESS_KEY, JSON.stringify(addressList));
  } catch (error) {
    console.log('Error updating cart items:', error);
  }
};

const mergeArrays = async (apiAddress: any) => {
  let addressData = await getAddressList();
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
