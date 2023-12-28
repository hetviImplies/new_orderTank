import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {FontText, Input, Loader, NavigationBar} from '../../components';
import {
  fontSize,
  mediumLargeFont,
} from '../../styles';
import SvgIcons from '../../assets/SvgIcons';
import WatchList from '../../components/ProductComponent';
import {useGetProductQuery} from '../../api/product';
import {RootScreens} from '../../types/type';
import commonStyle from '../../styles';
import { useSelector } from 'react-redux';
import { useAddWishlistsMutation, useRemoveWishlistsMutation } from '../../api/wishlist';
import utils from '../../helper/utils';

const SearchScreen = ({navigation, route}: any) => {
  const [searchText, setSearchText] = useState('');
  const userInfo = useSelector((state: any) => state.auth.userInfo);

  const {data: products, isFetching: isProcessing, refetch} = useGetProductQuery(
    // {user: userInfo?._id, withWishList: true},
    {search: searchText},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [addWishlist, {isLoading: isLoad}] = useAddWishlistsMutation();
  const [removeWishlist, {isLoading: isFetch}] = useRemoveWishlistsMutation();

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
            {'Search'}
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
      <View style={[commonStyle.paddingH4, commonStyle.marginT2]}>
        <Input
          value={searchText}
          onChangeText={(text: any) => setSearchText(text.trimStart())}
          autoCapitalize="none"
          placeholder={'Search'}
          placeholderTextColor={'placeholder'}
          fontSize={fontSize}
          inputStyle={styles.inputText}
          color={'black'}
          returnKeyType={'done'}
          style={[styles.input, commonStyle.shadowContainer]}
          children={
            <View
              style={{
                ...commonStyle.abs,
                left: wp(2),
              }}>
              <SvgIcons.Search />
            </View>
          }
        />
      </View>
      {searchText && products?.result && products?.result?.data?.length !== 0 ? (
        <WatchList data={products?.result?.data} productPress={productPress} navigation={navigation} toggleLike={toggleLike}/>
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <FontText
            color="black2"
            name="opensans-semibold"
            size={fontSize}
            textAlign={'center'}>
            {'Product is not available.'}
          </FontText>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  inputText: {
    borderRadius: 10,
    paddingLeft: wp(8.5),
    color: 'black',
    fontSize: normalize(12),
    fontFamily: 'opensans-medium',
    height: hp(6),
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
  },
});
