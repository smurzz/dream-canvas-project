import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

export default function Paragraph(props) {
  const { style, ...otherProps } = props;

  return <Text style={[styles.text, style]} {...otherProps} />
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
  },
})
