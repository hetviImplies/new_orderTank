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
import {smallFont} from '../../styles';
import {Button, FontText} from '..';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import commonStyle from '../../styles';
import colors from '../../assets/colors';

const ProductComponent = (props: any) => {
  const {data, productPress, refresh, onRefresh, isHorizontal} = props;

  const _renderItemVertical = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => productPress(item)}
        style={[styles.itemVerticalContainer, commonStyle.shadowContainer]}>
        <View style={[commonStyle.rowAC, {width: '70%'}]}>
          <Image source={{uri: item.image}} style={styles.productImg} />
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
              {'$'}
              {item?.price}
            </FontText>
          </View>
        </View>
        <Button bgColor={'orange'} style={styles.buttonContainer}>
          <FontText name={'lexend-regular'} size={normalize(9)} color={'white'}>
            {'Add to Cart'}
          </FontText>
        </Button>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {isHorizontal ? (
        <ScrollView
          contentContainerStyle={[
            commonStyle.rowJB,
            {flexWrap: 'wrap', paddingHorizontal: wp(0.2)},
          ]}>
          {data.map((item: any, index: any) => {
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
                <Button
                  bgColor={'orange'}
                  style={[styles.buttonContainer, commonStyle.marginT2]}>
                  <FontText
                    name={'lexend-regular'}
                    size={normalize(9)}
                    color={'white'}>
                    {'Add to Cart'}
                  </FontText>
                </Button>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <FlatList
          data={data}
          renderItem={_renderItemVertical}
          contentContainerStyle={styles.productContentContainer}
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
    marginTop: hp(1.5),
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
    width: wp(20),
  },
});
