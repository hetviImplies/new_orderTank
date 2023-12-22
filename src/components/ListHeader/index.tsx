import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import commonStyle, {fontSize, smallFont} from '../../styles';
import {FontText} from '..';

const ListHeader = (props: any) => {
  const {leftName, rightName, rightPress} = props;
  return (
    <View style={[commonStyle.rowJB, commonStyle.paddingH4]}>
      <FontText
        color="black2"
        name="lexend-medium"
        size={fontSize}
        textAlign={'left'}>
        {leftName}
      </FontText>
      <TouchableOpacity onPress={rightPress}>
        <FontText
          color="orange"
          name="lexend-regular"
          size={smallFont}
          textAlign={'right'}>
          {rightName}
        </FontText>
      </TouchableOpacity>
    </View>
  );
};

export default ListHeader;

const styles = StyleSheet.create({});
