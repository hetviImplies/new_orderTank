import React, {
  createRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {View, TextInput, StyleSheet, findNodeHandle} from 'react-native';
import {colors, fonts} from '../../../assets';
import {hp, normalize, wp} from '../../../styles/responsiveScreen';
import { mediumFont } from '../../../styles';

const Input = forwardRef(
  (
    {
      value,
      editable,
      height,
      fontSize,
      fontName,
      color,
      placeholder,
      placeholderTextColor,
      blurOnSubmit,
      returnKeyType,
      multiline,
      multilineHeight,
      keyboardType,
      autoCapitalize,
      maxLength,
      secureTextEntry,
      inputStyle,
      children,
      style,
      onFocus,
      onBlur,
      autoFocus,
      textAlign,
      caretHidden,
      contextMenuHidden,
      selectTextOnFocus,
      pointerEvents,
      onSubmit,
      clearOnSubmit,
      willCheckPosition,
      checkPosition,
      onChangeText,
      onEndEditing,
      onKeyPress,
      autoCorrect,
      scrollEnabled,
      onContentSizeChange,
      eyePress,
      eye,
      checkEye,
      search,
    }: any,
    ref,
  ) => {
    const [inputValue, setValue] = useState(value);
    const [inputEditable, setEditable] = useState(editable);
    let inputRef: any = createRef();

    const onChangeTextHandler = (text: string) => {
      setValue(text);
      if (typeof onChangeText === 'function') {
        onChangeText(text);
      }
    };

    const onSubmitEditingHandler = () => {
      if (typeof onSubmit === 'function') {
        onSubmit(inputValue);
      }
      if (clearOnSubmit) {
        setValue('');
      }
    };

    const onFocusHandler = () => {
      if (typeof onFocus === 'function') {
        onFocus();
      }
      if (willCheckPosition && typeof checkPosition === 'function') {
        checkPosition(findNodeHandle(inputRef));
      }
    }

    const _inputStyle = {
      height: multiline ? multilineHeight : height,
      fontSize,
      fontFamily: fonts[fontName],
      color: colors[color],
    };

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.focus(),
      blur: () => inputRef.blur(),
      disable: () => setEditable(false),
      enable: () => setEditable(true),
    }));

    return (
      <View style={[styles.wrapper, style]}>
        <TextInput
          ref={el => {
            inputRef = el;
          }}
          textContentType="none"
          pointerEvents={pointerEvents}
          editable={editable}
          value={value}
          textAlign={textAlign}
          autoComplete="off"
          autoCorrect={!!(autoCorrect && autoCorrect === true)}
          allowFontScaling={false}
          placeholder={placeholder}
          placeholderTextColor={
            placeholderTextColor ? colors[placeholderTextColor] : ''
          }
          onChangeText={onChangeTextHandler}
          onSubmitEditing={onSubmitEditingHandler}
          blurOnSubmit={multiline ? false : blurOnSubmit}
          returnKeyType={returnKeyType}
          multiline={multiline}
          underlineColorAndroid="transparent"
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          onFocus={onFocusHandler}
          onBlur={onBlur}
          onEndEditing={onEndEditing}
          autoFocus={autoFocus}
          caretHidden={caretHidden}
          contextMenuHidden={contextMenuHidden}
          selectTextOnFocus={selectTextOnFocus}
          onKeyPress={onKeyPress}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={onContentSizeChange}
          style={[
            multiline ? styles.inputMultiline : null,
            styles.input,
            _inputStyle,
            inputStyle,
          {backgroundColor:color.white,fontSize:mediumFont,paddingRight:wp(13)}]}
        />
        {children}
      </View>
    );
  },
);

Input.defaultProps = {
  height: 46,
  fontSize: normalize(16),
  fontName: 'default',
  color: 'default',
  placeholder: 'Type something...',
  placeholderTextColor: colors.placeholder,
  defaultValue: '',
  clearOnSubmit: false,
  blurOnSubmit: false,
  returnKeyType: 'default',
  multiline: false,
  multilineHeight: wp(20),
  autoCapitalize: null,
  editable: true,
  keyboardType: 'default',
  maxLength: null,
  secureTextEntry: false,
  onFocus: null,
  onBlur: null,
  autoFocus: false,
  textAlign: null,
  onChangeText: null,
  caretHidden: false,
  contextMenuHidden: false,
  selectTextOnFocus: false,
  willCheckPosition: true,
};

const styles = StyleSheet.create({
  input: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.white,
    // paddingTop: 0,
    // paddingBottom: 0,
    // marginLeft: 0,
    // marginRight: 0,
    width: '100%',
    borderWidth:1,
    borderColor:colors.lightGray
  },
  inputMultiline: {
    textAlignVertical: 'top',

  },
  wrapper: {
    width: '100%',
    // justifyContent: 'center',
  },
});

export default Input;
