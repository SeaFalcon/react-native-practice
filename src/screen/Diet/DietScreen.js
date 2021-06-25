import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Button,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';
import NativeButton from 'apsl-react-native-button';
import {
  requestFoodRecord,
  requestRemoveFood,
  requestFoodRecordWithDate,
  requestDiets,
  requestAllDiets,
} from '../../actions';
import DietHeader from './DietHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SERVER_PATH} from '../../service/apis';
import Recommend from './recomend';
import {
  DietModalStyles,
  FoodInformationModalStyles,
  ScreenStyles,
} from '../../style/styles';
import FoodInformationModal from '../Search/firstTab/FoodInformationModal';

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
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
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
  const dispatch = useDispatch();
  const [btn, setBtn] = useState(1);
  const gender = useSelector((state) => state.user.gender);
  const kidneyType = useSelector((state) => state.user.kidneyType);
  const dietMeal = useSelector((state) => state.diet);
  const [isOpen, setIsOpen] = useState(false);
  const Alldiets = useSelector((state) => state.allDite);

  const convertMealTime = {
    1: 'breakfast',
    2: 'lunch',
    3: 'dinner',
    4: 'snack',
  };
  useEffect(() => {
    dispatch(requestAllDiets(kidneyType, gender)),
      dispatch(requestDiets(kidneyType, gender));
  }, []);

  const handlePressModal = () => {
    setIsOpen(!isOpen);
    isOpen === true ? dispatch(requestAllDiets(kidneyType, gender)) : null;
  };

  return (
    <View>
      <ScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              marginTop: 15,
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
            오늘의 추천식단
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <NativeButton
            style={{
              width: 150,
              height: 30,
              backgroundColor: 'yellow',
              alignSelf: 'center',
            }}
            onPress={() => handlePressModal()}>
            다른추천식단보기
          </NativeButton>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{marginRight: 3}}>
            <NativeButton
              style={{
                margin: 3,
                width: 50,
                height: 30,
                backgroundColor: btn === 1 ? 'skyblue' : 'white',
              }}
              onPress={() => setBtn(1)}>
              아침
            </NativeButton>
          </View>
          <View style={{marginRight: 3}}>
            <NativeButton
              style={{
                margin: 3,
                width: 50,
                height: 30,
                backgroundColor: btn === 2 ? 'skyblue' : 'white',
              }}
              onPress={() => setBtn(2)}>
              점심
            </NativeButton>
          </View>
          <View style={{marginRight: 3}}>
            <NativeButton
              style={{
                margin: 3,
                width: 50,
                height: 30,
                backgroundColor: btn === 3 ? 'skyblue' : 'white',
              }}
              onPress={() => setBtn(3)}>
              저녁
            </NativeButton>
          </View>

          <View style={{marginRight: 3}}>
            <NativeButton
              style={{
                margin: 3,
                width: 50,
                height: 30,
                backgroundColor: btn === 4 ? 'skyblue' : 'white',
              }}
              onPress={() => setBtn(4)}>
              간식
            </NativeButton>
          </View>
        </View>

        {/* <Recommend2 btn={btn} gender={gender} kidneyType={kidneyType} /> */}

        <Recommend
          btn={btn}
          gender={gender}
          kidneyType={kidneyType}
          //nutrition={{calorie, protein, phosphorus, potassium, sodium}}
        />
      </ScrollView>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handlePressModal}>
        <View style={DietModalStyles.modalViewContainer}>
          <View style={DietModalStyles.modalView}>
            <View style={DietModalStyles.modalContent}>
              <ScrollView>
                {Object.keys(Alldiets).map((key, i) => {
                  return (
                    <View style={{margin: 20}} key={key + i}>
                      <TouchableOpacity style={{backgroundColor: 'skyblue'}}>
                        <Text>아침: {Alldiets[key]?.['breakfast']} </Text>
                        <Text>점심: {Alldiets[key]?.['lunch']}</Text>
                        <Text>저녁: {Alldiets[key]?.['dinner']}</Text>
                        <Text>간식: {Alldiets[key]?.['snack']}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
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
