import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import commonStyle, {fontSize, mediumFont} from '../../styles';
import {Button, FontText, Input} from '../../components';
import SvgIcons from '../../assets/SvgIcons';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {RootScreens} from '../../types/type';

const CardDetail = (props: any) => {
  const {navigation, closePress, btnClick} = props;

  const cardRef: any = useRef();
  const nameRef: any = useRef();
  const numberRef: any = useRef();
  const dateRef: any = useRef();
  const cvvRef: any = useRef();

  const [checkedData, setcheckedData] = useState({});
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [checkValid, setCheckValid] = useState(false);

  const isValidName = checkValid && name.length === 0;
  const isValidNumber =
    checkValid && (number.length === 0 || number.length < 16);
  const isValidDate = checkValid && date.length === 0;
  const isValidCvv = checkValid && (cvv.length === 0 || cvv.length < 3);

  const onClosePress = () => {
    setName('');
    setNumber('');
    setDate('');
    setCvv('');
    setCheckValid(false);
  };

  const fetchPaymentIntentClientSecret = async () => {
    // const response = await fetch(`${API_URL}/create-payment-intent`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     currency: 'usd',
    //   }),
    // });
    // const {clientSecret} = await response.json();

    // return clientSecret;

    // try {
    //   const cardDetails = {
    //     number: '4242424242424242', // Test card number
    //     expMonth: 11,
    //     expYear: 23,
    //     cvc: '123',
    //   };

    //   const token = await createToken();

    //   setPaymentToken(token); // Store the payment token

    //   // Send the token to your backend for processing
    //   await sendPaymentToServer(token.id);
    //   setPaymentStatus('Payment successful!');
    // } catch (error) {
    //   setPaymentStatus('Payment failed!');
    //   console.error('Error processing payment:', error);
    // }


  };

  const continuePress = async() => {
    setCheckValid(true);
    if (
      name.length !== 0 &&
      number.length !== 0 &&
      date.length !== 0 &&
      cvv.length !== 0
    ) {
      // navigation.navigate(RootScreens.OrderPlaced);
      btnClick();
      // const clientSecret = await fetchPaymentIntentClientSecret();
    }
  };

  return (
    <View style={commonStyle.container}>
      <View style={commonStyle.paddingH4}>
        <TouchableOpacity
          onPress={() => {
            onClosePress();
            closePress();
          }}>
          <SvgIcons.Close style={{alignSelf: 'flex-end', marginTop: hp(2)}} />
        </TouchableOpacity>
        <View style={styles.marginTopView}>
          <FontText
            name={'opensans-semibold'}
            size={mediumFont}
            color={'black2'}
            pLeft={wp(1)}
            pBottom={wp(2)}
            textAlign={'left'}>
            {'Card Holder name'}
          </FontText>
          <Input
            ref={nameRef}
            value={name}
            onChangeText={(text: string) => setName(text.trimStart())}
            autoCapitalize="none"
            placeholder={'Enter Card Holder name'}
            placeholderTextColor={'placeholder'}
            fontSize={fontSize}
            inputStyle={styles.inputText}
            color={'black'}
            returnKeyType={'next'}
            style={[styles.input]}
            onSubmit={() => {
              numberRef?.current.focus();
            }}
          />
          {isValidName && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">{`Card Holder Name is Required.`}</FontText>
          )}
        </View>
        <View style={styles.marginTopView}>
          <FontText
            name={'opensans-semibold'}
            size={mediumFont}
            color={'black2'}
            pLeft={wp(1)}
            pBottom={wp(2)}
            textAlign={'left'}>
            {'Card number'}
          </FontText>
          <Input
            ref={numberRef}
            value={number}
            onChangeText={(text: string) => setNumber(text.trimStart())}
            autoCapitalize="none"
            placeholder={'Enter Card number'}
            placeholderTextColor={'placeholder'}
            fontSize={fontSize}
            inputStyle={styles.inputText}
            color={'black'}
            returnKeyType={'next'}
            maxLength={16}
            keyboardType="numeric"
            style={[styles.input]}
            onSubmit={() => {
              dateRef?.current.focus();
            }}
          />
          {isValidNumber && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">{`Card Number is Required.`}</FontText>
          )}
        </View>
        <View style={[commonStyle.rowJB]}>
          <View style={styles.marginTopView}>
            <FontText
              name={'opensans-semibold'}
              size={mediumFont}
              color={'black2'}
              pLeft={wp(1)}
              pBottom={wp(2)}
              textAlign={'left'}>
              {'Expiry date'}
            </FontText>
            <Input
              ref={dateRef}
              value={date}
              onChangeText={(text: string) => setDate(text.trimStart())}
              autoCapitalize="none"
              placeholder={'Enter Expiry date'}
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              color={'black'}
              returnKeyType={'next'}
              style={[styles.input, {width: wp(43.5)}]}
              onSubmit={() => {
                cvvRef?.current.focus();
              }}
            />
            {isValidDate ? (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">{`Expiry date is Required.`}</FontText>
            ) : null}
          </View>
          <View style={[styles.marginTopView]}>
            <FontText
              name={'opensans-semibold'}
              size={mediumFont}
              color={'black2'}
              pLeft={wp(1)}
              pBottom={wp(2)}
              textAlign={'left'}>
              {'CVV'}
            </FontText>
            <Input
              ref={cvvRef}
              value={cvv}
              onChangeText={(text: string) => setCvv(text.trimStart())}
              autoCapitalize="none"
              placeholder={'Enter CVV'}
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              color={'black'}
              returnKeyType={'done'}
              keyboardType={'numeric'}
              maxLength={3}
              style={[styles.input, {width: wp(43.5)}]}
              blurOnSubmit
            />
            {isValidCvv ? (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">{`CVV is Required.`}</FontText>
            ) : null}
          </View>
        </View>
      </View>
      <Button
        onPress={continuePress}
        bgColor={'brown'}
        style={[styles.buttonContainer]}>
        <FontText name={'opensans-semibold'} size={fontSize} color={'white'}>
          {'Continue'}
        </FontText>
      </Button>
    </View>
  );
};

export default CardDetail;

const styles = StyleSheet.create({
  btSheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  inputText: {
    paddingLeft: wp(3),
    color: 'black',
    fontSize: normalize(12),
    fontFamily: 'opensans-medium',
    height: hp(5),
  },
  input: {
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: wp(1),
    // marginBottom: hp(2),
  },
  buttonContainer: {
    borderRadius: 12,
    width: '65%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp(4),
    // marginVertical: hp(5),
  },
  marginTopView: {
    marginTop: hp(1.5),
    height: hp(11),
  },
});
