import {
  FlatList,
  Image,
  Keyboard,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {
  NavigationBar,
  FontText,
  Input,
  Loader,
  Popup,
  Button,
  TabBar_,
  Modal,
  PendingSuppliersComponent,
} from '../../components';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import {colors, SvgIcons, Images, fonts} from '../../assets';
import utils from '../../helper/utils';
import {
  useCompanyRequestMutation,
  useGetSupplierQuery,
} from '../../api/companyRelation';
import {TabView, SceneMap,TabBar} from 'react-native-tab-view';
import { getCartItems } from '../Cart/Carthelper';
const SupplierScreen = ({navigation,route}: any) => {
  // const {
  //   data: supplierList,
  //   isFetching: isProcessing,
  //   refetch,
  // } = useGetSupplierQuery(
  //   // {search: searchText, status: 'accepted'},
  //   {status: 'accepted'},
  //   {
  //     refetchOnMountOrArgChange: true,
  //   },
  // );

  const {
    data: PendingsupplierList,
    isFetching: isPendingProcessing,
    refetch: reqRefetch,
  } = useGetSupplierQuery(
    {isRequested: true, sellerLists: true},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    data: supplierList,
    isFetching: isProcessing,
    refetch,
  } = useGetSupplierQuery(
    // {isAccepted: true, sellerLists: true},
    {supplierList: true},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [sendCompanyReq, {isLoading: isProcess}] = useCompanyRequestMutation();

  const [search, setSearch] = useState('');
  // const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [suppplierData, setSupplierData] = useState([]);
  const [pendingSuppplierData, setPendingSupplierData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [cartItems, setCartItems] = useState<any>([]);
  useFocusEffect(
    React.useCallback(() => {
      setSearch('');
      refetch();

    }, [refetch]),
  );



  const onRefreshing = () => {
    setRefreshing(true);
    setSearch('');
    refetch();
    setRefreshing(false);
  };


  React.useLayoutEffect(() => {
    // *******************************  Hetvi ********************************
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.orange,
      },
      headerLeft: () => (
        <View
          style={[
            commonStyle.rowAC,
            {marginLeft: wp(4), flexDirection: 'row'},
          ]}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 7,
              marginRight: wp(4),
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => navigation.navigate(RootScreens.Home)}>
            <SvgIcons.Back_Arrow width={iconSize} height={iconSize} />
          </TouchableOpacity>
          <FontText
            name={'mont-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            Supplier
          </FontText>
        </View>
      ),
      headerRight: () => (
        <View
          style={[
            commonStyle.row,
            {
              marginRight: wp(4),
              width: wp(21),
              justifyContent: 'space-between',
            },
          ]}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => setIsOpen(true)}>
            <SvgIcons.Icon_code width={tabIcon} height={tabIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => navigation.navigate(RootScreens.Cart)}>
            <SvgIcons.Cart width={tabIcon} height={tabIcon} />
            {cartItems?.length ? (
              <View style={commonStyle.cartCountView}>
                <FontText
                  color="orange"
                  name="mont-semibold"
                  size={normalize(10)}
                  textAlign={'center'}>
                  {cartItems?.length}
                </FontText>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      ),
      // headerRight: () => (
      //   <View style={[commonStyle.row, {marginRight: wp(4)}]}>
      //     <TouchableOpacity
      //       style={[{marginRight: wp(5)}]}
      //       onPress={() => navigation.navigate(RootScreens.PendingRequest)}>
      //       <SvgIcons.Timer width={tabIcon} height={tabIcon} />
      //     </TouchableOpacity>
      //     <TouchableOpacity
      //       // style={commonStyle.iconView}
      //       onPress={() => setIsOpen(true)}>
      //       <SvgIcons.Code width={tabIcon} height={tabIcon} />
      //     </TouchableOpacity>
      //   </View>
      // ),
    });
  }, [navigation,cartItems]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCartItems = async () => {
        const items = await getCartItems('MyCart');
        setCartItems(items);
      };
      fetchCartItems();
    }, []),
  );

  useEffect(() => {
    setSupplierData(supplierList?.result?.data);
  }, [isProcessing]);

  useEffect(() => {
    setPendingSupplierData(PendingsupplierList?.result?.data);
  }, [isPendingProcessing]);

  useEffect(() => {
    if (!search) {
      setSupplierData(supplierList?.result?.data);
    } else {
      const data = supplierList?.result?.data.filter((item: any) => {
        return item?.company?.companyName
          .toUpperCase()
          .includes(search.toUpperCase());
      });
      setSupplierData(data);
    }
  }, [search]);

  const _reqRenderItem = ({item, index}: any) => {
    return (
      <PendingSuppliersComponent navigation={navigation} disable={true} item={item}/>
    );
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <PendingSuppliersComponent navigation={navigation} disable={false} item={item}/>
    );
  };

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
  const selectedType = route?.params?.type;
  const flatListRef: any = useRef(null);
  const [selectOrder, setSelectOrder] = useState<any>({});

  useFocusEffect(
    useCallback(() => {
      flatListRef.current.scrollToIndex({animated: true, index: 0});
      if (selectedType !== undefined) {
        setSelectOrder(selectedType);
      } else {
        setSelectOrder({label: 'Suppliers', value: 'Suppliers'});
      }
    }, [selectedType]),
  );

   const ORDERTYPE = [
    {label: 'Suppliers', value: 'Suppliers'},
    {label: 'Pending Requests', value: 'Pending Requests'},
  ];
  const _renderSupplierFunction = () => {
    return (
    <View style={[ {marginTop: hp(2), flex: 1}]}>
      <Input
        value={search}
        onChangeText={(text: any) => setSearch(text.trimStart())}
        onSubmit={(text: any) => Keyboard.dismiss()}
        blurOnSubmit={false}
        autoCapitalize="none"
        placeholder={'Search a seller'}
        placeholderTextColor={'darkGray'}
        fontSize={fontSize}
        inputStyle={styles.inputText}
        color={'black'}
        returnKeyType={'done'}
        style={[styles.input]}
        children={
          <View
            style={{
              ...commonStyle.abs,
              right: wp(6),
            }}>
            <SvgIcons.Search width={iconSize} height={iconSize} />
          </View>
        }
      />
      {suppplierData && suppplierData?.length === 0 ? (
        <View style={[commonStyle.flexJC,commonStyle.paddingH4]}>
          <FontText
            name={'mont-medium'}
            size={mediumFont}
            color={'gray'}
            textAlign={'center'}>
            {'No Supplier are available.'}
          </FontText>
        </View>
      ) : (
        <FlatList
          data={suppplierData}
          renderItem={_renderItem}
          contentContainerStyle={styles.containerContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
          }
        />
      )}
    </View>
    )
    }

  const _renderPendingSupplierFunction = () => (
    <View style={[commonStyle.paddingH4, {marginTop: hp(1), flex: 1}]}>
      {/* <Input
          value={search}
          onChangeText={(text: any) => setSearch(text.trimStart())}
          // onSubmit={(text: any) => setSearchText(text.trimStart())}
          blurOnSubmit
          autoCapitalize="none"
          placeholder={'Search a seller'}
          placeholderTextColor={'darkGray'}
          fontSize={fontSize}
          inputStyle={styles.inputText}
          color={'black'}
          returnKeyType={'done'}
          style={[styles.input]}
          children={
            <View
              style={{
                ...commonStyle.abs,
                right: wp(6),
              }}>
              <SvgIcons.Search width={iconSize} height={iconSize} />
            </View>
          }
        /> */}
      {pendingSuppplierData && pendingSuppplierData?.length === 0 ? (
        <View style={[commonStyle.flexJC,commonStyle.paddingH4,]}>
          <FontText
            name={'mont-medium'}
            size={mediumFont}
            color={'gray'}
            textAlign={'center'}>
            {'No Supplier are available.'}
          </FontText>
        </View>
      ) : (
        <FlatList
          data={pendingSuppplierData}
          renderItem={_reqRenderItem}
          contentContainerStyle={styles.containerContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
          }
        />
      )}
    </View>
  );

  // const renderScene = SceneMap({
  //   first: _renderSupplierFunction,
  //   second: _renderPendingSupplierFunction,
  // });

  // const layout = useWindowDimensions();

  // const [index, setIndex] = React.useState(0);
  // const [routes] = React.useState([
  //   {key: 'first', title: 'Suppliers'},
  //   {key: 'second', title: 'Pending Requests'},
  // ]);


  return (
    <View style={commonStyle.container}>
      {/* <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={props => (
          <TabBar_
            props={props}
            style={{backgroundColor: colors.white, elevation: 0}}
            indicatorStyle={{backgroundColor: colors.orange}}
          />
        )}
      /> */}
       <View>
        <FlatList
        style={{borderWidth:0}}
          horizontal
          ref={flatListRef}
          data={ORDERTYPE}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginHorizontal: wp(-1), paddingTop: hp(1)}}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectOrder(item);
                  // getorderData(item);
                }}
                key={index}
                activeOpacity={0.7}
                style={styles.talkBubble}>
                <View
                  style={
                    selectOrder?.label === item?.label
                      ? styles.talkBubbleSquare
                      : styles.blankSquare
                  }>
                  <FontText
                    color={
                      selectOrder?.label === item?.label ? 'orange' : 'tabGray'
                    }
                    size={mediumFont}
                    textAlign={'center'}
                    name={'mont-semibold'}>
                    {item?.label}
                  </FontText>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <>
      <View style={[commonStyle.paddingH4, {marginTop: hp(0), flex: 1}]}>
        {
          selectOrder.label==='Suppliers' ? _renderSupplierFunction() : _renderPendingSupplierFunction()
        }
      </View>
        {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2.5)}}
        borderBottomWidth={0}
        leftStyle={{width: '50%'}}
        left={
          <FontText
            name={'lexend-semibold'}
            size={mediumLargeFont}
            color={'black'}
            textAlign={'center'}>
            {'Supplier'}
          </FontText>
        }
        right={
          <View style={[commonStyle.row]}>
            <TouchableOpacity
              style={[commonStyle.iconView, {marginRight: wp(5)}]}
              onPress={() => navigation.navigate(RootScreens.PendingRequest)}>
              <SvgIcons.Timer width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.iconView}
              onPress={() => setIsOpen(true)}>
              <SvgIcons.Code width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
          </View>
        }
      /> */}
      </>
      <Loader loading={isProcessing || isProcess} />

      <Modal
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
    </View>
  );
};

export default SupplierScreen;

const styles = StyleSheet.create({
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
    marginBottom:hp(1)
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    marginBottom: wp(3),
    alignItems: 'center',
    backgroundColor: colors.orange2,
    borderRadius: normalize(10),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.orange,
  },
  logo: {
    width: hp(6.5),
    height: hp(6.5),
    resizeMode: 'cover',
    borderRadius: normalize(5),
    marginRight: wp(3),
    borderWidth: 0.2,
    borderColor: colors.black2,
  },
  dashInput: {
    borderStyle: 'dashed',
    borderWidth: 1,
    backgroundColor: colors.white,
    paddingLeft: wp(5),
  },
  containerContent: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(0.5),
    marginTop: hp(1),
  },
  activeTabText: {
    color: colors.orange,
    fontSize: mediumFont,
    fontFamily: fonts['mont-semibold'],
  },
  tabText: {
    color: colors.tabGray,
    fontSize: mediumFont,
    fontFamily: fonts['mont-semibold'],
  },
  buttonContainer: {
    borderRadius: 5,
    height: hp(3.5),
    width: wp(20),
  },
  talkBubble: {
    backgroundColor: 'transparent',
  },
  talkBubbleSquare: {
    width: wp(50),
    paddingVertical: wp(3),
    backgroundColor: colors.white,
    borderBottomColor:colors.orange,
    borderBottomWidth:2,
  },
  blankSquare: {
    width: wp(50),
    paddingVertical: wp(3),
    borderBottomWidth:2,
    borderBottomColor:colors.tabGray1
  },
});

