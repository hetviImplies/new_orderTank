import { StyleSheet, Text, View } from 'react-native'
import React, { createRef, useImperativeHandle, useState } from 'react'
import { TextInput } from 'react-native-paper'
import { colors, fonts } from '../../../assets'
import { normalize, wp } from '../../../styles/responsiveScreen'

const OutLine_TextInput = ({value,label,editable,setValue,placeholder,fontSize,func,returnKeyLabel,fontName,color,returnKeyType,onSubmitEditing,multiline,height,multilineHeight,disabled,style}) => {


  const [inputEditable, setEditable] = useState(editable);


  const _inputStyle = {
    marginBottom: multiline ? multilineHeight : height,
    fontSize,
    fontFamily: fonts[fontName],
    color: colors[color],
  };



  return (
    <TextInput
    disabled={disabled}
        mode="outlined"
        ref={func}
        multiline={multiline}
        dense
        placeholderTextColor={colors.placeholder}
        placeholder={placeholder}
        label={label}
        onSubmitEditing={onSubmitEditing}
        numberOfLines={multiline ? null : 1}
        returnKeyLabel={returnKeyLabel}
        textColor={colors.darkGray}
        outlineColor={colors.lightGray}
        selectionColor={colors.lightGray}
        returnKeyType={returnKeyType}
        // enablesReturnKeyAutomatically={true}
        value={value}
        activeOutlineColor={[colors.lightGray]}
        outlineStyle={[style ? style : {borderRadius:normalize(100)}]}
        style={[
            _inputStyle,{backgroundColor:"white",textAlignVertical: "top",}]}
        editable={editable}
        onChangeText={setValue}
      />
  )
}

// OutLine_TextInput.defaultProps = {
//   height: 46,
//   fontSize: normalize(16),
//   fontName: 'default',
//   color: 'default',
//   placeholder: 'Type something...',
//   placeholderTextColor: colors.placeholder,
//   defaultValue: '',
//   returnKeyType: 'default',
//   multiline: false,
//   multilineHeight: wp(20),
//   autoCapitalize: null,
//   editable: true,
//   keyboardType: 'default',
//   maxLength: null,
//   secureTextEntry: false,
//   onFocus: null,
//   onBlur: null,
//   autoFocus: false,
//   textAlign: null,
//   onChangeText: null,
//   caretHidden: false,
//   contextMenuHidden: false,
//   selectTextOnFocus: false,
//   willCheckPosition: true,
// };

export default OutLine_TextInput

const styles = StyleSheet.create({})