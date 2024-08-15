import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors, fonts } from '../../../assets';
import { mediumFont } from '../../../styles';
import { hp, wp } from '../../../styles/responsiveScreen';
const TabBarView = ({props,style,indicatorStyle}) => {
  return (
    <TabBar
      {...props}
      style={style}
      indicatorStyle={indicatorStyle}
      renderLabel={({ route, focused }) => (
        <View style={{borderWidth:0,width:wp(route.title.length+20),alignItems:'center'}}>
          <Text style={[styles.tabText, focused && styles.activeTabText]}>
            {route.title}
          </Text>
        </View>
      )}
    />
  )
}

export default TabBarView

const styles = StyleSheet.create({
    activeTabText: {
    color:colors.orange,
    fontSize:mediumFont,
    fontFamily:fonts["mont-semibold"]
  },
  tabText: {
    color: colors.tabGray,
    fontSize: mediumFont,
    fontFamily:fonts["mont-semibold"]
  }
})