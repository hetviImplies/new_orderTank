import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {FontText, Button} from '..';
import commonStyle, {
  fontSize,
  mediumFont,
  mediumLargeFont,
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

  const toggleSelection = (item: any) => {
    const itemId = item._id;
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
    const isSelected = selectedItems.some((i: any) => i === item._id);
    return (
      <Pressable
        style={[
          styles.itemContainer,
          {
            borderColor: isSelected ? 'transparent' : colors.line,
            backgroundColor: isSelected ? colors.orange : colors.white,
          },
        ]}
        onPress={() => toggleSelection(item)}>
        <FontText
          color={isSelected ? 'white' : 'black2'}
          name="lexend-regular"
          size={mediumFont}
          pLeft={wp(2)}
          pRight={wp(1)}
          textAlign={'center'}>
          {item?.name}
        </FontText>
      </Pressable>
    );
  };

  return (
    <View style={[commonStyle.container, commonStyle.paddingH4]}>
      <View style={[commonStyle.rowJB]}>
        <FontText
          color="black2"
          name="lexend-medium"
          size={mediumLargeFont}
          textAlign={'center'}>
          {'Select Category'}
        </FontText>
        <TouchableOpacity onPress={onApplyPress}>
          <SvgIcons.Close width={tabIcon} height={tabIcon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={categoryData}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentStyle}
      />
      <View style={commonStyle.rowJB}>
        <Button
          onPress={onReset}
          bgColor={'orange'}
          style={styles.buttonContainer}>
          <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
            {'Reset'}
          </FontText>
        </Button>
        <Button
          onPress={() => onApply(selectedItems)}
          bgColor={'orange'}
          style={styles.buttonContainer}>
          <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
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
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
  },
  buttonContainer: {
    borderRadius: normalize(6),
    width: '47%',
    marginBottom: hp(3),
  },
});
