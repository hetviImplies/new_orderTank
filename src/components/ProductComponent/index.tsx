import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {mediumFont, smallFont} from '../../styles';
import {Button, FontText} from '..';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import commonStyle from '../../styles';
import colors from '../../assets/colors';
import SvgIcons from '../../assets/SvgIcons';
import Images from '../../assets/images';

const ProductComponent = (props: any) => {
  const {
    data,
    productPress,
    refresh,
    onRefresh,
    isHorizontal,
    quantityDecrement,
    quantityIncrement,
    cartItems,
  } = props;

  const _renderItemVertical = ({item, index}: any) => {
    return (
      <View
        // onPress={() => productPress(item)}
        style={[styles.itemVerticalContainer, commonStyle.shadowContainer]}>
        <View style={[commonStyle.rowAC, {width: '70%'}]}>
          {item?.image ? (
            <Image source={{uri: item.image}} style={styles.productImg} />
          ) : (
            <Image source={Images.productImg} style={styles.productImg} />
          )}
          <View style={{marginLeft: wp(4)}}>
            <FontText
              name={'lexend-regular'}
              size={smallFont}
              color={'gray4'}
              // pTop={wp(2)}
              textAlign={'left'}>
              {item?.name}
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={smallFont}
              color={'black2'}
              pTop={wp(2)}
              textAlign={'left'}>
              {'₹'}
              {item?.price}
            </FontText>
          </View>
        </View>
        {cartItems?.filter(
          (itm: any) => itm._id.toString() == item?._id.toString(),
        ).length > 0 ? (
          <View style={[commonStyle.rowAC, styles.countContainer]}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                quantityDecrement(item?._id);
              }}>
              <SvgIcons.Remove width={wp(4)} height={wp(4)} />
            </TouchableOpacity>
            <FontText
              color="white"
              name="lexend-medium"
              size={mediumFont}
              textAlign={'left'}>
              {
                cartItems?.find((itm: any) => {
                  return itm._id.toString() == item?._id.toString();
                }).quantity
              }
            </FontText>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                quantityIncrement(item?._id);
              }}>
              <SvgIcons.Plus
                width={wp(4)}
                height={wp(4)}
                fill={colors.orange}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            bgColor={'orange'}
            onPress={() => productPress(item)}
            style={[styles.buttonContainer, commonStyle.marginT2]}>
            <FontText name={'lexend-medium'} size={smallFont} color={'white'}>
              {'Add to Cart'}
            </FontText>
          </Button>
        )}
      </View>
    );
  };

  return (
    <>
      {isHorizontal ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
          contentContainerStyle={[
            commonStyle.rowJB,
            {flexWrap: 'wrap', paddingHorizontal: wp(0.2)},
          ]}>
          {data.map((item: any, index: any) => {
            return (
              <View
                // onPress={() => productPress(item)}
                style={[styles.itemContainer, commonStyle.shadowContainer]}>
                {item?.image ? (
                  <Image source={{uri: item.image}} style={styles.productImg} />
                ) : (
                  <Image source={Images.productImg} style={styles.productImg} />
                )}
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
                  {'₹'}
                  {item?.price}
                </FontText>
                {cartItems?.filter(
                  (itm: any) => itm._id.toString() == item?._id.toString(),
                ).length > 0 ? (
                  <View style={[commonStyle.rowAC, styles.countContainer]}>
                    <TouchableOpacity
                      style={styles.iconContainer}
                      onPress={() => {
                        quantityDecrement(item?._id);
                      }}>
                      <SvgIcons.Remove width={wp(4)} height={wp(4)} />
                    </TouchableOpacity>
                    <FontText
                      color="white"
                      name="lexend-medium"
                      size={mediumFont}
                      textAlign={'left'}>
                      {
                        cartItems?.find((itm: any) => {
                          return itm._id.toString() == item?._id.toString();
                        })?.quantity
                      }
                    </FontText>
                    <TouchableOpacity
                      style={styles.iconContainer}
                      onPress={() => {
                        quantityIncrement(item?._id);
                      }}>
                      <SvgIcons.Plus
                        width={wp(4)}
                        height={wp(4)}
                        fill={colors.orange}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Button
                    bgColor={'orange'}
                    onPress={() => productPress(item)}
                    style={[styles.buttonContainer, commonStyle.marginT2]}>
                    <FontText
                      name={'lexend-medium'}
                      size={smallFont}
                      color={'white'}>
                      {'Add to Cart'}
                    </FontText>
                  </Button>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <FlatList
          data={data}
          renderItem={_renderItemVertical}
          contentContainerStyle={styles.productContentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        />
      )}
    </>
  );
};

export default ProductComponent;

const styles = StyleSheet.create({
  productContentContainer: {
    marginTop: hp(0.5),
    paddingTop: hp(0.5),
    paddingHorizontal: wp(0.5),
  },
  itemContainer: {
    alignItems: 'center',
    paddingVertical: hp(2),
    backgroundColor: colors.white,
    borderRadius: normalize(10),
    width: '48%',
    marginBottom: hp(2),
  },
  itemVerticalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: colors.white,
    borderRadius: normalize(10),
    marginBottom: hp(1.5),
    width: '100%',
  },
  logo: {
    width: hp(12),
    height: hp(12),
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  productImg: {
    width: hp(8),
    height: hp(8),
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  buttonContainer: {
    borderRadius: normalize(5),
    height: hp(3.5),
    width: wp(25),
  },
  iconContainer: {
    width: hp(2.5),
    height: hp(2.5),
    borderRadius: normalize(3),
    backgroundColor: colors.white2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    backgroundColor: colors.orange,
    borderRadius: normalize(4),
    justifyContent: 'space-between',
    width: wp(25),
    padding: hp(0.6),
    marginTop: hp(2),
  },
});
