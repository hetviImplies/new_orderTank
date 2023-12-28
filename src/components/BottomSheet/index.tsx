//import liraries
import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import colors from '../../assets/colors';
import {hp, wp} from '../../styles/responsiveScreen';
import {CheckPreferenceItem, FontText} from '..';
import SvgIcons from '../../assets/SvgIcons';
import {fontSize, iconSize, tabIcon} from '../../styles';
// create a component
const BottomSheet = (props:any) => {
  const renderComponent = () => {
    const bottomSheetData = props?.data;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {bottomSheetData?.map((item: any, index: number) => {
          return (
            <View key={index}>
              <TouchableOpacity
                onPress={() => {
                  props.itemPress(item);
                }}
                style={styles.modelStateContainer}>
                {/* <FontText
                  name={'regular'}
                  size={fontSize}
                  color={props.selectedItem === item ? 'brown' : 'black2'}>
                  {item}
                </FontText> */}
                {/* {props.selectedItem === item && (
                  <SvgIcons.Check
                    style={{marginTop: wp(1)}}
                    fill={colors.brown}
                    height={iconSize}
                    width={iconSize}
                  />
                )} */}
                <CheckPreferenceItem
                  radio
                  key={index}
                  children={
                    <View style={{flexDirection: 'row'}}>
                      {/* {props.isIcon && (
                        <View style={{marginRight:wp(2)}}>
                          {index === 0 ? (
                            <SvgIcons.Home
                              height={iconSize}
                              width={iconSize}
                            />
                          ) : (
                            <SvgIcons.Company
                              height={tabIcon}
                              width={tabIcon}
                            />
                          )}
                        </View>
                      )} */}
                      <FontText
                        name={'regular'}
                        size={fontSize}
                        color={'black2'}>
                        {item}
                      </FontText>
                    </View>
                  }
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row-reverse',
                    width: '100%',
                  }}
                  listStyle={{paddingVertical: hp(1)}}
                  handleCheck={() => props.itemPress(item)}
                  checked={item === props.selectedItem}
                />
              </TouchableOpacity>
              <View
                style={{
                  width: '100%',
                  borderBottomWidth:
                    index == bottomSheetData?.length - 1 ? 0 : 0.5,
                  borderBottomColor: colors.grey,
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <RBSheet
      height={props.height}
      ref={props.sheetRef}
      customStyles={{wrapper:{backgroundColor: colors.grayOpacity, paddingVertical: wp(4)}}}>
      {renderComponent()}
    </RBSheet>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  modelStateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: wp(3),
  },
});

//make this component available to the app
export default BottomSheet;
