import {FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {smallFont} from '../../styles';
import {FontText} from '..';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import commonStyle from '../../styles';
import colors from '../../assets/colors';
import {useSelector} from 'react-redux';

const ProductComponent = (props: any) => {
  const {data, productPress, refresh, onRefresh} = props;
  const userInfo = useSelector((state: any) => state.auth.userInfo);

  const isGuest =
    (userInfo && Object.keys(userInfo).length === 0) || userInfo === undefined;

  const _renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => productPress(item)}
        style={[styles.itemContainer, commonStyle.shadowContainer]}>
        <Image source={{uri: item.image}} style={styles.logo} />
        <FontText
          name={'lexend-regular'}
          size={smallFont}
          color={'gray4'}
          pTop={wp(2)}
          textAlign={'center'}>
          {item?.name}
        </FontText>
        <FontText
          name={'lexend-regular'}
          size={smallFont}
          color={'black2'}
          pTop={wp(1)}
          //   pBottom={wp(2)}
          textAlign={'left'}>
          {'$'}
          {item?.price}
        </FontText>
        {/* <Button bgColor={'orange'} style={styles.buttonContainer}>
          <FontText name={'lexend-regular'} size={normalize(9)} color={'white'}>
            {'Add to Cart'}
          </FontText>
        </Button> */}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={_renderItem}
      numColumns={2}
      contentContainerStyle={styles.productContentContainer}
      columnWrapperStyle={[commonStyle.colJB]}
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
    />
  );
};

export default ProductComponent;

const styles = StyleSheet.create({
  productContentContainer: {
    marginTop: hp(1.5),
    paddingTop: hp(0.5),
    // paddingBottom: hp(2),
    paddingHorizontal: wp(0.5),
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
});
