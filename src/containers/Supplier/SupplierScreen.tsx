import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import SvgIcons from '../../assets/SvgIcons';
import {NavigationBar, FontText, Input, Loader} from '../../components';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {BASE_URL} from '../../types/data';
import {RootScreens} from '../../types/type';
import colors from '../../assets/colors';
import Popup from '../../components/Popup';
import {
  useCompanyRequestMutation,
  useGetSupplierQuery,
} from '../../api/company';
import {err} from 'react-native-svg';
import utils from '../../helper/utils';

const SupplierScreen = ({navigation}: any) => {
  const [search, setSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const {data: supplierList, isFetching: isProcessing} = useGetSupplierQuery(
    {search: searchText, status: 'accepted'},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [sendCompanyReq, {isLoading: isProcess}] = useCompanyRequestMutation();

  console.log('supplierList', supplierList?.result);

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
        <Image source={{uri: item?.logo}} style={styles.logo} />
        <View>
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
    let params = {
      companyCode: code,
    };
    const {data, error}: any = await sendCompanyReq(params);
    console.log('DATA', data, error);
    if (!error) {
      setIsOpen(false);
      setCode('');
      utils.showSuccessToast(data.message);
    } else {
      setIsOpen(false);
      setCode('');
      utils.showErrorToast(error.message);
    }
  };

  return (
    <View style={commonStyle.container}>
      <NavigationBar
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
      />
      <Loader loading={isProcessing || isProcess} />
      <View style={[commonStyle.paddingH4, {marginTop: hp(1)}]}>
        <Input
          value={search}
          onChangeText={(text: any) => setSearch(text.trimStart())}
          onSubmit={(text: any) => setSearchText(text.trimStart())}
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
        {supplierList &&
        supplierList?.result &&
        supplierList?.result?.length > 0 ? (
          <FlatList
            data={supplierList?.result}
            renderItem={_renderItem}
            contentContainerStyle={styles.containerContent}
          />
        ) : (
          <View style={commonStyle.flexJC}>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'gray3'}
              textAlign={'center'}>
              {'No Result Found.'}
            </FontText>
          </View>
        )}
      </View>
      <Popup
        visible={isOpen}
        onOpen={() => setIsOpen(true)}
        onBackPress={() => {
          setIsOpen(false);
          setCode('');
        }}
        title={'Enter Supplier Code'}
        titleStyle={{textAlign: 'left'}}
        children={
          <Input
            value={code}
            onChangeText={(text: string) => setCode(text)}
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
        rightBtnText={'Apply'}
        rightBtnPress={applyCodePress}
        // onTouchPress={() => setIsOpen(false)}
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
    fontFamily: 'lexend-regular',
    backgroundColor: colors.white2,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: colors.white,
    borderRadius: normalize(6),
    marginBottom: hp(2),
  },
  logo: {
    width: hp(6.5),
    height: hp(6.5),
    resizeMode: 'cover',
    borderRadius: normalize(5),
    marginRight: wp(3),
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
