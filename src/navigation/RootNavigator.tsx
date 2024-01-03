import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../containers/Home/HomeScreen';
import {RootScreens, RootStackParamList} from '../types/type';
import ForgotPasswordScreen from '../containers/ForgotPassword/ForgotPasswordScreen';
import LoginScreen from '../containers/Login/LoginScreen';
import SignUpScreen from '../containers/SignUp/SignUpScreen';
import VerifyOtpScreen from '../containers/VerifyOtp/VerifyOtpScreen';
import ResetPasswordScreen from '../containers/ResetPassword/ResetPasswordScreen';
import CartListScreen from '../containers/CartList/CartListScreen';
import CartScreen from '../containers/Cart/CartScreen';
import ProfileScreen from '../containers/Profile/ProfileScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomeBottomTab from '../components/Common/CustomeBottomTab';
import {useDispatch, useSelector} from 'react-redux';
import {useGetCurrentUserQuery} from '../api/auth';
import ProductDetailScreen from '../containers/ProductDetail/ProductDetailScreen';
import NotificationScreen from '../containers/Notification/NotificationScreen';
import AddressScreen from '../containers/Address/AddressScreen';
import MyOrderScreen from '../containers/MyOrder/MyOrderScreen';
import WishlistScreen from '../containers/Wishlist/WishlistScreen';
import OrderDetailScreen from '../containers/OrderDetail/OrderDetailScreen';
import AddAddressScreen from '../containers/AddAddress/AddAddressScreen';
import SearchScreen from '../containers/Search/SearchScreen';
import OrderPlacedScreen from '../containers/OrderPlaced/OrderPlacedScreen';
import WelcomeScreen from '../containers/Welcome/WelcomeScreen';
import SplashScreen from '../containers/Splash/SplashScreen';
import {setCurrentUser} from '../redux/slices/authSlice';
import SupplierScreen from '../containers/Supplier/SupplierScreen';
import OrderScreen from '../containers/Order/OrderScreen';
import PendingRequestScreen from '../containers/PendingRequest/PendingRequestScreen';
import ProductListingScreen from '../containers/ProductListing/ProductListingScreen';
import PersonalDetailScreen from '../containers/PersonalDetail/PersonalDetailScreen';
import CompanyDetailScreen from '../containers/CompanyDetail/CompanyDetailScreen';
import SecureCheckoutScreen from '../containers/SecureCheckout/SecureCheckoutScreen';

export const navigationRef: React.RefObject<any> = React.createRef();

export function navigate(name: any, params?: any) {
  navigationRef.current?.navigate(name, params);
}

const RootStack = createNativeStackNavigator<RootStackParamList>();
const TabStack = createBottomTabNavigator<RootStackParamList>();

const AuthNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name={RootScreens.Welcome} component={WelcomeScreen} />
      <RootStack.Screen name={RootScreens.Login} component={LoginScreen} />
      <RootStack.Screen name={RootScreens.SignUp} component={SignUpScreen} />
      <RootStack.Screen
        name={RootScreens.ForgotPass}
        component={ForgotPasswordScreen}
      />
      <RootStack.Screen
        name={RootScreens.ResetPass}
        component={ResetPasswordScreen}
      />
      <RootStack.Screen
        name={RootScreens.VerifyOtp}
        component={VerifyOtpScreen}
      />
    </RootStack.Navigator>
  );
};

function TabNavigator({route}: any) {
  const role = route?.params && route?.params?.role;
  return (
    <TabStack.Navigator
      initialRouteName={RootScreens.Home}
      tabBar={(props: any) => <CustomeBottomTab role={role} {...props} />}
      screenOptions={{headerShown: false}}>
      <TabStack.Screen name={RootScreens.Home} component={HomeScreen} />
      <TabStack.Screen name={RootScreens.Supplier} component={SupplierScreen} />
      <TabStack.Screen name={RootScreens.Order} component={OrderScreen} />
      <TabStack.Screen name={RootScreens.Profile} component={ProfileScreen} />
    </TabStack.Navigator>
  );
}

const RootNavigator = () => {
  // const isLoggedIn = useSelector((state: any) => state.auth.authenticated);
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    console.log('RootNavigator', userInfo)
    if (
      (userInfo && Object.keys(userInfo).length === 0) ||
      userInfo === undefined
    ) {
      console.log('data?.result', data?.result)
      dispatch(setCurrentUser(data?.result));
    }
  }, [data, isFetching]);

  return (
    <RootStack.Navigator
      initialRouteName={RootScreens.Splash}
      screenOptions={{headerShown: false}}>
      <RootStack.Screen name={RootScreens.Splash} component={SplashScreen} />
      {/* {isLoggedIn ? (
        <RootStack.Screen name="DashBoard" component={TabNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )} */}
      <RootStack.Screen name={RootScreens.Welcome} component={WelcomeScreen} />
      <RootStack.Screen name={RootScreens.Login} component={LoginScreen} />
      <RootStack.Screen name={RootScreens.SignUp} component={SignUpScreen} />
      <RootStack.Screen
        name={RootScreens.ForgotPass}
        component={ForgotPasswordScreen}
      />
      <RootStack.Screen
        name={RootScreens.ResetPass}
        component={ResetPasswordScreen}
      />
      <RootStack.Screen
        name={RootScreens.VerifyOtp}
        component={VerifyOtpScreen}
      />
      <RootStack.Screen name={RootScreens.DashBoard} component={TabNavigator} />
      <RootStack.Screen name={RootScreens.PendingRequest} component={PendingRequestScreen} />
      <RootStack.Screen name={RootScreens.ProductListing} component={ProductListingScreen} />
      <RootStack.Screen name={RootScreens.PersonalDetail} component={PersonalDetailScreen} />
      <RootStack.Screen name={RootScreens.CompanyDetail} component={CompanyDetailScreen} />
      <RootStack.Screen name={RootScreens.Cart} component={CartScreen} />
      <RootStack.Screen name={RootScreens.CartList} component={CartListScreen} />
      <RootStack.Screen name={RootScreens.SecureCheckout} component={SecureCheckoutScreen} />
      <RootStack.Screen
        name={RootScreens.ProductDetail}
        component={ProductDetailScreen}
      />
      <RootStack.Screen
        name={RootScreens.Notification}
        component={NotificationScreen}
      />
      <RootStack.Screen name={RootScreens.Address} component={AddressScreen} />
      <RootStack.Screen
        name={RootScreens.AddAddress}
        component={AddAddressScreen}
      />
      {/* <RootStack.Screen
        name={RootScreens.OrderSummary}
        component={OrderSummaryScreen}
      /> */}
      <RootStack.Screen name={RootScreens.MyOrder} component={MyOrderScreen} />
      <RootStack.Screen
        name={RootScreens.OrderDetail}
        component={OrderDetailScreen}
      />
      <RootStack.Screen
        name={RootScreens.MyWishlist}
        component={WishlistScreen}
      />
      <RootStack.Screen name={RootScreens.Search} component={SearchScreen} />
      <RootStack.Screen
        name={RootScreens.OrderPlaced}
        component={OrderPlacedScreen}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
