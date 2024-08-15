import React from 'react';
import {Pressable, View, Text} from 'react-native';
import SvgIcons from '../../../assets/SvgIcons';
import {normalize, wp} from '../../../styles/responsiveScreen';
import commonStyle from '../../../styles';
import { fonts } from '../../../assets';

const Checkbox = (props: any) => {
  return (
    <Pressable
      hitSlop={8}
      onPress={!props.disabled ? props.handleCheck : null}
      style={[
        commonStyle.rowAC,
        // props.disabled ? {opacity: 0.4} : null,
        props.listStyle,
      ]}>
      {props.radio ? (
        props.checked ? (
          <SvgIcons.FillRound />
        ) : (
          <SvgIcons.EmptyRound />
        )
      ) : props.checked && props.checkbox ? (
        <SvgIcons.FillBox />
      ) : (
        <SvgIcons.EmptyBox /> && null
      )}

      <View style={{marginLeft:props.radio ? wp(3) : wp(0)}}>
        {props.children ? (
          <>{props.children}</>
        ) : (
          <Text
            style={{
              fontSize: normalize(16),
              fontFamily: fonts['mont-semibold'],
              paddingHorizontal: wp(4),
              color: 'black',
            }}>
            {props.title}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default Checkbox;
