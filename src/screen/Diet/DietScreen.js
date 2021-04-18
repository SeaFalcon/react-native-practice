import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Button,
  Platform,
  ScrollView,
} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';
import NativeButton from 'apsl-react-native-button';
import {
  requestFoodRecord,
  requestRemoveFood,
  requestFoodRecordWithDate,
} from '../../actions';
import DietHeader from './DietHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SERVER_PATH} from '../../service/apis';

const Tab = createMaterialTopTabNavigator();

function MyDiet({navigation}) {
  const dispatch = useDispatch();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const goal = useSelector((state) => state.user.goal);
  const dateMeal = useSelector((state) => state.dateMeal);

  let today = `${year}년 ${month}월 ${day}일`;
  let formattedToday = `${year}-${month}-${day}`;

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setYear(currentDate.getFullYear());
    setMonth(currentDate.getMonth() + 1);
    setDay(currentDate.getDate());

    const formattedSelectedDate = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;

    dispatch(requestFoodRecordWithDate(formattedSelectedDate));

    setShow(!show);
  };

  const showMode = (currentMode) => {
    setShow(!show);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  useEffect(() => {
    dispatch(requestFoodRecordWithDate(formattedToday));
  }, []);

  return (
    <View>
      <View>
        <View>
          <Button
            style={{color: 'yellow'}}
            onPress={() => showDatepicker()}
            title={today}
          />
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            display="inline"
            onChange={onChange}
          />
        )}
      </View>

      <NativeButton
        style={{
          margin: 10,
        }}
        onPress={() => navigation.navigate('검색')}>
        추가하기
      </NativeButton>

      <ScrollView>
        <DietHeader meal={dateMeal} goal={goal} date={formattedToday} />
      </ScrollView>
    </View>
  );
}

function RecommendDiet() {
  return (
    <View>
      <Text />
    </View>
  );
}

export default function DietScreen() {
  return (
    <Tab.Navigator
      initialRouteName="MyDiet"
      tabBarOptions={{
        activeTintColor: 'black',
        labelStyle: {fontSize: 20, fontWeight: 'bold'},
        style: {backgroundColor: 'powderblue'},
      }}>
      <Tab.Screen
        name="MyDiet"
        component={MyDiet}
        options={{tabBarLabel: '내 식단'}}
      />
      <Tab.Screen
        name="RecommendDiet"
        component={RecommendDiet}
        options={{tabBarLabel: '추천식단'}}
      />
    </Tab.Navigator>
  );
}
