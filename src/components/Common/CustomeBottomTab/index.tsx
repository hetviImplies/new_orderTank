//import liraries
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, SvgIcons} from '../../../assets';
import {hp, normalize, wp} from '../../../styles/responsiveScreen';
import {smallFont, tabIcon} from '../../../styles';
import FontText from '../FontText';
import {FloatingAction} from 'react-native-floating-action';
import {FLOATING_BTN_ACTION} from '../../../helper/data';

// create a component
const CustomeBottomTab = ({state, descriptors, navigation, role}: any) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];

        const isFocused = state.index === index;

        let iconName;
        if (route.name === 'Home') {
          iconName = (
            <View style={styles.icon}>
              <SvgIcons.TabHome
                height={tabIcon}
                width={tabIcon}
                fill={isFocused ? colors.orange : colors.tabGray}
              />
              <FontText
                name={'mont-medium'}
                size={smallFont}
                color={isFocused ? 'orange' : 'tabGray'}
                pTop={wp(2)}
                textAlign={'center'}>
                {route.name}
              </FontText>
            </View>
          );
        } else if (route.name === 'Supplier') {
          iconName = (
            <View style={styles.icon}>
              <SvgIcons.TabSupplier
                height={tabIcon}
                width={tabIcon}
                fill={isFocused ? colors.orange : colors.tabGray}
              />
              <FontText
                name={'mont-medium'}
                size={smallFont}
                color={isFocused ? 'orange' : 'tabGray'}
                pTop={wp(2)}
                textAlign={'center'}>
                {route.name}
              </FontText>
            </View>
          );
        } else if (route.name === 'Order') {
          iconName = (
            <View style={styles.icon}>
              <SvgIcons.TabOrder
                height={tabIcon}
                width={tabIcon}
                fill={isFocused ? colors.orange : colors.tabGray}
              />
              <FontText
                name={'mont-medium'}
                size={smallFont}
                color={isFocused ? 'orange' : 'tabGray'}
                pTop={wp(2)}
                textAlign={'center'}>
                {route.name}
              </FontText>
            </View>
          );
        } else if (route.name === 'Profile') {
          iconName = (
            <View style={styles.icon}>
              <SvgIcons.TabProfile
                height={tabIcon}
                width={tabIcon}
                fill={isFocused ? colors.orange : colors.tabGray}
              />
              <FontText
                name={'mont-medium'}
                size={smallFont}
                color={isFocused ? 'orange' : 'tabGray'}
                pTop={wp(2)}
                textAlign={'center'}>
                {route.name}
              </FontText>
            </View>
          );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        console.log('index////', typeof index, iconName);
        return (
          <>
            <TouchableOpacity
              key={index.toString()}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={{flex: 1}}>
              {iconName}
            </TouchableOpacity>
            {index === 2 ? (
              <FloatingAction
                actions={FLOATING_BTN_ACTION}
                // onPressItem={name => {
                //   if (name === 'bt_supplier') {
                //     onAddCodePress();
                //   } else {
                //     navigation.navigate(RootScreens.Supplier);
                //   }
                // }}
                onPressMain={() => console.log('main...')}
                showBackground={false}
                overlayColor="rgba(52, 52, 52, 0.5)"
                color={colors.orange}
                buttonSize={hp(7)}
                iconHeight={hp(2.2)}
                iconWidth={hp(2.2)}
                position="center"
              />
            ) : null}
          </>
        );
      })}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    paddingVertical: hp(1.5),
  },
  icon: {alignSelf: 'center', alignItems: 'center'},
});

//make this component available to the app
export default CustomeBottomTab;
