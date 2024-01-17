import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {hp, wp} from '../../../styles/responsiveScreen';
import commonStyle, {mediumFont} from '../../../styles';
import FontText from '../FontText';
import colors from '../../../assets/colors';

const RadioButton = (props: any) => {
  const {data, onSelect, userOption} = props;

  const selectHandler = (value: any) => {
    onSelect(value);
  };
  return (
    <View style={[commonStyle.flexA, commonStyle.row]}>
      {data.map((item: any) => {
        return (
          <TouchableOpacity
            style={[commonStyle.rowAC, style.container]}
            onPress={() => selectHandler(item.value)}
            key={item.value}>
            <View
              style={{
                ...style.checkbox,
                borderColor:
                  item.value === userOption ? colors.orange : colors.black2,
              }}>
              {item.value === userOption && <View style={style.dot} />}
            </View>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'gray3'}
              pLeft={wp(1)}
              textAlign={'left'}>
              {item.label}
            </FontText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RadioButton;

const style = StyleSheet.create({
  container: {
    marginRight: wp(5),
    marginBottom: hp(2),
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: colors.orange,
    alignSelf: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 50,
    justifyContent: 'center',
    borderColor: '#000',
    borderWidth: 1,
    marginRight: 10,
  },
});
