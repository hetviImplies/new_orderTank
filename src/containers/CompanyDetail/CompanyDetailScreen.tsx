import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CompanyDetail, Popup} from '../../components';
import {colors, SvgIcons} from '../../assets';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {authReset} from '../../redux/slices/authSlice';
import {wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import {mediumFont} from '../../styles';
import {useLogoutMutation} from '../../api/auth';
import utils from '../../helper/utils';

const CompanyDetailScreen = ({navigation, route}: any) => {
  const from = route.params.from;
  const data = route.params.data;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [logout, {isLoading}] = useLogoutMutation();

  const logoutPress = async () => {
    setIsOpen(false);
    const {data, error}: any = await logout({});
    if(!error && data.statusCode === 200) {
      setLoading(true);
      await dispatch(authReset());
      await AsyncStorage.clear();
      const keysToRemove = ['token', 'MyCart', 'MyAddressList', 'NotiToken'];
      await AsyncStorage.multiRemove(keysToRemove);
      setLoading(false);
      resetNavigateTo(navigation, RootScreens.Login);
    } else {
      utils.showErrorToast(error.data.message);
    }
  };
  

  return (
      <CompanyDetail
        from={from}
        navigation={navigation}
        loading={loading || isLoading}
        loginData={data}
      />
  );
};

export default CompanyDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
