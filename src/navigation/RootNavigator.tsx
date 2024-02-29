import React from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../containers/Home/HomeScreen';
import LoginScreen from '../containers/Login/LoginScreen';
import SignUpScreen from '../containers/SignUp/SignUpScreen';
import CartListScreen from '../containers/CartList/CartListScreen';
import CartScreen from '../containers/Cart/CartScreen';
import ProfileScreen from '../containers/Profile/ProfileScreen';
import CustomeBottomTab from '../components/Common/CustomeBottomTab';
import ProductDetailScreen from '../containers/ProductDetail/ProductDetailScreen';
import NotificationScreen from '../containers/Notification/NotificationScreen';
import AddressScreen from '../containers/Address/AddressScreen';
import AddAddressScreen from '../containers/AddAddress/AddAddressScreen';
import OrderPlacedScreen from '../containers/OrderPlaced/OrderPlacedScreen';
import SplashScreen from '../containers/Splash/SplashScreen';
import SupplierScreen from '../containers/Supplier/SupplierScreen';
import OrderScreen from '../containers/Order/OrderScreen';
import PendingRequestScreen from '../containers/PendingRequest/PendingRequestScreen';
import ProductListingScreen from '../containers/ProductListing/ProductListingScreen';
import PersonalDetailScreen from '../containers/PersonalDetail/PersonalDetailScreen';
import CompanyDetailScreen from '../containers/CompanyDetail/CompanyDetailScreen';
import SecureCheckoutScreen from '../containers/SecureCheckout/SecureCheckoutScreen';
import ForgotPasswordScreen from '../containers/ForgotPassword/ForgotPasswordScreen';
import {RootScreens, RootStackParamList} from '../types/type';
import {useGetCurrentUserQuery} from '../api/auth';
import {setCurrentUser} from '../redux/slices/authSlice';
import {hp, isIOS, normalize, wp} from '../styles/responsiveScreen';
import colors from '../assets/colors';

export const navigationRef: React.RefObject<any> = React.createRef();

export function navigate(name: any, params?: any) {
  navigationRef.current?.navigate(name, params);
}

const RootStack = createStackNavigator<RootStackParamList>();
const TabStack = createBottomTabNavigator<RootStackParamList>();

function TabNavigator({route}: any) {
  const role = route?.params && route?.params?.role;
  return (
    <TabStack.Navigator
      initialRouteName={RootScreens.Home}
      tabBar={(props: any) => <CustomeBottomTab role={role} {...props} />}
      screenOptions={{headerShown: true}}>
      <TabStack.Screen
        name={RootScreens.Home}
        component={HomeScreen}
        options={{
          title: 'Welcome to OrderTank',
          headerTitleAlign: 'left',
          headerStyle: {height: isIOS ? hp(13) : hp(7)},
          headerTitleStyle: styles.title,
        }}
      />
      <TabStack.Screen
        name={RootScreens.Supplier}
        component={SupplierScreen}
        options={{
          title: 'Supplier',
          headerTitleAlign: 'left',
          headerTitleStyle: styles.title,
        }}
      />
      <TabStack.Screen
        name={RootScreens.Order}
        component={OrderScreen}
        options={{
          title: 'Order',
          headerTitleAlign: 'left',
          headerTitleStyle: styles.title,
        }}
      />
      <TabStack.Screen
        name={RootScreens.Profile}
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          headerTitleAlign: 'left',
          headerTitleStyle: styles.title,
        }}
      />
    </TabStack.Navigator>
  );
}

const RootNavigator = () => {
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (
      ((userInfo && Object.keys(userInfo).length < 0) ||
        !userInfo ||
        userInfo == null) &&
      data?.result
    ) {
      dispatch(setCurrentUser(data?.result));
    }
  }, [data, isFetching]);

  return (
    <RootStack.Navigator
      initialRouteName={RootScreens.Splash}
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}>
      <RootStack.Screen
        name={RootScreens.Splash}
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={RootScreens.Login}
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={RootScreens.SignUp}
        component={SignUpScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={RootScreens.ForgotPass}
        component={ForgotPasswordScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={RootScreens.DashBoard}
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={RootScreens.PendingRequest}
        component={PendingRequestScreen}
        options={{title: 'Pending Request', headerTitleStyle: styles.title}}
      />
      <RootStack.Screen
        name={RootScreens.ProductListing}
        component={ProductListingScreen}
        options={({route}: any) => ({
          title: route.params.company,
          headerTitleStyle: styles.title1,
        })}
      />
      <RootStack.Screen
        name={RootScreens.PersonalDetail}
        component={PersonalDetailScreen}
        options={{title: 'Personal Detail', headerTitleStyle: styles.title}}
      />
      <RootStack.Screen
        name={RootScreens.CompanyDetail}
        component={CompanyDetailScreen}
        options={({route}: any) => ({
          title: route.params.name,
          gestureEnabled: route.params.name === 'Profile' ? true : false,
          headerTitleStyle: styles.title,
          headerTitleAlign: 'center',
        })}
      />
      <RootStack.Screen
        name={RootScreens.Cart}
        component={CartScreen}
        options={{title: 'Selected Items', headerTitleStyle: styles.title}}
      />
      <RootStack.Screen
        name={RootScreens.CartList}
        component={CartListScreen}
      />
      <RootStack.Screen
        name={RootScreens.SecureCheckout}
        component={SecureCheckoutScreen}
        options={({route}: any) => ({
          title: route.params.name,
          headerBackTitleVisible: false,
          headerTitleStyle: styles.title,
        })}
      />
      <RootStack.Screen
        name={RootScreens.ProductDetail}
        component={ProductDetailScreen}
        options={({route}: any) => ({
          title: route.params.name,
          headerBackTitleVisible: false,
          headerTitleStyle: styles.title,
        })}
      />
      <RootStack.Screen
        name={RootScreens.Notification}
        component={NotificationScreen}
        options={{headerTitleStyle: styles.title}}
      />
      <RootStack.Screen
        name={RootScreens.Address}
        component={AddressScreen}
        options={{title: 'My Address', headerTitleStyle: styles.title}}
      />
      <RootStack.Screen
        name={RootScreens.AddAddress}
        component={AddAddressScreen}
        options={({route}: any) => ({
          title: route.params.name,
          headerTitleStyle: styles.title,
        })}
      />
      <RootStack.Screen
        name={RootScreens.OrderPlaced}
        component={OrderPlacedScreen}
        options={{headerShown: false}}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  title: {
    color: colors.black2,
    fontSize: normalize(18),
    fontFamily: 'Lexend-Medium',
  },
  title1: {
    width: wp(60),
    color: colors.black2,
    fontSize: normalize(18),
    fontFamily: 'Lexend-Medium',
  },
});
