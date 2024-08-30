import React, { useState } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerExample = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  console.log('show: ', show);

  const onChange = async(event, selectedDate) => {
    // console.log('selectedDate: ', selectedDate);
    // // Check if the event type is 'selectedDate' and not 'undefined'
    // if (selectedDate && event.type === 'set') {
    //   setDate(selectedDate);
    //   setShow(Platform.OS === 'ios');
    // } else {
    //   setShow(Platform.OS === 'ios');
    // }
    await setShow(false);
  };

  const showMode = () => {
    setShow(true);
  };
 

  return (
    <View>
      <Button onPress={showMode} title="Show Date Picker" />
      <Text>Selected Date: {date.toDateString()}</Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DatePickerExample;
