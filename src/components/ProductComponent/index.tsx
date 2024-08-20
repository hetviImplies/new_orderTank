import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import commonStyle, {mediumFont, smallest, smallFont} from '../../styles';
import {Button, CountNumberModule, FontText} from '..';
import {hp, isIOS, normalize, wp} from '../../styles/responsiveScreen';
import {colors, SvgIcons, Images} from '../../assets';
import { Video } from 'react-native-compressor';

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
        name={'mont-semibold'}
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
        isHorizontal ? styles.itemContainer : styles.itemVerticalContainer,{
          paddingVertical:isHorizontal ? isIOS ? hp(1) :hp(0.9) : isIOS ? item.image ? hp(0.6) :  hp(1.3) : hp(1.1),backgroundColor:colors.orange2
        }
      ]}>
      <TouchableOpacity
        onPress={() => productPress(item)}
        style={[
          isHorizontal ? null : commonStyle.rowAC,
          {width: wp(40), alignItems: isHorizontal ? "flex-start" : "center"},
        ]}>
          <View style={{borderWidth:0,borderRadius:normalize(8),backgroundColor:colors.orange3,
          padding:item?.image ? null : wp(1.5) ,
          width:isHorizontal ? item.image ? null : isIOS ? wp(40) : wp(40) : null,alignItems:"center"
            // paddingHorizontal:isHorizontal ? item.image ? null : isIOS ? wp(12.8) : wp(12) : null,bottom:isHorizontal ? wp(1) : null,
            }}>
        {item?.image ? (
          <Image source={{uri: item.image}} style={[styles.productImg,{
            width: isHorizontal ? wp(40) : isIOS ? wp(12) : wp(13),
            height: isHorizontal ? hp(9) : isIOS ? hp(6.5) : hp(6)}]} />
        ) : (
          <Image source={Images._productImg} style={[styles.productImg,{
            width: isHorizontal ? hp(8) : hp(5),
            height: isHorizontal ? hp(8) : hp(5)}]} />
        )}
        </View>  
        <View
          style={{borderWidth:0,
            marginLeft: isHorizontal ? 0 : wp(4),
            marginTop: isHorizontal ? hp(1) : 0,
            alignItems: isHorizontal ? 'flex-start' : 'flex-start',
          }}>
          <FontText
            name={'mont-semibold'}
            size={smallFont}
            color={'black2'}
            textAlign={'left'}>
            {item?.productName}
          </FontText>
          {item?.minOrderQuantity == 0 && item?.maxOrderQuantity == 0 ? null : (
            <FontText
            pTop={wp(1)}
            name={'mont-semibold'}
            size={smallest}
            color={'gray5'}
            textAlign={'left'}>
              {`Range : ${item?.minOrderQuantity} - ${item?.maxOrderQuantity}`}
            </FontText>
          )}
          <FontText
            name={'mont-bold'}
            size={smallFont}
            color={'orange'}
            pTop={wp(1)}
            pBottom={wp(1)}
            textAlign={'left'}>
            {'₹'}
            {item?.price}
            {item?.unit && `${'/'}${item?.unit}`}
          </FontText>

        </View>
      </TouchableOpacity>

      {isItemInCart ? (

    <CountNumberModule cartItems={cartItems} handleDecrement={quantityDecrement} handleIncrement={quantityIncrement} productDetail={item} />
      ) : (
        <Button
          bgColor={'orange'}
          onPress={() => productAddToCartPress(item)}
          style={[
            styles.buttonContainer,
            {marginTop: isHorizontal ? hp(1) : 0},
          ]}>
          <FontText name={'mont-semibold'} size={smallest} color={'white'}>
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
    paddingVertical: isIOS ? hp(1) :hp(0.8),
    paddingHorizontal: hp(1),
    backgroundColor: colors.white,
    borderRadius: normalize(15),
    width: '48%',
    marginBottom: hp(1.5),borderStyle:"dashed",
    borderWidth:1,
    borderColor:colors.orange,
  },
  itemVerticalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
    backgroundColor: colors.white,
    borderRadius: normalize(15),
    borderStyle:"dashed",
    borderWidth:1,
    borderColor:colors.orange,
    marginBottom: hp(1.5),
    width: '100%',
  },
  productImg: {
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  buttonContainer: {
    borderRadius: normalize(50),
    height: hp(4),
    width: wp(25),
  },
  iconContainer: {
    width: hp(2.6) ,
    height: hp(2.6),
    borderRadius: normalize(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1
  },
  countContainer: {
    justifyContent: 'space-between',
    width: wp(25),
    padding: wp(1.2),
  },
});
