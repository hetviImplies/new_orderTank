//import liraries
import React, { useState } from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, fonts, SvgIcons} from '../../../assets';
import {hp, normalize, wp} from '../../../styles/responsiveScreen';
import {fontSize, mediumFont, smallFont, tabIcon} from '../../../styles';
import FontText from '../FontText';
import {FloatingAction} from 'react-native-floating-action';
import {FLOATING_BTN_ACTION} from '../../../helper/data';
import { RootScreens } from '../../../types/type';
import { Modal } from '../..';
import utils from '../../../helper/utils';
import Input from '../Input';
import { useCompanyRequestMutation } from '../../../api/companyRelation';

// create a component
const CustomeBottomTab = ({state, descriptors, navigation, role}: any) => {

  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [sendCompanyReq, {isLoading: isProcess}] = useCompanyRequestMutation();
  const applyCodePress = async () => {
    setIsOpen(false);
    let params = {
      companyCode: code,
    };
    const {data, error}: any = await sendCompanyReq(params);
    if (!error && data?.statusCode === 201) {
      setCode('');
      utils.showSuccessToast(data.message);
    } else {
      setCode('');
      utils.showErrorToast(
        data?.message ? data?.message : error?.data?.message,
      );
    }
  };

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

        return (
          <>
          {index === 2 ? (
              <FloatingAction
                actions={FLOATING_BTN_ACTION}
                onPressItem={name => {
                  console.log('name: ', name);
                  if (name === 'bt_supplier') {
                    setIsOpen(true)
                  } else {
                    navigation.navigate(RootScreens.Supplier);
                  }
                }}
                onPressMain={() => console.log('main...')}
                showBackground={false}
                color={colors.orange}
                buttonSize={hp(7)}
                iconHeight={hp(2.2)}
                iconWidth={hp(2.2)}
                position="center"
              />
            ) : null}
            <Modal
            from={'Floating'}
        visible={isOpen}
        onBackPress={() => {
          setIsOpen(false);
          setCode('');
        }}
        title={'Supplier Code'}
        titleStyle={{}}
        children={
          <View style={{flex:1,marginBottom:hp(8)}}>
          <Input
            value={code}
            onChangeText={(text: string) => setCode(text.trimStart())}
            placeholder={'Enter Supplier Code'}
            autoCapitalize="none"
            placeholderTextColor={'darkGray'}
            fontSize={fontSize}
            inputStyle={[styles.inputText, ]}
            style={styles.input}
            color={'black'}
            returnKeyType={'next'}
            keyboardType={'numeric'}
            blurOnSubmit
          />
          </View>
        }
        disabled={code !== '' ? false : true}
        rightBtnText={'Apply'}
        rightBtnColor={code !== '' ? 'orange' : 'gray'}
        rightBtnPress={applyCodePress}
        rightBtnStyle={{width: '100%'}}
      />
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


          </>
          
        );
      })}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    zIndex:1000,
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
  inputText: {
    borderRadius: normalize(100),
    paddingLeft: wp(6),
    color: colors.black2,
    fontSize: mediumFont,
    fontFamily: fonts['mont-medium'],
    backgroundColor: colors.white2,
    height: hp(6.5),
    borderColor:colors.lightGray
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6.5),
    marginBottom:hp(1),
  },
});

//make this component available to the app
export default CustomeBottomTab;
