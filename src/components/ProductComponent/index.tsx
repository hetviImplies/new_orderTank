import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import commonStyle, {mediumFont, smallFont} from '../../styles';
import {Button, FontText} from '..';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {colors, SvgIcons, Images} from '../../assets';

const ProductSection = ({
  section,
  isHorizontal,
  productPress,
  quantityDecrement,
  quantityIncrement,
  cartItems,
  productAddToCartPress,
}: any) => {
  return (
    <View style={isHorizontal ? {width: '100%'} : {}}>
      <FontText
        name={'lexend-regular'}
        size={mediumFont}
        color={'gray4'}
        pTop={wp(1.5)}
        pBottom={wp(2)}
        textAlign={'left'}>
        {section?.categoryName}
      </FontText>
      <View style={styles.sectionView}>
        {section.data.map((item: any) => (
          <ProductItem
            key={item._id}
            item={item}
            isHorizontal={isHorizontal}
            productPress={productPress}
            quantityDecrement={quantityDecrement}
            quantityIncrement={quantityIncrement}
            cartItems={cartItems}
            productAddToCartPress={productAddToCartPress}
          />
        ))}
      </View>
    </View>
  );
};

const ProductItem = ({
  item,
  isHorizontal,
  productPress,
  quantityDecrement,
  quantityIncrement,
  cartItems,
  productAddToCartPress,
}: any) => {
  const isItemInCart =
    cartItems?.filter((itm: any) => itm._id.toString() === item._id.toString())
      .length > 0;

  return (
    <TouchableOpacity
      onPress={() => productPress(item)}
      style={[
        isHorizontal ? styles.itemContainer : styles.itemVerticalContainer,
        commonStyle.shadowContainer,
      ]}>
      <View
        style={[
          isHorizontal ? null : commonStyle.rowAC,
          {width: isHorizontal ? null : '70%'},
        ]}>
        {item?.image ? (
          <Image source={{uri: item.image}} style={styles.productImg} />
        ) : (
          <Image source={Images.productImg} style={styles.productImg} />
        )}
        <View style={{marginLeft: isHorizontal ? 0 : wp(4)}}>
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            color={'gray4'}
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
            {item?.unit && `${'/'}${item?.unit}`}
          </FontText>
        </View>
      </View>
      {isItemInCart ? (
        <View
          style={[
            commonStyle.rowAC,
            styles.countContainer,
            {marginTop: isHorizontal ? hp(1) : 0},
          ]}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => quantityDecrement(item._id)}>
            <SvgIcons.Remove width={wp(4)} height={wp(4)} />
          </TouchableOpacity>
          <FontText
            color="white"
            name="lexend-medium"
            size={mediumFont}
            textAlign={'left'}>
            {
              cartItems?.find(
                (itm: any) => itm._id.toString() === item._id.toString(),
              )?.quantity
            }
          </FontText>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => quantityIncrement(item._id)}>
            <SvgIcons.Plus width={wp(4)} height={wp(4)} fill={colors.orange} />
          </TouchableOpacity>
        </View>
      ) : (
        <Button
          bgColor={'orange'}
          onPress={() => productAddToCartPress(item)}
          style={[
            styles.buttonContainer,
            {marginTop: isHorizontal ? hp(1) : 0},
          ]}>
          <FontText name={'lexend-medium'} size={smallFont} color={'white'}>
            {'Add to Cart'}
          </FontText>
        </Button>
      )}
    </TouchableOpacity>
  );
};

const ProductComponent = (props: any) => {
  const {
    data,
    refresh,
    onRefresh,
    isHorizontal,
    quantityDecrement,
    quantityIncrement,
    cartItems,
    productAddToCartPress,
    categoryData,
  } = props;

  const sections = data?.reduce((acc: any, product: any) => {
    const existingSectionIndex = acc?.findIndex(
      (section: any) => section.categoryId === product.categoryId,
    );

    if (existingSectionIndex !== -1) {
      acc[existingSectionIndex].data.push(product);
    } else {
      const category = categoryData?.find(
        (category: any) => category._id === product.categoryId,
      );
      acc.push({
        categoryId: product.categoryId,
        categoryName: category ? category.name : 'Unknown Category',
        data: [product],
      });
    }

    return acc;
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
      contentContainerStyle={[
        commonStyle.rowJB,
        {flexWrap: 'wrap', paddingHorizontal: wp(0.2)},
      ]}>
      {sections &&
        sections.map((section: any) => (
          <ProductSection
            key={section.categoryId}
            section={section}
            isHorizontal={isHorizontal}
            productPress={props.productPress}
            quantityDecrement={quantityDecrement}
            quantityIncrement={quantityIncrement}
            cartItems={cartItems}
            productAddToCartPress={productAddToCartPress}
          />
        ))}
    </ScrollView>
  );
};

export default ProductComponent;

const styles = StyleSheet.create({
  sectionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  itemContainer: {
    alignItems: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(1),
    backgroundColor: colors.white,
    borderRadius: normalize(10),
    width: '48%',
    marginBottom: hp(1.5),
  },
  itemVerticalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    backgroundColor: colors.white,
    borderRadius: normalize(10),
    marginBottom: hp(1.5),
    width: '100%',
  },
  productImg: {
    width: hp(7),
    height: hp(7),
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  buttonContainer: {
    borderRadius: normalize(5),
    height: hp(3.7),
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
  },
});
