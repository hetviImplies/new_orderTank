import {configureStore} from '@reduxjs/toolkit';
import {authApi} from '../../api/auth';
import {categoryApi} from '../../api/category';
import {productApi} from '../../api/product';
import {profileApi} from '../../api/profile';
import {cartApi} from '../../api/cart';
import {orderApi} from '../../api/order';
import authSlice from '../slices/authSlice';
import {notificationApi} from '../../api/notification';
import {companyApi} from '../../api/company';
import {companyRelationsApi} from '../../api/companyRelation';
import {settingApi} from '../../api/setting';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [companyRelationsApi.reducerPath]: companyRelationsApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [settingApi.reducerPath]: settingApi.reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(companyApi.middleware)
      .concat(companyRelationsApi.middleware)
      .concat(categoryApi.middleware)
      .concat(productApi.middleware)
      .concat(profileApi.middleware)
      .concat(cartApi.middleware)
      .concat(orderApi.middleware)
      .concat(notificationApi.middleware)
      .concat(settingApi.middleware),
});
// const createActions = (slice: any) =>
//   _.mapValues(
//     slice.actions,
//     actionCreator => payload => store.dispatch(actionCreator(payload)),
//   );
