import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FontText} from '..';
import SvgIcons from '../../assets/SvgIcons';
import commonStyle, {iconSize, smallest, smallFont} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import { colors } from '../../assets';

const AddressComponent = (props: any) => {
  const {item, onEditPress, onDeletePress, from, isEditDelete,type} = props;
  return (
    <View
      style={[
        styles.childContainer,
        {width: (type === 'Delivery address' ||  type === 'Billing address') ? '96%' : '100%'},
      ]}>
        {/* <View style={{flexDirection:"row",alignItems:"center",marginTop:wp(2)}}>
        {type==='Home' ? <SvgIcons.new_Home
              width={iconSize}
              height={iconSize}
            /> : <SvgIcons.new_Company
            width={iconSize}
            height={iconSize}
          />}
            <FontText
            name={'mont-semibold'}
            size={smallFont}
            color={'black2'}
            pLeft={wp(2)}
          >
            {item.addressName}
          </FontText>
        </View> */}
      <View style={[commonStyle.rowJB, {marginBottom: wp(1), width: '100%',alignItems:"center"}]}>
        <View style={{flexDirection:"row",alignItems:"center",marginTop:wp(2)}}>
        {(type==='Delivery address' || type==="Home") ? <SvgIcons.new_Home
              width={iconSize}
              height={iconSize}
            /> : <SvgIcons.new_Company
            width={iconSize}
            height={iconSize}
          />}
            <FontText
            name={'mont-semibold'}
            size={smallFont}
            color={'black2'}
            pLeft={wp(2)}
          >
            {item.addressName}
          </FontText>
        </View>
        {isEditDelete && (
          <View style={[commonStyle.rowJC,{marginTop:wp(2)}]}>
            <TouchableOpacity style={{backgroundColor:colors.green1,borderRadius:normalize(100),padding:wp(1.2)}} onPress={onEditPress}>
              <SvgIcons._Edit width={wp(3)} height={wp(3)} />
            </TouchableOpacity>
            {item.isPriority ? null : (
              <TouchableOpacity
                onPress={onDeletePress}
                style={{marginLeft: wp(2),backgroundColor:colors.red4,borderRadius:normalize(100),padding:wp(1.2)}}>
                <SvgIcons.Trash width={wp(3)} height={wp(3)} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View style={{marginBottom: wp(2),marginTop:hp(1.3),borderWidth:0}}>
        <FontText name={'mont-medium'} size={smallest} color={'gray7'}>
          {item?.addressLine}
          {','}
          <FontText
            name={'mont-medium'}
            size={smallest}
            pLeft={wp(1)}
            color={'gray7'}>
            {' '}
            {item?.locality}
            {','}
          </FontText>
          <FontText
            name={'mont-medium'}
            size={smallest}
            pLeft={wp(1)}
            color={'gray7'}>
            {' '}
            {item?.city}
            {','}
          </FontText>
          <FontText
            name={'mont-medium'}
            size={smallest}
            pLeft={wp(1)}
            color={'gray7'}>
            {' '}
            {item?.state}
            {','}
          </FontText>
          {/* <FontText
            name={'lexend-regular'}
            size={smallFont}
            pLeft={wp(1)}
            pBottom={wp(2)}
            color={'black2'}>
            {' '}
            {item?.country}
            {','}
          </FontText> */}
          <FontText
            name={'mont-medium'}
            size={smallest}
            pLeft={wp(1)}
            color={'gray7'}>
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
    paddingHorizontal: wp(3),
    borderWidth:1,borderStyle:"dashed",borderColor:colors.orange,borderRadius:normalize(15),backgroundColor:colors.orange2,marginTop:wp(2)
  },
});
