import {configureStore} from '@reduxjs/toolkit';
import {authApi} from '../../api/auth';
import {categoryApi} from '../../api/category';
import {productApi} from '../../api/product';
import {profileApi} from '../../api/profile';
import {brandApi} from '../../api/brand';
import {cartApi} from '../../api/cart';
import {orderApi} from '../../api/order';
import authSlice from '../slices/authSlice';
import categorySlice from '../slices/categorySlice';
import productSlice from '../slices/productSlice';
import cartSlice from '../slices/cartSlice';
import {addressApi} from '../../api/address';
import {notificationApi} from '../../api/notification';
import {wishlistApi} from '../../api/wishlist';
import {paymentApi} from '../../api/payemnt';
import { companyApi } from '../../api/company';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    category: categorySlice,
    product: productSlice,
    cart: cartSlice,
    [authApi.reducerPath]: authApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(companyApi.middleware)
      .concat(categoryApi.middleware)
      .concat(productApi.middleware)
      .concat(profileApi.middleware)
      .concat(brandApi.middleware)
      .concat(cartApi.middleware)
      .concat(orderApi.middleware)
      .concat(wishlistApi.middleware)
      .concat(addressApi.middleware)
      .concat(notificationApi.middleware)
      .concat(paymentApi.middleware),
});
// const createActions = (slice: any) =>
//   _.mapValues(
//     slice.actions,
//     actionCreator => payload => store.dispatch(actionCreator(payload)),
//   );
