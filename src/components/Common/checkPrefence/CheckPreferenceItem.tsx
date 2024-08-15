import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Checkbox from './Checkbox';
import {hp, wp} from '../../../styles/responsiveScreen';

const CheckPreferenceItem = (props: any) => {
  return (
    <>
      <View style={{...styles.listItem, ...props.listStyle}}>
        <Checkbox {...props} />
        {/* {props.fovarite && (
          <Pressable hitSlop={6} onPress={props.handleCheckTop}>
            {props.top ? <SvgIcons.FillHeart /> : <SvgIcons.Heart />}
          </Pressable>
        )} */}
      </View>
      {/* <View style={{...styles.newBorder, ...props.borderStyle}} /> */}
    </>
  );
};

export default CheckPreferenceItem;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: wp(0.2),
    // paddingHorizontal: wp(3),
  },
  newBorder: {
    borderWidth: 0.5,
    width: '100%',
    alignSelf: 'center',
    borderColor: 'hsl(0, 0%, 80%)',
  },
});
