import {
  BackHandler,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import commonStyle, {
  mediumFont,
  mediumLarge1Font,
  mediumLargeFont,
} from '../../styles';
import {FontText} from '../../components';
import {hp, wp} from '../../styles/responsiveScreen';
import {SvgIcons} from '../../assets';
import {RootScreens} from '../../types/type';
import {resetNavigateTo} from '../../helper/navigationHelper';

const OrderPlacedScreen = ({navigation, route}: any) => {
  const data = route?.params?.data;

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const backAction = () => {
    resetNavigateTo(navigation, RootScreens.DashBoard);
    return true;
  };

  return (
    <ScrollView
      contentContainerStyle={[
        commonStyle.container,
        commonStyle.colC,
        commonStyle.paddingH4,
        {flex: 1},
      ]}>
      <FontText
        color="black2"
        name="mont-medium"
        size={mediumLargeFont}
        pBottom={wp(25)}
        textAlign={'center'}>
        {'Your order has been received'}
      </FontText>
      <SvgIcons.Purchase />
      <FontText
        color="black"
        name="mont-semibold"
        size={mediumLarge1Font}
        pTop={wp(5)}
        pBottom={wp(3)}
        textAlign={'center'}>
        {'Thank you for your purchase !'}
      </FontText>
      <FontText
        color="black2"
        name="mont-semibold"
        size={mediumFont}
        pBottom={wp(20)}
        textAlign={'center'}>
        {`Your order ID is : ${data?.orderId}`}
      </FontText>
      <TouchableOpacity style={styles.buttonContainer} onPress={backAction}>
        <FontText
          color="orange"
          name="mont-bold"
          size={mediumLargeFont}
          style={{textDecorationLine: 'underline'}}
          textAlign={'center'}>
          {'Back to home'}
        </FontText>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OrderPlacedScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: hp(15),
  },
});
