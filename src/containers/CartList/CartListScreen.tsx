import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontText, Loader, NavigationBar} from '../../components';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import commonStyle, {
  mediumFont,
  mediumLarge1Font,
  smallFont,
} from '../../styles';
import {useGetCartsQuery} from '../../api/cart';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';
import {RootScreens} from '../../types/type';
// import {useFocusEffect} from '@react-navigation/native';

const CartListScreen = ({navigation}: any) => {
  const {
    data: carts,
    isFetching,
    refetch,
  } = useGetCartsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const [companyList, setCompanyList] = useState<any>([]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const fetchData = async () => {
  //       await refetch();
  //     };
  //     fetchData();
  //   }, [navigation, refetch]),
  // );

  useEffect(() => {
    const counts: any = {};
    carts?.result?.cart?.forEach((item: any) => {
      const companyId = JSON.stringify(item.companyId);
      counts[companyId] = (counts[companyId] || 0) + 1;
    });
    const uniqueCompanyIdsWithCount = Object.keys(counts).map(companyId => ({
      companyId: JSON.parse(companyId),
      totalCount: counts[companyId],
    }));
    setCompanyList(uniqueCompanyIdsWithCount);
  }, [isFetching, carts]);

  const onItemPress = (item: any) => {
    navigation.navigate(RootScreens.Cart, {companyId: item.companyId?._id});
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer, commonStyle.shadowContainer]}
        onPress={() => onItemPress(item)}>
        <View style={[commonStyle.rowAC, commonStyle.flex]}>
          <Image source={{uri: item?.companyId?.logo}} style={styles.logo} />
          <View style={{marginLeft: wp(4), width: '66%'}}>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'gray4'}
              // pTop={wp(2)}
              textAlign={'left'}>
              {item?.companyId?.companyName}
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={smallFont}
              color={'gray4'}
              pTop={wp(1)}
              textAlign={'left'}>
              {item?.companyId?.companyCode}
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'black2'}
              pTop={wp(1)}
              textAlign={'left'}>
              ({item?.totalCount} {'items'})
            </FontText>
          </View>
          <SvgIcons.RightArrow />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isFetching} />
      {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2)}}
        borderBottomWidth={0}
        leftStyle={{width: '100%'}}
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
              {'Shopping Cart List'}
            </FontText>
          </View>
        }
      /> */}

      {companyList && companyList?.length !== 0 ? (
        <FlatList
          data={companyList}
          renderItem={_renderItem}
          contentContainerStyle={styles.product2CC}
          refreshControl={
            <RefreshControl onRefresh={refetch} refreshing={isFetching} />
          }
        />
      ) : (
        <View style={styles.emptyCart}>
          <SvgIcons.EmptyCart width={wp(40)} height={wp(40)} />
          <FontText
            color="black2"
            name="lexend-medium"
            size={mediumLarge1Font}
            pTop={wp(4)}
            pBottom={wp(2.5)}
            textAlign={'center'}>
            {'Your cart is Empty!'}
          </FontText>
        </View>
      )}
    </View>
  );
};

export default CartListScreen;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    padding: wp(4),
    backgroundColor: colors.white,
  },
  icons: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: hp(8),
    height: hp(8),
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  product2CC: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(4),
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
