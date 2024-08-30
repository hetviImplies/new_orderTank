import {Alert, Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors, fonts, SvgIcons} from '../../assets';
import {
  NavigationBar,
  FontText,
  Input,
  Loader,
  Popup,
  FilterModal,
  ProductComponent,
  DrawerComponent,
} from '../../components';
import commonStyle, {tabIcon, fontSize, mediumFont, iconSize, mediumLargeFont, smallFont} from '../../styles';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import {useGetAllProductsQuery} from '../../api/product';
import {
  addToCart,
  decrementCartItem,
  getCartItems,
  incrementCartItem,
  updateCartItems,
} from '../Cart/Carthelper';
import {useGetCategoryQuery} from '../../api/category';
import MenuDrawer from 'react-native-side-drawer';
const ProductListingScreen = ({navigation, route}: any) => {
  const cartType = route?.params?.cartType;
  const id = route?.params?.id;
  const nav = route?.params?.nav;
  const orderDetails = route?.params?.orderDetails;
  const deliveryAdd = route?.params?.deliveryAdd;
  const billingAdd = route?.params?.billingAdd;
  const notes = route?.params?.notes;
  const expectedDate = route?.params?.expectedDate;
  const filterRef: any = useRef(null);
  const searchRef: any = useRef(null);
  const [selectedItems, setSelectedItems] = useState<[]>([]);
  const [search, setSearch] = useState('');
  // const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [productListData, setProductListData] = useState([]);
  const [publishedData, setPublishedData] = useState([]);
  const [cartItems, setCartItems] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<any>({});
  const [isModalVisible, setModalVisible] = useState(false);






  const {data: category, isFetching} = useGetCategoryQuery(
    {company: id},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const {
    data: productList,
    isFetching: isProcessing,
    refetch,
  } = useGetAllProductsQuery(
    {
      company: id,
      category: selectedItems,
      // search: searchText,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useFocusEffect(
    React.useCallback(() => {
      setSelectedItems([]);
      setSearch('');
      refetch();
    }, [refetch]),
  );

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <View style={[commonStyle.rowAC, {marginRight: wp(3)}]}>
  //         <TouchableOpacity
  //           style={[{marginRight: wp(5)}]}
  //           onPress={() => setIsHorizontal(!isHorizontal)}>
  //           <SvgIcons.Category width={tabIcon} height={tabIcon} />
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           // style={commonStyle.iconView}
  //           onPress={() => {
  //             let params = {
  //               from: RootScreens.SecureCheckout,
  //               deliveryAdd: deliveryAdd,
  //               billingAdd: billingAdd,
  //               orderDetails: orderDetails,
  //               notes: notes,
  //               expectedDate: expectedDate,
  //               cartType: cartType,
  //               nav: nav,
  //             };
  //             navigation.navigate(RootScreens.Cart, params);
  //           }}>
  //           <SvgIcons.Buy width={wp(7)} height={wp(7)} fill={colors.orange} />
  //           {cartItems?.length ? (
  //             <View style={styles.countView}>
  //               <FontText
  //                 color="white"
  //                 name="lexend-medium"
  //                 size={normalize(10)}
  //                 textAlign={'center'}>
  //                 {cartItems?.length}
  //               </FontText>
  //             </View>
  //           ) : null}
  //         </TouchableOpacity>
  //       </View>
  //     ),
  //   });
  // }, [navigation, isHorizontal, cartItems]);

  React.useLayoutEffect(() => {
    // *******************************  Hetvi ********************************
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.orange,
        zIndex:-100
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
            onPress={() => navigation.goBack()}>
            <SvgIcons.Back_Arrow width={iconSize} height={iconSize} />
          </TouchableOpacity>
          <FontText
          style={{width:wp(30)}}
            name={'mont-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            {route?.params.company}
          </FontText>
        </View>
      ),
      headerRight: () => (
        <View
          style={[
            commonStyle.row,
            {
              marginRight: wp(4),
              width: wp(10),
              justifyContent: 'space-between',
            },
          ]}>
          {/* <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => setIsOpen(true)}>
            <SvgIcons.Icon_code width={tabIcon} height={tabIcon} />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => {
                          let params = {
                            from: RootScreens.SecureCheckout,
                            deliveryAdd: deliveryAdd,
                            billingAdd: billingAdd,
                            orderDetails: orderDetails,
                            notes: notes,
                            expectedDate: expectedDate,
                            cartType: cartType,
                            nav: nav,
                          };
                          navigation.navigate(RootScreens.Cart, params);
                        }}>
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
    });
  }, [navigation, isHorizontal, cartItems]);


  useEffect(() => {
    const filterData = productList?.result?.filter(
      (item: any) => item?.isPublished,
    );
    setProductListData(filterData);
    setPublishedData(filterData);
  }, [isProcessing]);

  useEffect(() => {
    if (!search) {
      setProductListData(publishedData);
    } else {
      const data = publishedData.filter((item: any) => {
        return item.productName.toUpperCase().includes(search.toUpperCase());
      });
      setProductListData(data);
    }
  }, [search]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCartItems = async () => {
        if (selectedItems.length > 0) {
          setProductListData(productListData);
        } else if (publishedData?.length > 0) {
          const items = await getCartItems(cartType);
          if (items?.length > 0 && route?.params?.id == items[0]?.company?.id) {
            let updatedCart = items.filter((item: any) => {
              return publishedData.find(
                (itm: any) => itm.id === item.product.id,
              );
            });
            updatedCart = await Promise.all(
              updatedCart.map(async (item: any) => {
                let productData: any = await publishedData.find(
                  (itm: any) => itm.id === item.product.id,
                );
                if (productData) {
                  item.quantity =
                    (await productData.maxOrderQuantity) > 0 &&
                    item.quantity > productData.maxOrderQuantity
                      ? productData.maxOrderQuantity
                      : item.quantity < productData.minOrderQuantity
                      ? productData.minOrderQuantity
                      : item.quantity;
                }
                item.product = productData;
                return item;
              }),
            );
            await updateCartItems(updatedCart, cartType);
            setCartItems(updatedCart);
          } else {
            setCartItems(items);
          }
        }
      };
      fetchCartItems();
    }, [publishedData]),
  );

  const handleAddToCart = async (item: any) => {
    let cartData = {
      id: item.id,
      price: item.price,
      quantity: Number(item.quantity),
      company: item.createdByCompany,
      product: {
        createdAt: item.createdAt,
        description: item.description,
        id: item.id,
        image: item.image,
        isDeleted: item.isDeleted,
        isPublished: item.isPublished,
        price: item.price,
        productName: item.productName,
        sku: item.sku,
        unit: item.unit,
        updatedAt: item.updatedAt,
        maxOrderQuantity: Number(item.maxOrderQuantity),
        minOrderQuantity: Number(item.minOrderQuantity),
      },
    };
    const data = await addToCart(cartData, cartType);
    setCartItems(data);
  };

  const handleIncrement = async (cartId: any) => {
    const data = await incrementCartItem(cartId, cartType);
    setCartItems(data);
  };

  const handleDecrement = async (cartId: any) => {
    const data = await decrementCartItem(cartId, 'Product', cartType);
    setCartItems(data);
  };

  const onProductPress = (item: any) => {
    if (cartItems?.length > 0) {
      let isSameCompany = cartItems?.some(
        (itm: any) => itm?.company?.id === item?.createdByCompany?.id,
      );
      if (isSameCompany) {
        handleAddToCart(item);
      } else {
        setSelected(item);
        setIsOpen(true);
      }
    } else {
      handleAddToCart(item);
    }
  };

  const onSearch = (selectedItems: any) => {
    togglCloseModal()
    setTimeout(() => {
      setSelectedItems(selectedItems);
      setSearch('');
    }, 200);
  };

  const onRefreshing = () => {
    searchRef?.current?.blur();
    setSearch('');
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  const handleOrderPlace = () => {
    setIsOpen(false);
    navigation.navigate(RootScreens.Cart);
  };

  const handleRemoveItem = async () => {
    await updateCartItems([], cartType);
    let updatedCartItems = await getCartItems(cartType);
    if (updatedCartItems?.length == 0) {
      handleAddToCart(selected);
      setIsOpen(false);
    }
  };


  const togglOpeneModal = () => {
    setModalVisible(true);
  };
  const togglCloseModal = () => {
    setModalVisible(false);
  };
  const toggleModal = () =>{
    setModalVisible(!isModalVisible);
  }

  return (
    <View style={commonStyle.container}>
      {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2.5)}}
        borderBottomWidth={0}
        leftStyle={{width: '50%'}}
        left={
          <View style={[commonStyle.rowAC]}>
            <TouchableOpacity
              style={[commonStyle.iconView, {marginRight: wp(5)}]}
              onPress={() => navigation.goBack()}>
              <SvgIcons.BackArrow width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
            <FontText
              name={'lexend-semibold'}
              size={mediumLargeFont}
              color={'black'}
              textAlign={'left'}>
              {company}
            </FontText>
          </View>
        }
        right={
          <View style={[commonStyle.row]}>
            <TouchableOpacity
              style={[commonStyle.iconView, {marginRight: wp(5)}]}
              onPress={() => setIsHorizontal(!isHorizontal)}>
              <SvgIcons.Category width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.iconView}
              onPress={() => navigation.navigate(RootScreens.Cart)}>
              <SvgIcons.Buy width={wp(7)} height={wp(7)} fill={colors.orange} />
              {cartItems?.length ? (
                <View style={styles.countView}>
                  <FontText
                    color="white"
                    name="lexend-medium"
                    size={normalize(10)}
                    textAlign={'center'}>
                    {cartItems?.length}
                  </FontText>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        }
      /> */}
      <Loader loading={isProcessing || isFetching} />
      <View
        style={[
          commonStyle.paddingH4,
          commonStyle.flex,
          {marginTop: hp(2), flexWrap: 'wrap'},
        ]}>
        <View style={[commonStyle.rowJB, {marginBottom: hp(1)}]}>
          <Input
        value={search}
        onChangeText={(text: any) => setSearch(text.trimStart())}
        onSubmit={(text: any) => Keyboard.dismiss()}
        blurOnSubmit={false}
        autoCapitalize="none"
        placeholder={'Search a Products'}
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
          <TouchableOpacity
            style={[commonStyle.iconView,{backgroundColor:colors.orange}]}
            onPress={() => togglOpeneModal()}>
            <SvgIcons.Filter_ width={tabIcon} height={tabIcon} />
          </TouchableOpacity>
        </View>

        <View style={{marginVertical:wp(2),flexDirection:"row",justifyContent:"space-between"}}>
          <FontText
          style={{right:wp(1)}}
          name={'mont-semibold'}
          size={fontSize}
          pLeft={wp(1)}
          color={'black2'}
          >Products</FontText>
          <TouchableOpacity
            onPress={() => setIsHorizontal(!isHorizontal)}>
            {isHorizontal ? <SvgIcons.List_View width={tabIcon} height={tabIcon} /> : <SvgIcons.Card_View width={tabIcon} height={tabIcon} />}
          </TouchableOpacity>
        </View>
        {productListData && productListData.length !== 0 ? (
          <ProductComponent
            data={productListData}
            productAddToCartPress={onProductPress}
            productPress={(item: any) =>
              navigation.navigate(RootScreens.ProductDetail, {
                name: item?.name,
                data: {item: item, companyId: id},
                company: orderDetails?.company?.companyName,
                cartType: cartType,
                deliveryAdd: deliveryAdd,
                billingAdd: billingAdd,
                orderDetails: orderDetails,
                notes: notes,
                expectedDate: expectedDate,
              })
            }
            navigation={navigation}
            onRefresh={onRefreshing}
            refresh={refreshing}
            isHorizontal={isHorizontal}
            quantityDecrement={handleDecrement}
            quantityIncrement={handleIncrement}
            cartItems={cartItems}
            categoryData={category?.result}
          />
        ) : (
          <View style={[commonStyle.allCenter, commonStyle.flex]}>
            <FontText
              color="gray"
              name="mont-medium"
              size={mediumFont}
              textAlign={'center'}>
              {'No products available.'}
            </FontText>
          </View>
        )}
      </View>
      {/* <Popup
        visible={isOpen}
        // onBackPress={() => setIsOpen(false)}
        title={`Are you sure you want to discard items and add new or first place order existing one?`}
        titleStyle={{fontSize: normalize(14)}}
        leftBtnText={'Place Order'}
        rightBtnText={'Yes, Discard'}
        leftBtnPress={handleOrderPlace}
        rightBtnPress={handleRemoveItem}
        onTouchPress={() => setIsOpen(false)}
        leftBtnStyle={{
          width: '48%',
          backgroundColor: colors.white2,
          borderWidth: 0,
        }}
        rightBtnStyle={{backgroundColor: colors.red2, width: '48%'}}
        leftBtnTextStyle={{
          color: colors.blue,
          fontSize: mediumFont,
        }}
        rightBtnTextStyle={{fontSize: mediumFont}}
        style={{paddingHorizontal: wp(4), paddingVertical: wp(5)}}
      /> */}
      <DrawerComponent isModalVisible={isModalVisible} toggleModal={toggleModal}>
      <FilterModal
          onApplyPress={() => {
            togglCloseModal();
            setSearch('');
          }}
          navigation={navigation}
          id={id}
          onApply={onSearch}
          setSearch={setSearch}
          filterItems={selectedItems}
          category={category?.result}
        />
      </DrawerComponent>
    </View>
  );
};

export default ProductListingScreen;

const styles = StyleSheet.create({
  inputText: {
    borderRadius: normalize(10),
    paddingLeft: wp(6),
    color: colors.black2,
    fontSize: normalize(12),
    fontFamily: fonts['mont-medium'],
    backgroundColor: colors.white2,
    height: hp(6.5),
  },
  input: {
    width: '82%',
    borderRadius: normalize(10),
    justifyContent: 'center',
    height: hp(6.5),
  },
  btSheetContainer: {
    borderTopLeftRadius: normalize(30),
    borderTopRightRadius: normalize(30),
  },
container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    zIndex: 0
  },
  animatedBox: {
    flex: 1,
    backgroundColor: "#38C8EC",
    padding: 10
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F04812'
  }
});
