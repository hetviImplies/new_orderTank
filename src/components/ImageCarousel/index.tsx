import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { hp } from '../../styles/responsiveScreen';

const ImageCarousel = (props: any) => {
  const {
    data,
    dotsLength,
    renderItem,
    itemWidth,
    autoplay,
    loop,
    inactiveDotOpacity,
    inactiveDotScale,
    dotContainerStyle,
    containerStyle,
    dotStyle,
    inactiveDotStyle,
    style
  } = props;
  const [activeSlide, setActiveSlide] = useState(0);
  return (
    <View>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={itemWidth}
        onSnapToItem={(index: any) => setActiveSlide(index)}
        autoplay={autoplay}
        loop={loop}
        style={style}
      />
      <Pagination
        dotsLength={dotsLength}
        activeDotIndex={activeSlide}
        containerStyle={containerStyle}
        dotContainerStyle={dotContainerStyle}
        dotStyle={dotStyle}
        inactiveDotStyle={inactiveDotStyle}
        inactiveDotOpacity={inactiveDotOpacity}
        inactiveDotScale={inactiveDotScale}
      />
    </View>
  );
};

export default ImageCarousel;
