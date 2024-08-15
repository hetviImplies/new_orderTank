import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import commonStyle, {iconSize, mediumFont, smallFont} from '../../styles';
import {colors, SvgIcons} from '../../assets';
import {FontText} from '..';
import {hp, wp} from '../../styles/responsiveScreen';

const IconHeader = (props: any) => {
  const {label, icon, isEdit, onEditPress} = props;
  return (
    <View style={[commonStyle.rowJB, {marginBottom: wp(1),marginTop:wp(3),alignItems:'center'}]}>
      <View style={commonStyle.rowAC}>
        <FontText
          name={'mont-semibold'}
          size={mediumFont}
          color={'black2'}>
          {label}
        </FontText>
      </View>
      {isEdit && (
        <TouchableOpacity onPress={onEditPress} style={styles.editBtn}>
          <SvgIcons.Plus
            width={wp(2.5)}
            height={wp(2.5)}
            fill={colors.white}
          />
           <FontText
          name={'mont-semibold'}
          size={smallFont}
          color={'white'}>
          {'Add'}
        </FontText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default IconHeader;

const styles = StyleSheet.create({
  editBtn: {
    paddingHorizontal: wp(2.5),paddingVertical:wp(1.5),flexDirection:"row",alignItems:"center",backgroundColor:colors.orange,borderRadius:wp(100),justifyContent:'space-between',width:wp(16)
  },
});
