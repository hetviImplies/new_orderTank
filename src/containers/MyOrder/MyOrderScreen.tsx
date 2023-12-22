import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontText, Loader, NavigationBar} from '../../components';
import SvgIcons from '../../assets/SvgIcons';
import {fontSize, mediumFont, mediumLargeFont, smallFont} from '../../styles';
import {hp, wp} from '../../styles/responsiveScreen';
import commonStyle from '../../styles';
import colors from '../../assets/colors';
import moment from 'moment';
import {RootScreens} from '../../types/type';
import {useGetOrdersQuery} from '../../api/order';
import {BASE_URL} from '../../types/data';

const MyOrderScreen = ({navigation}: any) => {
  const {data: orders, isFetching: isProcessing} = useGetOrdersQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    orders?.result !== undefined && setProductData(orders?.result?.data);
  }, [orders, isProcessing]);

  const productPress = (item: any, product: any) => {
    navigation.navigate(RootScreens.OrderDetail, {
      data: {item: item, product: product},
    });
  };

  const _renderItem = ({item, index}: any) => {
    let data = item?.products && item?.products[0];
    return (
      <>
        {item?.products?.map((product: any) => {
          return (
            <Pressable
              style={[styles.itemContainer, commonStyle.shadowContainer]}
              onPress={() => productPress(item, product)}>
              <Image
                source={{uri: `${BASE_URL}/${product?.productId?.thumbnail}`}}
                style={[styles.featureImg]}
              />
              <View style={styles.contentRowContainer}>
                <View>
                  <FontText
                    color="black2"
                    name="opensans-semibold"
                    size={mediumFont}
                    pBottom={hp(1)}
                    textAlign={'left'}>
                    {product?.productId?.productName}
                  </FontText>
                  <FontText
                    color="brown"
                    name="opensans-bold"
                    size={mediumLargeFont}
                    pBottom={hp(1)}
                    textAlign={'left'}>
                    {'$'}
                    {product?.productId?.price}
                  </FontText>
                  <FontText
                    color="gray2"
                    name="opensans-semibold"
                    size={smallFont}
                    textAlign={'left'}>
                    {moment(item?.createdAt).format('MMM DD,YYYY hh:mm A')}
                  </FontText>
                </View>
                <SvgIcons.RightArrow
                  width={wp(8)}
                  height={wp(8)}
                  style={commonStyle.center}
                />
              </View>
            </Pressable>
          );
        })}
      </>
    );
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isProcessing} />
      <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2)}}
        borderBottomWidth={0}
        center={
          <FontText
            color="black2"
            name="opensans-semibold"
            size={mediumLargeFont}
            textAlign={'center'}>
            {'My Orders'}
          </FontText>
        }
        left={
          <TouchableOpacity
            style={commonStyle.iconView}
            onPress={() => navigation.goBack()}>
            <SvgIcons.BackIcon />
          </TouchableOpacity>
        }
      />
      {productData && productData.length === 0 ? (
        <View style={[commonStyle.allCenter, {flex: 1}]}>
          <FontText color="black2" name="opensans-medium" size={fontSize}>
            {"You haven't placed an order yet."}
          </FontText>
        </View>
      ) : (
        <FlatList
          data={productData}
          renderItem={_renderItem}
          contentContainerStyle={styles.product2CC}
        />
      )}
    </View>
  );
};

export default MyOrderScreen;

const styles = StyleSheet.create({
  featureImg: {
    width: hp(10),
    height: hp(10),
    resizeMode: 'contain',
  },
  itemContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
    marginBottom: hp(1.5),
    borderRadius: 12,
  },
  product2CC: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
  },
  contentRowContainer: {
    marginLeft: wp(4),
    flexDirection: 'row',
    width: '68%',
    justifyContent: 'space-between',
  },
});
