import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors, SvgIcons} from '../../assets';
import {
  NavigationBar,
  FontText,
  Input,
  Loader,
  Popup,
  FilterModal,
  ProductComponent,
} from '../../components';
import commonStyle, {tabIcon, fontSize, mediumFont} from '../../styles';
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

const ProductListingScreen = ({navigation, route}: any) => {
  const id = route?.params?.id;
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
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>({});

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={[commonStyle.rowAC, {marginRight: wp(3)}]}>
          <TouchableOpacity
            style={[{marginRight: wp(5)}]}
            onPress={() => setIsHorizontal(!isHorizontal)}>
            <SvgIcons.Category width={tabIcon} height={tabIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            // style={commonStyle.iconView}
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
      ),
    });
  }, [navigation, isHorizontal, cartItems]);

  useEffect(() => {
    const filterData = productList?.result?.filter(
      (item: any) => item?.isPublished,
    );
    setProductListData(filterData);
    setPublishedData(filterData);
  }, [isProcessing, selectedItems]);

  useEffect(() => {
    const filterData = productList?.result?.filter(
      (item: any) => item?.isPublished,
    );
    if (!search) {
      setProductListData(filterData);
    } else {
      const data = filterData.filter((item: any) => {
        return item.productName.toUpperCase().includes(search.toUpperCase());
      });
      setProductListData(data);
    }
  }, [search]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCartItems = async () => {
        if (publishedData?.length > 0) {
          // setLoading(true);
          const items = await getCartItems();
          if (
            items?.length > 0 &&
            route?.params?.id == items[0]?.createdByCompany.id
          ) {
            let updatedCart = items.filter((item: any) =>
              publishedData.find((itm: any) => itm.id === item.id),
            );
            await updateCartItems(updatedCart);
            setCartItems(updatedCart);
          } else {
            setCartItems(items);
          }
          // setLoading(false);
        }
      };
      fetchCartItems();
    }, [publishedData]),
  );

  const handleAddToCart = async (item: any) => {
    const data = await addToCart(item);
    setCartItems(data);
  };

  const handleIncrement = async (cartId: any) => {
    const data = await incrementCartItem(cartId);
    setCartItems(data);
  };

  const handleDecrement = async (cartId: any) => {
    const data = await decrementCartItem(cartId, 'Product');
    setCartItems(data);
  };

  const onProductPress = (item: any) => {
    if (cartItems?.length > 0) {
      let isSameCompany = cartItems?.some(
        (itm: any) => itm?.createdByCompany?.id === item?.createdByCompany?.id,
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
    filterRef.current.close();
    setTimeout(() => {
      setSelectedItems(selectedItems);
      setSearch('');
    }, 200);
  };

  const onRefreshing = () => {
    searchRef.current.blur();
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
    await updateCartItems([]);
    let updatedCartItems = await getCartItems();
    if (updatedCartItems?.length == 0) {
      handleAddToCart(selected);
      setIsOpen(false);
    }
  };

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
          {marginTop: hp(1), flexWrap: 'wrap'},
        ]}>
        <View style={[commonStyle.rowJB, {marginBottom: hp(1)}]}>
          <Input
            ref={searchRef}
            value={search}
            onChangeText={(text: any) => setSearch(text.trimStart())}
            // onSubmit={(text: any) => setSearchText(text.trimStart())}
            blurOnSubmit
            autoCapitalize="none"
            placeholder={'Search a product'}
            placeholderTextColor={'gray3'}
            fontSize={fontSize}
            inputStyle={styles.inputText}
            color={'black'}
            returnKeyType={'done'}
            style={[styles.input]}
            children={
              <View
                style={{
                  ...commonStyle.abs,
                  left: wp(3),
                }}>
                <SvgIcons.Search width={wp(4)} height={wp(4)} />
              </View>
            }
          />
          <TouchableOpacity
            style={[commonStyle.iconView]}
            onPress={() => filterRef.current.open()}>
            <SvgIcons.Filter width={tabIcon} height={tabIcon} />
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
              name="lexend-regular"
              size={mediumFont}
              textAlign={'center'}>
              {'No products available.'}
            </FontText>
          </View>
        )}
      </View>
      <Popup
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
      />
      <RBSheet
        ref={filterRef}
        height={hp(50)}
        closeOnPressMask
        closeOnPressBack
        closeOnDragDown
        dragFromTopOnly
        customStyles={{
          container: styles.btSheetContainer,
        }}>
        <FilterModal
          onApplyPress={() => {
            filterRef.current.close();
            setSearch('');
          }}
          navigation={navigation}
          id={id}
          onApply={onSearch}
          setSearch={setSearch}
          filterItems={selectedItems}
          category={category?.result}
        />
      </RBSheet>
    </View>
  );
};

export default ProductListingScreen;

const styles = StyleSheet.create({
  inputText: {
    borderRadius: normalize(10),
    paddingLeft: wp(10),
    color: colors.black2,
    fontSize: normalize(12),
    fontFamily: 'Lexend-Regular',
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
  countView: {
    width: hp(2.2),
    height: hp(2.2),
    backgroundColor: colors.orange,
    borderRadius: hp(1.5),
    position: 'absolute',
    left: wp(3.5),
    bottom: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
