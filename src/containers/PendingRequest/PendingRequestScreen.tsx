import {FlatList, Image, RefreshControl, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {colors, Images} from '../../assets';
import {NavigationBar, FontText, Button, Loader} from '../../components';
import commonStyle, {fontSize, smallFont, mediumFont} from '../../styles';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import {useGetSupplierQuery} from '../../api/companyRelation';

const PendingRequestScreen = ({navigation}: any) => {
  const {
    data: supplierList,
    isFetching: isProcessing,
    refetch: reqRefetch,
  } = useGetSupplierQuery(
    {isRequested: true, sellerLists: true},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [refreshing, setRefreshing] = useState(false);

  const _renderItem = ({item, index}: any) => {
    return (
      <View style={[styles.itemContainer, commonStyle.shadowContainer]}>
        <View style={commonStyle.rowAC}>
          {item?.company?.logo ? (
            <Image source={{uri: item?.company?.logo}} style={styles.logo} />
          ) : (
            <Image source={Images.supplierImg} style={styles.logo} />
          )}
           <View style={{width: wp(45)}}>
            <FontText
              name={'mont-medium'}
              size={fontSize}
              color={'black'}
              textAlign={'left'}>
              {item?.company?.companyName}
            </FontText>
            <FontText
              name={'mont-medium'}
              size={smallFont}
              color={'gray'}
              pTop={wp(2)}
              textAlign={'left'}>
              {item?.company?.companyCode}
            </FontText>
          </View>
        </View>
        <Button disabled bgColor={'green'} style={styles.buttonContainer}>
          <FontText name={'mont-medium'} size={smallFont} color={'white'}>
            {'Pending'}
          </FontText>
        </Button>
      </View>
    );
  };

  const onRefreshing = () => {
    setRefreshing(true);
    reqRefetch();
    setRefreshing(false);
  };

  return (
    <View style={commonStyle.container}>
      {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2.5)}}
        borderBottomWidth={0}
        leftStyle={{width: '100%'}}
        left={
          <View style={[commonStyle.rowAC]}>
            <TouchableOpacity
              style={[commonStyle.iconView, {marginRight: wp(5)}]}
              onPress={() => navigation.goBack()}>
              <SvgIcons.BackArrow width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
            <FontText
              name={'lexend-semibold'}
              size={mediumLargeFont}
              color={'black'}
              textAlign={'left'}>
              {'Pending request'}
            </FontText>
          </View>
        }
      /> */}
      <Loader loading={isProcessing} />
      {supplierList &&
      supplierList?.result?.data &&
      supplierList?.result?.data?.length === 0 ? (
        <View style={commonStyle.flexJC}>
          <FontText
            name={'mont-medium'}
            size={mediumFont}
            color={'gray'}
            textAlign={'center'}>
            {'No Pending request available.'}
          </FontText>
        </View>
      ) : (
        <FlatList
          data={supplierList?.result?.data}
          renderItem={_renderItem}
          contentContainerStyle={styles.containerContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
          }
        />
      )}
    </View>
  );
};

export default PendingRequestScreen;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    backgroundColor: colors.white,
    borderRadius: normalize(6),
    marginBottom: hp(1.5),
  },
  logo: {
    width: hp(6.5),
    height: hp(6.5),
    resizeMode: 'cover',
    borderRadius: normalize(5),
    marginRight: wp(3),
    borderWidth: 0.2,
    borderColor: colors.black2,
  },
  buttonContainer: {
    borderRadius: normalize(10),
    height: hp(3.5),
    width: '25%',
  },
  containerContent: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },
});
