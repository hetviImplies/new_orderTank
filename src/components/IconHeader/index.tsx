import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import commonStyle, {iconSize, smallFont} from '../../styles';
import {colors, SvgIcons} from '../../assets';
import {FontText} from '..';
import {hp, wp} from '../../styles/responsiveScreen';

const IconHeader = (props: any) => {
  const {label, icon, isEdit, onEditPress} = props;
  return (
    <View style={[commonStyle.rowJB, {marginBottom: wp(1)}]}>
      <View style={commonStyle.rowAC}>
        {icon}
        <FontText
          name={'lexend-regular'}
          size={smallFont}
          color={'orange'}
          pLeft={wp(2)}>
          {label}
        </FontText>
      </View>
      {isEdit && (
        <TouchableOpacity onPress={onEditPress} style={styles.editBtn}>
          <SvgIcons.Edit
            width={iconSize}
            height={iconSize}
            fill={colors.orange}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default IconHeader;

const styles = StyleSheet.create({
  editBtn: {
    alignSelf: 'flex-end',
    marginBottom: hp(-1),
    paddingTop: hp(0.5),
    paddingLeft: wp(5),
    paddingBottom: hp(0.5),
    paddingRight: wp(0.5),
  },
});
