import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors, SvgIcons} from '../../../assets';
import { hp, wp } from '../../../styles/responsiveScreen';
import { mediumLarge1Font, smallFont } from '../../../styles';
import FontText from '../FontText';

const CountModule = ({count,title,func}) => {
  return (
    <View style={{marginTop:"4%"}}>
      <View
        style={styles.container}>
        <FontText
          name={'mont-semibold'}
          size={mediumLarge1Font}
          style={{maxWidth:wp(30)}}
          color={'black2'}>
          {count}
        </FontText>
        <FontText
          style={{marginTop: 4,maxWidth:wp(30)}}
          name={'mont-medium'}
          size={smallFont}
          color={'darkGray'}>
          {title}
        </FontText>
      </View>
      <TouchableOpacity onPress={func} style={{position: 'absolute', left: wp(36), top: hp(0.8)}}>
        <SvgIcons.Next />
      </TouchableOpacity>
    </View>
  );
};

export default CountModule;

const styles = StyleSheet.create({
    container :{
        width: wp(44),
        borderWidth: 1,
        borderRadius: 15,
        borderColor: colors.gray6,
        justifyContent: 'center',
        padding: '4%',
        paddingLeft:"6%"
      }
});
