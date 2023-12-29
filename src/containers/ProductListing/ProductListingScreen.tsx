import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';
import {NavigationBar, FontText, Input, Loader} from '../../components';
import commonStyle, {
  mediumLargeFont,
  tabIcon,
  fontSize,
  mediumFont,
} from '../../styles';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import RBSheet from 'react-native-raw-bottom-sheet';
import FilterModal from '../../components/FilterModal';
import {useGetAllProductsQuery} from '../../api/product';
import ProductComponent from '../../components/ProductComponent';
import {useGetCartsQuery} from '../../api/cart';

const ProductListingScreen = ({navigation, route}: any) => {
  const id = route.params.id;
  const company = route.params.company;

  const [selectedItems, setSelectedItems] = useState<[]>([]);
  const [search, setSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [productListData, setProductListData] = useState([]);
  const filterRef: any = useRef(null);

  const {
    data: productList,
    isFetching: isProcessing,
    refetch,
  } = useGetAllProductsQuery(
    {
      isBuyer: true,
      companyId: id,
      categoryId: selectedItems,
      // search: searchText,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const {data: carts, isFetching} = useGetCartsQuery({
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    setProductListData(productList?.result);
  }, [isProcessing, selectedItems]);

  useEffect(() => {
    if (!search) {
      setProductListData(productList?.result);
    } else {
      const data = productList?.result.filter((item: any) => {
        return item.name.includes(search);
      });
      setProductListData(data);
    }
  }, [search]);

  const onProductPress = (item: any) => {
    navigation.navigate(RootScreens.ProductDetail, {
      data: {item: item, companyId: id},
    });
  };

  const onSearch = (selectedItems: any) => {
    setSelectedItems(selectedItems);
    filterRef.current.close();
  };

  const onRefreshing = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  return (
    <View style={commonStyle.container}>
      <NavigationBar
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
              onPress={() => filterRef.current.open()}>
              <SvgIcons.Category width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.iconView}
              onPress={() => navigation.navigate(RootScreens.CartList)}>
              <SvgIcons.Buy width={wp(7)} height={wp(7)} fill={colors.orange} />
              {carts && carts?.result && carts?.result?.cart?.length ? (
                <View style={styles.countView}>
                  <FontText
                    color="white"
                    name="lexend-medium"
                    size={normalize(10)}
                    textAlign={'center'}>
                    {carts?.result?.cart?.length}
                  </FontText>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        }
      />
      <Loader loading={isProcessing || isFetching} />
      <View
        style={[commonStyle.paddingH4, commonStyle.flex, {marginTop: hp(1)}]}>
        <Input
          value={search}
          onChangeText={(text: any) => setSearch(text.trimStart())}
          onSubmit={(text: any) => setSearchText(text.trimStart())}
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
        {productListData && productListData.length !== 0 ? (
          <ProductComponent
            data={productListData}
            productPress={onProductPress}
            navigation={navigation}
            onRefresh={onRefreshing}
            refresh={refreshing}
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
          onApplyPress={() => filterRef.current.close()}
          navigation={navigation}
          id={id}
          onApply={onSearch}
          filterItems={selectedItems}
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
    fontFamily: 'lexend-regular',
    backgroundColor: colors.white2,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
  },
  itemContainer: {
    alignItems: 'center',
    paddingVertical: hp(2),
    backgroundColor: colors.white,
    borderRadius: normalize(10),
    marginBottom: hp(1.5),
    width: '48%',
  },
  logo: {
    width: hp(12),
    height: hp(12),
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  buttonContainer: {
    borderRadius: normalize(5),
    height: hp(4),
    width: '50%',
  },
  productContentContainer: {
    marginTop: hp(1.5),
    paddingTop: hp(0.5),
    paddingBottom: hp(16),
    paddingHorizontal: wp(0.5),
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
    right: wp(2),
    top: wp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
