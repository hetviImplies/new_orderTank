import React from 'react';
import {StyleSheet, View, ActivityIndicator, Modal} from 'react-native';
import colors from '../../../assets/colors';

const Loader = (props: any) => {
  const {loading} = props;
  return (
    <Modal transparent={true} animationType={'none'} visible={loading} onRequestClose={() => {}}>
      <View style={styles.loaderBackground}>
        <ActivityIndicator animating={loading} size="large" color={colors.white} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loaderBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
});

export default Loader;
