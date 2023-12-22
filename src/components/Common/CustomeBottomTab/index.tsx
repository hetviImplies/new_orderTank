//import liraries
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../../assets/colors';
import SvgIcons from '../../../assets/SvgIcons';
import {hp, normalize, wp} from '../../../styles/responsiveScreen';
import {smallFont, tabIcon} from '../../../styles';
import FontText from '../FontText';

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
              {isFocused && <View style={[styles.border, styles.topBorder]} />}
              <SvgIcons.Home height={tabIcon} width={tabIcon} />
              <FontText
                name={'lexend-regular'}
                size={normalize(10)}
                color={'orange'}
                pTop={wp(1)}
                textAlign={'center'}>
                {route.name}
              </FontText>
              {isFocused && (
                <View style={[styles.border, styles.bottomBorder]} />
              )}
            </View>
          );
        } else if (route.name === 'Supplier') {
          iconName = (
            <View style={styles.icon}>
              {isFocused && <View style={[styles.border, styles.topBorder]} />}
              <SvgIcons.Supplier height={tabIcon} width={tabIcon} />
              <FontText
                name={'lexend-regular'}
                size={normalize(10)}
                color={'orange'}
                pTop={wp(1)}
                textAlign={'center'}>
                {route.name}
              </FontText>
              {isFocused && <View style={[styles.border, styles.bottomBorder]} />}
            </View>
          );
        } else if (route.name === 'Order') {
          iconName = (
            <View style={styles.icon}>
              {isFocused && <View style={[styles.border, styles.topBorder]} />}
              <SvgIcons.Order height={tabIcon} width={tabIcon} />
              <FontText
                name={'lexend-regular'}
                size={normalize(10)}
                color={'orange'}
                pTop={wp(1)}
                textAlign={'center'}>
                {route.name}
              </FontText>
              {isFocused && <View style={[styles.border, styles.bottomBorder]} />}
            </View>
          );
        } else if (route.name === 'Profile') {
          iconName = (
            <View style={styles.icon}>
              {isFocused && <View style={[styles.border, styles.topBorder]} />}
              <SvgIcons.Setting height={tabIcon} width={tabIcon} />
              <FontText
                name={'lexend-regular'}
                size={normalize(10)}
                color={'orange'}
                pTop={wp(1)}
                textAlign={'center'}>
                {route.name}
              </FontText>
              {isFocused && <View style={[styles.border, styles.bottomBorder]} />}
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

        return (
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
    borderTopLeftRadius: normalize(10),
    borderTopRightRadius: normalize(10),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  border: {
    borderColor: colors.orange,
    width: wp(16),
    borderWidth: 2,
    backgroundColor: colors.orange,
    marginVertical:hp(0.8)
  },
  bottomBorder: {
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    bottom:hp(-0.4)
  },
  topBorder: {
    borderBottomLeftRadius: normalize(20),
    borderBottomRightRadius: normalize(20),
    top:hp(-0.4)
  },
  icon: {alignSelf: 'center', alignItems: 'center'},
});

//make this component available to the app
export default CustomeBottomTab;
