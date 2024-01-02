import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import Button from './Button';
import Paragraph from './Paragraph';
import Header from './Header';

export default function ConfirmationModal({
  visible,
  hideModal,
  header,
  paragraph,
  onConfirmPressed,
  onCancelPressed,
  confirmLabel,
  cancelLabel,
}) {
  return (
    <View style={styles.container}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <Header>{header}</Header>
          <Paragraph style={{ textAlign: 'left' }}>{paragraph}</Paragraph>
          {/* <Paragraph style={{ textAlign: 'left', color: 'red' }}>{errorMessage}</Paragraph> */}
          <Button mode="outlined" style={styles.confirmButton} onPress={onConfirmPressed}>
            {confirmLabel}
          </Button>
          <Button mode="outlined" /* disabled={loading} */ onPress={onCancelPressed}>
            {cancelLabel}
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 30,
    borderRadius: 10,
  },
  confirmButton: {
    marginVertical: 8,
  },
});
