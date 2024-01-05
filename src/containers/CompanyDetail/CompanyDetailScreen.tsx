import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import CompanyDetail from '../../components/CompanyDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';
import { resetNavigateTo } from '../../helper/navigationHelper';
import { authReset } from '../../redux/slices/authSlice';
import { wp } from '../../styles/responsiveScreen';
import { RootScreens } from '../../types/type';
import { useDispatch } from 'react-redux';

const CompanyDetailScreen = ({navigation, route}: any) => {
  const from = route.params.from;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  React.useLayoutEffect(() => {
    if(from !== 'Profile') {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={logoutPress} style={{marginRight:wp(2)}}>
            <SvgIcons.PowerOff
              width={wp(7)}
              height={wp(7)}
              fill={colors.orange}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  const logoutPress = async () => {
    setTimeout(async () => {
      setLoading(true);
      await AsyncStorage.clear();
      await AsyncStorage.removeItem('token');
      dispatch(authReset());
      setLoading(false);
      resetNavigateTo(navigation, RootScreens.Login);
    }, 500);
  };

  return <CompanyDetail from={from} navigation={navigation} loading={loading}/>;
};

export default CompanyDetailScreen;

const styles = StyleSheet.create({});
