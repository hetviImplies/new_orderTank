import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontText, Button} from '..';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {colors, SvgIcons} from '../../assets';

const FilterModal = (props: any) => {
  const {filterItems, onApplyPress, setSearch, onApply, category} = props;
  const [categoryData, setCategoryData] = useState(category);
  const [selectedItems, setSelectedItems] = useState<any>(filterItems);

  const onReset = () => {
    setSelectedItems([]);
    setSearch('');
  };

  useEffect(()=>{
    setCategoryData(category)
  },[category])

  const toggleSelection = (item: any) => {
    const itemId = item.id;
    const idx = selectedItems.findIndex((i: any) => i === itemId);
    let newSelectedItems = [...selectedItems]; // Create a new array reference

    if (idx !== -1) {
      newSelectedItems = newSelectedItems.filter((i: any) => i !== itemId); // Remove item if already selected
    } else {
      newSelectedItems.push(itemId); // Add item if not selected
    }

    setSelectedItems(newSelectedItems); // Update state with the new array
  };

  const _renderItem = ({item, index}: any) => {
    const isSelected = selectedItems.some((i: any) => i === item.id);
    return (
      <Pressable
        style={[
          styles.itemContainer,
          {
            borderColor: isSelected ? 'transparent' : colors.gray6,
            backgroundColor: isSelected ? colors.orange : colors.white,
          },
        ]}
        onPress={() => toggleSelection(item)}>
        <FontText
          color={isSelected ? 'white' : 'black2'}
          name="mont-medium"
          size={smallFont}
          pLeft={wp(2)}
          pRight={wp(1)}
          textAlign={'center'}>
          {item?.categoryName}
        </FontText>
      </Pressable>
    );
  };

  return (
    <View style={[commonStyle.container,{borderTopLeftRadius:30,borderBottomLeftRadius:30,width:wp(85)}]}>
      <View style={[commonStyle.rowJB,{marginTop:wp(6)}, commonStyle.paddingH4]}>
      <FontText
          color="black2"
          name="mont-bold"
          size={mediumLargeFont}
          textAlign={'center'}>
          {'Filter'}
        </FontText>
        <TouchableOpacity onPress={onApplyPress}>
          <SvgIcons.New_Close width={iconSize} height={iconSize} />
        </TouchableOpacity>
      </View>
      <View style={[styles.dashedLine,{marginVertical:wp(3)}]} />
      <View style={[commonStyle.rowJB, commonStyle.paddingH4]}>
        <FontText
          color="black2"
          name="mont-semibold"
          size={mediumFont}
          textAlign={'center'}>
          {'Select Category'}
        </FontText>
      </View>
      <ScrollView contentContainerStyle={[styles.contentStyle, commonStyle.paddingH4]} showsVerticalScrollIndicator={false}>
        {categoryData?.map((item: any, index: any) => {
          return _renderItem({item, index});
        })}
      </ScrollView>
      <View style={[commonStyle.rowJB, commonStyle.paddingH4]}>
        <Button
          onPress={onReset}
          bgColor={'orange4'}
          style={styles.buttonContainer}>
          <FontText name={'mont-bold'} size={mediumFont} color={'orange'}>
            {'Reset All'}
          </FontText>
        </Button>
        <Button
          onPress={() => onApply(selectedItems)}
          bgColor={'orange'}
          style={styles.buttonContainer}>
          <FontText name={'mont-bold'} size={mediumFont} color={'white'}>
            {'Apply'}
          </FontText>
        </Button>
      </View>
    </View>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  contentStyle: {
    paddingTop: hp(2),
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: wp(0.5),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2.5),
    marginRight: wp(4),
    marginBottom: hp(1.5),
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonContainer: {
    borderRadius: normalize(100),
    width: '47%',
    marginBottom: hp(3),
  },
  dashedLine: {
    borderTopWidth: 1,
    borderColor: colors.gray6,
    width:wp(100)
  },
});
