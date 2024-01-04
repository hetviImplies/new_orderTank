/* eslint-disable import/no-cycle */
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {useFocusEffect} from '@react-navigation/native';
import {FontText, Input, Button} from '..';
import SvgIcons from '../../assets/SvgIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import commonStyle, {fontSize, iconSize, tabIcon} from '../../styles';

const BottomSheet = (props: any) => {
  const {
    style,
    withReactModal,
    withHandle,
    refName,
    onClosed,
    autoClose,
    modalStyle,
    isStaticContent,
    content,
    data,
    closeModal,
    onPressCloseModal,
    title,
    addIcon,
    onPressAddBtn,
    setModalVisible,
    modalHeight,
    selectedIndex,
    onOpen,
    onPress,
    searcheble,
    snapPoint,
    multiple,
    renderdata,
    onPressResetbtn,
    isReset,
    machineIndex,
  } = props;

  useFocusEffect(
    React.useCallback(() => {
      setListData(data);
    }, [data]),
  );

  const [listData, setListData] = useState(data);
  const [finalData, setFinaldata] = useState('');
  const [lable, setLable] = useState([]);

  const dataRender = () => {
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

  // const onPressResetbtn = () => {
  //   setFinaldata('');\
  // };

  const renderContent = () => [
    <View style={[styles.container, style]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: wp(6),
          paddingVertical: hp(2),
          alignItems: 'center',
        }}>
        <FontText
          name={'lexend-regular'}
          size={fontSize}
          color={'black'}
          textAlign={'left'}>
          {title}
        </FontText>
        {isReset && (
          <Button
            onPress={onPressResetbtn}
            bgColor={'white'}
            style={[
              styles.fiterButton,
              {borderWidth: wp(0.2), borderColor: colors.gray},
            ]}
            buttonHeight={wp(8)}>
            <FontText
              name={'lexend-regular'}
              size={normalize(12)}
              color={'black2'}>
              {multiple ? 'Done' : 'Reset'}
            </FontText>
          </Button>
        )}
        {/* {addIcon && (
          <>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={{left: wp(20)}}>
              <SvgIcons.Plus height={hp(4)} width={wp(6)} />
            </TouchableOpacity>
            <Modal visible={props?.modalVisible} transparent={true}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.cardContainersStyle}>
                    <FontText
                      size={normalize(14)}
                      color={'orange'}
                      name="lexend-regular">
                      {'Add'}
                    </FontText>
                    <Input
                      placeholder={'Enter Area'}
                      placeholderTextColor={colors.placeholder}
                      value={props?.addAreaValue}
                      onChangeText={props?.setAddAreaValue}
                      inputStyle={[
                        styles.input,
                        {
                          fontFamily: 'lexend-regular',
                          left: wp(3),
                        },
                      ]}
                      style={[styles.inputContainer, {width: wp(70)}]}
                      blurOnSubmit
                    />
                  </View>
                  <View style={styles.cardContainersStyle}>
                    <Button
                      onPress={() => {
                        setModalVisible(false);
                      }}
                      bgColor={'white'}
                      style={{
                        marginHorizontal: wp(4),
                        marginTop: hp(4),
                        width: wp(30),
                        borderWidth: wp(0.5),
                        borderColor: colors.black2,
                      }}
                      buttonHeight={wp(10)}>
                      <FontText
                        name={'lexend-regular'}
                        size={normalize(12)}
                        color={colors.black2}>
                        {'Cancel'}
                      </FontText>
                    </Button>
                    <Button
                      onPress={onPressAddBtn}
                      bgColor={'black2'}
                      style={{
                        marginHorizontal: wp(4),
                        marginTop: hp(4),
                        width: wp(30),
                      }}
                      buttonHeight={wp(10)}>
                      <FontText
                        name={'lexend-regular'}
                        size={normalize(12)}
                        color={colors.white}>
                        {'Add'}
                      </FontText>
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )} */}
        <TouchableOpacity style={styles.modalBtn} onPress={onPressCloseModal}>
          <SvgIcons.Close height={tabIcon} width={tabIcon} />
        </TouchableOpacity>
      </View>
      {searcheble && (
        // <Input
        //   withLeftIcon
        //   leftIcon={
        //     <TouchableOpacity style={{paddingHorizontal: wp(2)}}>
        //       <SvgIcons.Search height={iconSize} width={iconSize} />
        //     </TouchableOpacity>
        //   }
        //   placeholder={'Search'}
        //   placeholderTextColor={'placeholder'}
        //   onChangeText={(text: any) => setFinaldata(text)}
        //   inputStyle={styles.inputText}
        //   color={'black'}
        //   returnKeyType={'done'}
        //   style={[styles.input]}
        //   blurOnSubmit
        // />
        <View
          style={[
            commonStyle.paddingH4,
            {marginTop: hp(1), marginBottom: hp(3)},
          ]}>
          <Input
            onChangeText={(text: any) => setFinaldata(text)}
            blurOnSubmit
            autoCapitalize="none"
            placeholder={'Search a seller'}
            placeholderTextColor={'placeholder'}
            inputStyle={styles.inputText}
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
          keyExtractor={(item, index) => String(index)}
          data={finalData !== '' ? dataRender() : data}
          style={{flex: 1, height: hp(35), bottom: hp(1)}}
          contentContainerStyle={{flexGrow: 1, paddingBottom: wp(5)}}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <FontText
                size={normalize(14)}
                color={'orange'}
                name="lexend-regular">
                {'No Data found.'}
              </FontText>
            </View>
          }
          renderItem={({item, index}) => {
            const value = index;
            return (
              <View key={index}>
                {multiple ? (
                  <Pressable
                    onPress={() => {
                      onPress(item, index);
                    }}
                    style={styles.itemContainer}>
                    <FontText
                      size={normalize(14)}
                      name={'lexend-regular'}
                      color={'black2'}>
                      {item?.name}
                    </FontText>
                    <View style={styles.boxcontainer}>
                      {renderdata.some((i: any) => i._id === item._id) && (
                        <SvgIcons.FillBox height={hp(2)} width={wp(3)} />
                      )}
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      onPress(item, index);
                    }}
                    style={styles.itemContainer}>
                    <FontText
                      size={normalize(14)}
                      name={'lexend-regular'}
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
      dragFromTopOnly>
      {isStaticContent ? content : renderContent()}
    </RBSheet>
  );
  // return searcheble ? (
  //   <Modalize
  //     snapPoint={snapPoint}
  //     ref={refName}
  //     tapGestureEnabled={false}
  //     scrollViewProps={{
  //       scrollEnabled: false,
  //       keyboardShouldPersistTaps: 'handled',
  //     }}
  //     disableScrollIfPossible
  //     adjustToContentHeight
  //     onOverlayPress={closeModal}
  //     withReactModal={withReactModal}
  //     withHandle={withHandle}
  //     modalStyle={(styles.modalStyle, modalStyle)}
  //     onClosed={onClosed}
  //     onOpen={() => setFinaldata('')}
  //     closeOnOverlayTap={autoClose}
  //     panGestureEnabled={autoClose}>
  //     {isStaticContent ? content : renderContent()}
  //   </Modalize>
  // ) : (
  //   <Modalize
  //     snapPoint={snapPoint}
  //     ref={refName}
  //     tapGestureEnabled={false}
  //     scrollViewProps={{
  //       scrollEnabled: false,
  //     }}
  //     onOverlayPress={closeModal}
  //     withReactModal={withReactModal}
  //     withHandle={withHandle}
  //     modalHeight={modalHeight}
  //     modalStyle={(styles.modalStyle, modalStyle)}
  //     onClosed={onClosed}
  //     onOpen={() => setFinaldata('')}
  //     closeOnOverlayTap={autoClose}
  //     panGestureEnabled={autoClose}>
  //     {isStaticContent ? content : renderContent()}
  //   </Modalize>
  // );
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
  modalStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  itemContainer: {
    paddingVertical: wp(2),
    paddingHorizontal: wp(7),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    width: '100%',
    height: wp(0.5),
    backgroundColor: colors.lightGray,
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
    backgroundColor: colors.lightGray,
    height: hp(4),
    width: hp(4),
    borderRadius: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: colors.white,
    width: wp(90),
    height: hp(25),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: wp(2),
    paddingVertical: hp(3),
    borderRadius: wp(2),
  },
  inputContainer: {
    borderColor: colors.lightGray,
    width: wp(90),
    paddingHorizontal: 0,
    borderRadius: hp(1),
    marginBottom: hp(1),
    padding: hp(1),
  },
  inputText: {
    borderRadius: normalize(10),
    paddingLeft: wp(10),
    color: colors.black2,
    fontSize: normalize(12),
    fontFamily: 'lexend-regular',
    backgroundColor: colors.white2,
    height: hp(6.5),
  },
  input: {
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(6.5),
    paddingHorizontal: wp(2),
  },
  cardContainersStyle: {
    flexDirection: 'row',
    marginHorizontal: wp(2),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fiterButton: {
    marginHorizontal: wp(4),
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
