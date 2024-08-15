import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
const DrawerModal = ({toggleModal,isModalVisible,children}) => {

  return (
    <View style={styles.container}>
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={toggleModal}
        swipeDirection="right"
        animationIn="slideInRight"
        animationOut="slideOutRight"
        style={styles.modal}
        backdropOpacity={0.3}
      >
       {children}
      </Modal>
    </View>
  )
}

export default DrawerModal

const styles = StyleSheet.create({
    container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    margin: 0, // Remove default margin to make it full screen
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalContent: {
    width: '75%',
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})