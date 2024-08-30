import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal as RNModal, TouchableWithoutFeedback } from 'react-native';
import { Modal } from 'react-native-paper';




const _BackModal = ({ visible, onBackPress, title, children, rightBtnText, rightBtnColor, rightBtnPress, disabled, rightBtnStyle }) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onBackPress}
    >
    </Modal>
  );
};


export default _BackModal;
