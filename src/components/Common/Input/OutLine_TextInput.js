import { StyleSheet, Text, View } from 'react-native'
import React, { createRef, useImperativeHandle, useState } from 'react'
import { Provider as PaperProvider, DefaultTheme, TextInput} from 'react-native-paper'
import { colors, fonts } from '../../../assets'
import { hp, normalize, wp } from '../../../styles/responsiveScreen'
import { FontText } from '../..'
import { mediumFont } from '../../../styles'

const OutLine_TextInput = ({value,secureTextEntry,label,right,editable,setValue,placeholder,fontSize,func,keyboardType,returnKeyLabel,fontName,color,returnKeyType,onSubmitEditing,multiline,height,multilineHeight,disabled,style}) => {


  const _inputStyle = {
    paddingBottom: multiline ? label==='Address' ? hp(0.6) :  multilineHeight : height,
    paddingTop:label==='Address' ? hp(1.2) : null,
    fontSize:fontSize,
    fontFamily: fonts[fontName],
    color: colors[color],
  };

  return (
    <TextInput
    disabled={disabled}
        mode="outlined"
        textAlign="center"
        keyboardType={keyboardType ? keyboardType : "default"}
        ref={func}
        multiline={multiline}
        dense
        placeholderTextColor={colors.placeholder}
        placeholder={placeholder}
        label={<FontText name={'mont-medium'} size={mediumFont}  color={'black2'}>{label}</FontText>}
        onSubmitEditing={onSubmitEditing}
        numberOfLines={multiline ? null : 1}
        returnKeyLabel={returnKeyLabel}
        textColor={colors.darkGray}
        outlineColor={colors.lightGray}
        selectionColor={colors.lightGray}
        returnKeyType={returnKeyType}
        value={value}
        activeOutlineColor={[colors.lightGray]}
        outlineStyle={[style ? style : {borderRadius:normalize(100)}]}
        contentStyle={_inputStyle}
        style={[{backgroundColor:"white",paddingLeft:wp(0.5)}]}
        editable={editable}
        onChangeText={setValue}
        right={right ? right : null}
        secureTextEntry={secureTextEntry}
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