import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontText, Loader, NavigationBar} from '../../components';
import {hp, wp} from '../../styles/responsiveScreen';
import commonStyle, {
  mediumFont,
  mediumLargeFont,
  smallFont,
} from '../../styles';
import {useGetCategoryQuery} from '../../api/category';
import {useGetbrandQuery} from '../../api/brand';
import {RootScreens} from '../../types/type';
import {BASE_URL} from '../../types/data';

const CategoryScreen = ({navigation}: any) => {
  const {data: category, isFetching} = useGetCategoryQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const {data: brands, isFetching: isProcessing} = useGetbrandQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);

  useEffect(() => {
    setCategoryData(category?.result?.data);
  }, [isFetching]);

  useEffect(() => {
    setBrandData(brands?.result?.data);
  }, [isProcessing]);

  const onItemPress = async (item: any) => {
    let params: any = {
      category: [item._id],
      brands: [item._id],
    };
    item.categoryName ? delete params?.brands : delete params?.category;
    navigation.navigate(RootScreens.AllProduct, {
      data: {name: item.categoryName || item.brandName, type: params},
    });
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <Pressable style={styles.itemContainer} onPress={() => onItemPress(item)}>
        <ImageBackground
          source={{
            uri: `${BASE_URL}/${item?.image}`,
          }}
          imageStyle={{ borderRadius: 12}}
          style={styles.icons}>
          <FontText
            color="white"
            name="opensans-bold"
            size={smallFont}
            style={{width: wp(16)}}
            textAlign={'center'}>
            {item?.categoryName || item?.brandName}
          </FontText>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isFetching || isProcessing} />
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
            {'Category'}
          </FontText>
        }
      />
      <ScrollView>
        <FlatList
          data={categoryData}
          renderItem={_renderItem}
          numColumns={4}
          contentContainerStyle={{
            paddingHorizontal: wp(4),
          }}
          columnWrapperStyle={[commonStyle.colJB, {marginBottom: hp(1.5)}]}
          showsHorizontalScrollIndicator={false}
        />
        <FontText
          color="black2"
          name="opensans-semibold"
          size={mediumLargeFont}
          pBottom={wp(5)}
          textAlign={'center'}>
          {'Brand'}
        </FontText>
        <FlatList
          data={brandData}
          renderItem={_renderItem}
          numColumns={4}
          contentContainerStyle={{
            paddingHorizontal: wp(4),
          }}
          columnWrapperStyle={[{marginBottom: hp(1.5), marginRight: wp(5)}]}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(4),
  },
  icons: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
