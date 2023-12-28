import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FontText} from '..';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';
import {iconSize, mediumFont, smallFont} from '../../styles';
import {wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import commonStyle from '../../styles';

const AddressComponent = (props: any) => {
  const {item, onEditPress, from} = props;
  return (
    <View style={styles.childContainer}>
      <View style={[commonStyle.rowJB, {marginBottom: wp(1), width: '100%'}]}>
        <View style={commonStyle.rowAC}>
          {item?.addressName === 'Company' ? (
            <SvgIcons.Employee
              width={iconSize}
              height={iconSize}
              fill={
                from !== RootScreens.SecureCheckout
                  ? colors.orange
                  : colors.black2
              }
            />
          ) : (
            <SvgIcons.Home2
              width={iconSize}
              height={iconSize}
              fill={
                from !== RootScreens.SecureCheckout
                  ? colors.orange
                  : colors.black2
              }
            />
          )}
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            color={from !== RootScreens.SecureCheckout ? 'orange' : 'black2'}
            pLeft={wp(2)}>
            {item?.addressName}
          </FontText>
        </View>
        {from !== RootScreens.SecureCheckout && (
          <TouchableOpacity
            onPress={onEditPress}>
            <SvgIcons.Edit width={iconSize} height={iconSize} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <FontText
          name={'lexend-regular'}
          size={smallFont}
          pLeft={wp(1)}
          pBottom={wp(2)}
          color={'black2'}>
          {item?.addressLine}
          {','}
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            pLeft={wp(1)}
            pBottom={wp(2)}
            color={'black2'}>
            {' '}
            {item?.locality}
            {','}
          </FontText>
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            pLeft={wp(1)}
            pBottom={wp(2)}
            color={'black2'}>
            {' '}
            {item?.city}
            {','}
          </FontText>
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            pLeft={wp(1)}
            pBottom={wp(2)}
            color={'black2'}>
            {' '}
            {item?.state}
            {','}
          </FontText>
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            pLeft={wp(1)}
            pBottom={wp(2)}
            color={'black2'}>
            {' '}
            {item?.country}
            {','}
          </FontText>
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            pLeft={wp(1)}
            pBottom={wp(2)}
            color={'black2'}>
            {' '}
            {item?.pincode}
          </FontText>
        </FontText>
      </View>
    </View>
  );
};

export default AddressComponent;

const styles = StyleSheet.create({
  childContainer: {
    width: '100%',
    paddingLeft: wp(2),
  },
});
