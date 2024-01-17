import React from 'react';
import {Pressable, View, Text} from 'react-native';
import SvgIcons from '../../../assets/SvgIcons';
import { normalize, wp } from '../../../styles/responsiveScreen';
import commonStyle from '../../../styles'

const Checkbox = (props:any) => {
  return (
    <Pressable
      hitSlop={8}
      onPress={!props.disabled ? props.handleCheck : null}
      style={[
        commonStyle.rowAC,
        // props.disabled ? {opacity: 0.4} : null,
        props.style,
      ]}>
      {props.radio ? (
        props.checked ? (
          <SvgIcons.FillRound />
        ) : (
          <SvgIcons.EmptyRound />
        )
      ) : props.checked ? (
        <SvgIcons.FillBox />
      ) : (
        <SvgIcons.EmptyBox />
      ) && null}

      <View style={{}}>
        {props.children ? (
          <>{props.children}</>
        ) : (
          <Text
            style={{
              fontSize: normalize(16),
              fontFamily: 'Lexend-Medium',
              paddingHorizontal: wp(4),
              color:'black',
            }}>
            {props.title}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default Checkbox;
