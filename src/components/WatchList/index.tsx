import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import SvgIcons from '../../assets/SvgIcons';
import {iconSize, smallFont} from '../../styles';
import {FontText} from '..';
import {hp, wp} from '../../styles/responsiveScreen';
import commonStyle from '../../styles';
import colors from '../../assets/colors';
import {BASE_URL} from '../../types/data';
import {RootScreens} from '../../types/type';
import {useSelector} from 'react-redux';

const WatchList = (props: any) => {
  const {
    data,
    productPress,
    navigation,
    toggleLike
  } = props;
  const userInfo = useSelector((state: any) => state.auth.userInfo);

  const isGuest =
    (userInfo && Object.keys(userInfo).length === 0) || userInfo === undefined;

  const _productRenderItem = ({item, index}: any) => {
    return (
      <Pressable
        style={styles.productMainContainer}
        onPress={() => productPress(item)}>
        <View style={[styles.productContainer, commonStyle.shadowContainer]}>
          <Image
            source={{uri: `${BASE_URL}/${item?.thumbnail}`}}
            style={[styles.productImg]}
          />
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => {
              isGuest
                ? navigation.navigate(RootScreens.Login)
                : toggleLike(item);
            }}>
            {item?.isWish ? (
              <SvgIcons.FillHeart
                width={iconSize}
                height={iconSize}
                style={commonStyle.end}
              />
            ) : (
              <SvgIcons.Heart
                width={iconSize}
                height={iconSize}
                style={commonStyle.end}
              />
            )}
          </TouchableOpacity>
          <View style={styles.contentContainer}>
            <FontText
              color="black2"
              name="opensans-medium"
              size={smallFont}
              pBottom={hp(1)}
              textAlign={'center'}>
              {item?.productName}
            </FontText>
            <View style={commonStyle.rowJEC}>
              <FontText
                color="brown"
                name="opensans-medium"
                size={smallFont}
                textAlign={'left'}>
                {'$'}
                {item?.price}
              </FontText>
              <View style={commonStyle.rowAC}>
                <SvgIcons.Star width={wp(3.5)} height={wp(3.5)} />
                <FontText
                  color="black2"
                  name="opensans-medium"
                  size={smallFont}
                  pLeft={wp(1)}
                  textAlign={'left'}>
                  {item?.rating}
                </FontText>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={_productRenderItem}
      numColumns={2}
      contentContainerStyle={styles.productCC}
      columnWrapperStyle={[commonStyle.colJB, commonStyle.marginT2]}
    />
  );
};

export default WatchList;

const styles = StyleSheet.create({
  productCC: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(1),
  },
  productMainContainer: {
    width: '46%',
    height: wp(40),
    justifyContent: 'flex-end',
  },
  productContainer: {
    backgroundColor: colors.white,
    height: wp(30),
    padding: wp(3),
    borderRadius: 12,
  },
  productImg: {
    width: hp(10),
    height: hp(10),
    resizeMode: 'contain',
    alignSelf: 'center',
    position: 'absolute',
    top: hp(-5),
  },
  contentContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    width: '100%',
  },
  likeButton: {alignSelf: 'flex-end', padding: wp(1)},
});
