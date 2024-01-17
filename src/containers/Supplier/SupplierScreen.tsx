import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import commonStyle, {
  fontSize,
  mediumFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {NavigationBar, FontText, Input, Loader, Popup} from '../../components';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import {colors, SvgIcons, Images} from '../../assets';
import {
  useCompanyRequestMutation,
  useGetSupplierQuery,
} from '../../api/company';
import utils from '../../helper/utils';

const SupplierScreen = ({navigation}: any) => {
  const {
    data: supplierList,
    isFetching: isProcessing,
    refetch,
  } = useGetSupplierQuery(
    // {search: searchText, status: 'accepted'},
    {status: 'accepted'},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [sendCompanyReq, {isLoading: isProcess}] = useCompanyRequestMutation();

  const [search, setSearch] = useState('');
  // const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [suppplierData, setSupplierData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onRefreshing = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={[commonStyle.row, {marginRight: wp(4)}]}>
          <TouchableOpacity
            style={[{marginRight: wp(5)}]}
            onPress={() => navigation.navigate(RootScreens.PendingRequest)}>
            <SvgIcons.Timer width={tabIcon} height={tabIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            // style={commonStyle.iconView}
            onPress={() => setIsOpen(true)}>
            <SvgIcons.Code width={tabIcon} height={tabIcon} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setSupplierData(supplierList?.result);
  }, [isProcessing]);

  useEffect(() => {
    if (!search) {
      setSupplierData(supplierList?.result);
    } else {
      const data = supplierList?.result.filter((item: any) => {
        return item.companyName.toUpperCase().includes(search.toUpperCase());
      });
      setSupplierData(data);
    }
  }, [search]);

  const _renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer, commonStyle.shadowContainer]}
        onPress={() =>
          navigation.navigate(RootScreens.ProductListing, {
            id: item?._id,
            company: item?.companyName,
          })
        }>
        {item?.logo ? (
          <Image source={{uri: item?.logo}} style={styles.logo} />
        ) : (
          <Image source={Images.supplierImg} style={styles.logo} />
        )}
        <View style={{width: '80%'}}>
          <FontText
            name={'lexend-regular'}
            size={fontSize}
            color={'black'}
            // pTop={wp(2)}
            textAlign={'left'}>
            {item?.companyName}
          </FontText>
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            color={'gray'}
            pTop={wp(2)}
            textAlign={'left'}>
            {item?.companyCode}
          </FontText>
        </View>
      </TouchableOpacity>
    );
  };

  const applyCodePress = async () => {
    setIsOpen(false);
    let params = {
      companyCode: code,
    };
    const {data, error}: any = await sendCompanyReq(params);
    if (!error && data.statusCode === 200) {
      setCode('');
      utils.showSuccessToast(data.message);
    } else {
      setCode('');
      utils.showErrorToast(data?.message ? data?.message : error?.message);
    }
  };

  return (
    <View style={commonStyle.container}>
      {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2.5)}}
        borderBottomWidth={0}
        leftStyle={{width: '50%'}}
        left={
          <FontText
            name={'lexend-semibold'}
            size={mediumLargeFont}
            color={'black'}
            textAlign={'center'}>
            {'Supplier'}
          </FontText>
        }
        right={
          <View style={[commonStyle.row]}>
            <TouchableOpacity
              style={[commonStyle.iconView, {marginRight: wp(5)}]}
              onPress={() => navigation.navigate(RootScreens.PendingRequest)}>
              <SvgIcons.Timer width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.iconView}
              onPress={() => setIsOpen(true)}>
              <SvgIcons.Code width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
          </View>
        }
      /> */}
      <Loader loading={isProcessing || isProcess} />
      <View style={[commonStyle.paddingH4, {marginTop: hp(1), flex: 1}]}>
        <Input
          value={search}
          onChangeText={(text: any) => setSearch(text.trimStart())}
          // onSubmit={(text: any) => setSearchText(text.trimStart())}
          blurOnSubmit
          autoCapitalize="none"
          placeholder={'Search a seller'}
          placeholderTextColor={'placeholder'}
          fontSize={fontSize}
          inputStyle={styles.inputText}
          color={'black'}
          returnKeyType={'done'}
          style={[styles.input]}
          children={
            <View
              style={{
                ...commonStyle.abs,
                left: wp(3),
              }}>
              <SvgIcons.Search width={wp(4)} height={wp(4)} />
            </View>
          }
        />
        {suppplierData && suppplierData?.length === 0 ? (
          <View style={commonStyle.flexJC}>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'gray'}
              textAlign={'center'}>
              {'No Supplier are available.'}
            </FontText>
          </View>
        ) : (
          <FlatList
            data={suppplierData}
            renderItem={_renderItem}
            contentContainerStyle={styles.containerContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshing}
              />
            }
          />
        )}
      </View>
      <Popup
        visible={isOpen}
        onBackPress={() => {
          setIsOpen(false);
          setCode('');
        }}
        title={'Enter Supplier Code'}
        titleStyle={{textAlign: 'left'}}
        children={
          <Input
            value={code}
            onChangeText={(text: string) => setCode(text.trimStart())}
            placeholder={''}
            autoCapitalize="none"
            placeholderTextColor={'placeholder'}
            fontSize={fontSize}
            inputStyle={[styles.inputText, styles.dashInput]}
            style={styles.input}
            color={'black'}
            returnKeyType={'next'}
            blurOnSubmit
          />
        }
        disabled={code !== '' ? false : true}
        rightBtnText={'Apply'}
        rightBtnColor={code !== '' ? 'orange' : 'gray'}
        rightBtnPress={applyCodePress}
        rightBtnStyle={{width: '100%'}}
      />
    </View>
  );
};

export default SupplierScreen;

const styles = StyleSheet.create({
  inputText: {
    borderRadius: normalize(10),
    paddingLeft: wp(10),
    color: colors.black2,
    fontSize: normalize(12),
    fontFamily: 'Lexend-Regular',
    backgroundColor: colors.white2,
    height: hp(6.5),
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6.5),
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    backgroundColor: colors.white,
    borderRadius: normalize(6),
    marginBottom: hp(2),
    alignItems: 'center',
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
  dashInput: {
    borderStyle: 'dashed',
    borderWidth: 1,
    backgroundColor: colors.white,
    paddingLeft: wp(5),
  },
  containerContent: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(0.5),
    marginTop: hp(2),
  },
});
