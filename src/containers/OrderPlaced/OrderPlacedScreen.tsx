import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import commonStyle, {
  mediumFont,
  mediumLarge1Font,
  mediumLargeFont,
  smallFont,
} from '../../styles';
import {FontText} from '../../components';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import SvgIcons from '../../assets/SvgIcons';
import {RootScreens} from '../../types/type';
import moment from 'moment';

const OrderPlacedScreen = ({navigation, route}: any) => {
  // const data = route?.params?.item;
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
        name="lexend-regular"
        size={mediumLargeFont}
        pBottom={wp(25)}
        textAlign={'center'}>
        {'Your order has been received'}
      </FontText>
      <SvgIcons.Purchase />
      <FontText
        color="black"
        name="lexend-medium"
        size={mediumLarge1Font}
        pTop={wp(5)}
        pBottom={wp(3)}
        textAlign={'center'}>
        {'Thank you for your purchase !'}
      </FontText>
      <FontText
        color="black2"
        name="lexend-medium"
        size={mediumFont}
        pBottom={wp(20)}
        textAlign={'center'}>
        {`Your order ID is : #9854721`}
      </FontText>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate(RootScreens.DashBoard)}>
        <FontText
          color="orange"
          name="lexend-bold"
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
  cardConatiner: {
    backgroundColor: colors.white,
    padding: wp(4),
    borderRadius: 15,
    width: '100%',
    marginTop: hp(5),
    marginBottom: hp(10),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp(15),
  },
});
