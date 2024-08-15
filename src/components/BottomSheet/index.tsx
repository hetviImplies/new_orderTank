/* eslint-disable import/no-cycle */
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {colors, fonts, SvgIcons} from '../../assets';
import {FontText, Input, Button} from '..';
import commonStyle, {fontSize, tabIcon} from '../../styles';

const BottomSheet = (props: any) => {
  const {
    style,
    refName,
    isStaticContent,
    content,
    data,
    onPressCloseModal,
    title,
    modalHeight,
    selectedIndex,
    onPress,
    searcheble,
    multiple,
    renderdata,
    onPressResetbtn,
    isReset,
  } = props;

  useFocusEffect(
    React.useCallback(() => {
      setListData(data);
    }, [data]),
  );

  const [listData, setListData] = useState(data);
  const [finalData, setFinaldata] = useState('');

  const dataRender = () => {
    if (finalData === '') {
      return listData; // Return the original data when no search input
    }
    let listMappingKeyword: any = [];
    renderdata === undefined
      ? listData?.map((item: any) => {
          if (
            item?.label?.toUpperCase()?.includes(finalData?.toUpperCase()) ||
            item?.name?.toUpperCase()?.includes(finalData?.toUpperCase())
          ) {
            listMappingKeyword.push(item);
          }
        })
      : data?.map((item: any) => {
          if (item?.name.toLowerCase().includes(finalData?.toLowerCase())) {
            listMappingKeyword.push(item);
          }
        });

    return listMappingKeyword;
  };

  const renderContent = () => [
    <View style={[styles.container, style]}>
      <View style={styles.itemTitleView}>
        <FontText
          name={'mont-medium'}
          size={fontSize}
          color={'black'}
          textAlign={'left'}>
          {title}
        </FontText>
        {isReset && (
          <Button
            onPress={onPressResetbtn}
            bgColor={'white'}
            style={styles.fiterButton}
            buttonHeight={wp(8)}>
            <FontText
              name={'mont-medium'}
              size={normalize(12)}
              color={'black2'}>
              {multiple ? 'Done' : 'Reset'}
            </FontText>
          </Button>
        )}
        <TouchableOpacity
          style={styles.modalBtn}
          onPress={() => {
            setFinaldata('');
            onPressCloseModal();
          }}>
          <SvgIcons.Close height={tabIcon} width={tabIcon} />
        </TouchableOpacity>
      </View>
      {searcheble && (
        <View style={[commonStyle.paddingH4, {marginBottom: hp(2)}]}>
          <Input
            onChangeText={(text: any) => setFinaldata(text)}
            blurOnSubmit
            autoCapitalize="none"
            placeholder={'Search'}
            placeholderTextColor={'placeholder'}
            inputStyle={[styles.inputText]}
            color={'black'}
            returnKeyType={'done'}
            style={[styles.input]}
            children={
              <View
                style={{
                  ...commonStyle.abs,
                  left: wp(5),
                }}>
                <SvgIcons.Search width={wp(4)} height={wp(4)} />
              </View>
            }
          />
        </View>
      )}

      {data.length === 0 ? (
        <View style={{justifyContent: 'center', height: hp(35)}}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <FlatList
          keyExtractor={(item, index) => index?.toString()}
          data={finalData !== '' ? dataRender() : data}
          style={{flex: 1, height: hp(35), bottom: hp(1)}}
          contentContainerStyle={{flexGrow: 1, paddingBottom: wp(5)}}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={[commonStyle.flex, commonStyle.colC]}>
              <FontText
                size={normalize(14)}
                color={'orange'}
                name="mont-medium">
                {'No Data found.'}
              </FontText>
            </View>
          }
          renderItem={({item, index}) => {
            const value = item.value;
            return (
              <View key={index?.toString()}>
                {multiple ? (
                  <Pressable
                    onPress={() => {
                      onPress(item, index);
                      setFinaldata('');
                    }}
                    style={styles.itemContainer}>
                    <FontText
                      size={normalize(14)}
                      name={'mont-medium'}
                      color={'black2'}>
                      {item?.name}
                    </FontText>
                    <View style={styles.boxcontainer}>
                      {renderdata.some((i: any) => i.id === item.id) && (
                        <SvgIcons.FillBox height={hp(2)} width={wp(3)} />
                      )}
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      onPress(item, index);
                      setFinaldata('');
                    }}
                    style={styles.itemContainer}>
                    <FontText
                      size={normalize(14)}
                      name={'mont-medium'}
                      color={'black2'}>
                      {item?.label ? item?.label : item?.name}
                      {item.name !== undefined ? ` - ${item?.name}` : ''}
                    </FontText>
                    <View style={styles.circle}>
                      {selectedIndex === value && (
                        <View style={styles.fillCircle} />
                      )}
                    </View>
                  </Pressable>
                )}
              </View>
            );
          }}
        />
      )}
    </View>,
  ];

  return (
    <RBSheet
      ref={refName}
      height={modalHeight}
      closeOnPressMask
      closeOnPressBack
      closeOnDragDown
      onClose={() => setFinaldata('')}
      customStyles={{
        container: styles.modalStyle,
      }}
      dragFromTopOnly>
      {isStaticContent ? content : renderContent()}
    </RBSheet>
  );
};

BottomSheet.defaultProps = {
  height: hp(42),
  withHandle: false,
  withReactModal: false,
  autoClose: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  itemTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(6),
    alignItems: 'center',
    marginBottom: hp(1),
  },
  modalStyle: {
    borderTopLeftRadius: normalize(12),
    borderTopRightRadius: normalize(12),
  },
  itemContainer: {
    paddingVertical: wp(2),
    paddingHorizontal: wp(7),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circle: {
    height: wp(4.5),
    width: wp(4.5),
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillCircle: {
    height: wp(3),
    width: wp(3),
    borderRadius: wp(4),
    backgroundColor: colors.orange,
  },
  modalBtn: {
    height: hp(4),
    width: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: wp(0.5),
  },
  inputText: {
    borderRadius: normalize(10),
    paddingLeft: wp(10),
    color: colors.black2,
    fontSize: normalize(12),
    fontFamily: fonts['mont-medium'],
    backgroundColor: colors.white2,
    height: hp(6.5)

  },
  input: {
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(6.5),
    paddingHorizontal: wp(2)

  },
  fiterButton: {
    marginHorizontal: wp(4),
    borderWidth: wp(0.2),
    borderColor: colors.gray,
    left: wp(18),
  },
  boxcontainer: {
    height: wp(4.5),
    width: wp(4.5),
    borderRadius: wp(1),
    borderWidth: 1,
    borderColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomSheet;
