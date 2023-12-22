import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontText, Loader, NavigationBar} from '../../components';
import SvgIcons from '../../assets/SvgIcons';
import {fontSize, mediumLargeFont} from '../../styles';
import {wp} from '../../styles/responsiveScreen';
import commonStyle from '../../styles';
import WatchList from '../../components/WatchList';
import {
  useAddWishlistsMutation,
  useGetWishlistsQuery,
  useRemoveWishlistsMutation,
} from '../../api/wishlist';
import utils from '../../helper/utils';
import {RootScreens} from '../../types/type';

const WishlistScreen = ({navigation}: any) => {
  const {
    data: wishlist,
    isFetching: isProcessing,
    refetch,
  } = useGetWishlistsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const [addWishlist, {isLoading: isLoad}] = useAddWishlistsMutation();
  const [removeWishlist, {isLoading: isFetch}] = useRemoveWishlistsMutation();

  const [productData, setProductData] = useState<any>([]);

  useEffect(() => {
    setProductData(wishlist?.result?.data?.wishProducts);
  }, [isProcessing]);

  const toggleLike = async (item: any) => {
    if (item?.isWish) {
      const {data, error}: any = await removeWishlist({
        product: item._id,
      });
      data &&
        data?.statusCode === 200 &&
        utils.showSuccessToast('Removed from Wishlist');
      refetch();
    } else {
      const {data, error}: any = await addWishlist({
        product: item._id,
      });
      data &&
        data?.statusCode === 200 &&
        utils.showSuccessToast('Item Added in Wishlist');
      refetch();
    }
  };

  const productPress = (data: any) => {
    navigation.navigate(RootScreens.ProductDetail, {item: data});
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isProcessing || isLoad || isFetch} />
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
            {'My Wishlist'}
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
      {wishlist?.result &&
      wishlist?.result?.data &&
      wishlist?.result?.data?.wishProducts?.length !== 0 ? (
        <WatchList
          data={productData}
          productPress={productPress}
          navigation={navigation}
          toggleLike={toggleLike}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <FontText
            color="black2"
            name="opensans-semibold"
            size={fontSize}
            textAlign={'center'}>
            {'Your Wishlist is empty!'}
          </FontText>
        </View>
      )}
    </View>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({});
