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
            key={item.id}
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
    cartItems?.filter(
      (itm: any) => itm?.product?.id.toString() === item.id.toString(),
    ).length > 0;

  return (
    <View
      style={[
        isHorizontal ? styles.itemContainer : styles.itemVerticalContainer,
        commonStyle.shadowContainer,
      ]}>
      <TouchableOpacity
        onPress={() => productPress(item)}
        style={[
          isHorizontal ? null : commonStyle.rowAC,
          {width: isHorizontal ? '100%' : '70%', alignItems: 'center'},
        ]}>
        {item?.image ? (
          <Image source={{uri: item.image}} style={styles.productImg} />
        ) : (
          <Image source={Images.productImg} style={styles.productImg} />
        )}
        <View
          style={{
            marginLeft: isHorizontal ? 0 : wp(4),
            marginTop: isHorizontal ? hp(1) : 0,
            alignItems: isHorizontal ? 'center' : 'flex-start',
          }}>
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            color={'gray4'}
            textAlign={'left'}>
            {item?.productName}
          </FontText>
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            color={'black2'}
            pTop={wp(1)}
            pBottom={wp(1)}
            textAlign={'left'}>
            {'₹'}
            {item?.price}
            {item?.unit && `${'/'}${item?.unit}`}
          </FontText>
          {item?.minOrderQuantity == 0 && item?.maxOrderQuantity == 0 ? null : (
            <FontText
              name={'lexend-regular'}
              size={smallFont}
              color={'gray4'}
              textAlign={'left'}>
              {`Range : ${item?.minOrderQuantity} - ${item?.maxOrderQuantity}`}
            </FontText>
          )}
        </View>
      </TouchableOpacity>
      {isItemInCart ? (
        <View
          style={[
            commonStyle.rowAC,
            styles.countContainer,
            {marginTop: isHorizontal ? hp(1) : 0},
          ]}>
          <TouchableOpacity
            style={{flex: 0.3}}
            onPress={() => quantityDecrement(item.id)}>
            <View style={[styles.iconContainer]}>
              <SvgIcons.Remove width={wp(4)} height={wp(4)} />
            </View>
          </TouchableOpacity>
          <FontText
            color="white"
            name="lexend-medium"
            size={mediumFont}
            style={{flex: 0.45}}
            textAlign={'center'}>
            {
              cartItems?.find(
                (itm: any) =>
                  itm?.product?.id.toString() === item.id.toString(),
              )?.quantity
            }
          </FontText>
          <TouchableOpacity
            style={{flex: 0.3, alignItems: 'flex-end'}}
            onPress={() => quantityIncrement(item.id)}>
            <View style={[styles.iconContainer]}>
              <SvgIcons.Plus
                width={wp(4)}
                height={wp(4)}
                fill={colors.orange}
              />
            </View>
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
    </View>
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

  // const sections = data.reduce((result: any, item: any) => {
  //   let categoryInArray2 = categoryData.find(
  //     (category: any) => category.categoryCode === item.category.categoryCode,
  //   );

  //   let existingCategory = result.find(
  //     (combinedItem: any) => combinedItem.categoryId === item.category.id,
  //   );

  //   if (existingCategory) {
  //     existingCategory.data.push(item);
  //   } else {
  //     result.push({
  //       categoryId: item.category.id,
  //       categoryName: item.category.categoryName,
  //       data: [item],
  //     });
  //   }
  //   return result;
  // }, []);

  let sections = data.reduce((result: any, item: any) => {
    let {id: categoryId, categoryName} = item.category;
    let existingCategory = result.find((c: any) => c.categoryId === categoryId);

    existingCategory
      ? existingCategory.data.push(item)
      : result.push({categoryId, categoryName, data: [item]});

    return result;
  }, []);
  sections.sort((a: any, b: any) => a.categoryId - b.categoryId);

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
    height: hp(4),
    width: wp(25),
  },
  iconContainer: {
    width: hp(2.8),
    height: hp(2.8),
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
    padding: wp(1.2),
  },
});
