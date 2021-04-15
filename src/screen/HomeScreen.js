import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Button,
  Linking,
} from 'react-native';

import {
  FoodInformationModalStyles,
  HomeScreenStyles,
  ScreenStyles,
} from '../style/styles';
import {useSelector, useDispatch} from 'react-redux';
import NuturitionBarChart from '../moduleComponent/NuturitionBarChart';
import {TextInput} from 'react-native-gesture-handler';
import {changeNuturitionGoal, requestUpdateNuturitionGoal} from '../actions';
import SearchResult from './Search/firstTab/SearchResult';
import {Route} from 'react-router';

export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();

  const nuturition = useSelector((state) => state.nuturition);
  const {goal} = useSelector((state) => state.user);
  const meal = useSelector((state) => state.meal);

  const [comp, setComp] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const [nuturitionInput, setNuturitionInput] = useState({
    calorie: goal.calorie,
    protein: goal.protein,
    phosphorus: goal.phosphorus,
    potassium: goal.potassium,
    sodium: goal.sodium,
  });

  //const moring = meal.map((meals, key) =>meal.)
  const handlePressModal = () => {
    setIsOpen(!isOpen);
  };

  const handlePressMealButton = (num) => {
    console.log(num);
    if (num === 1) {
      if (!meal.breakfast.length) {
        navigation.navigate('검색');
        console.log('breakfast size : ' + meal.breakfast.length); // 무언가 들어있으면 아무것도 안뜬다.. 즉 meal.breakfast.length !== null 일때 contentScreen으로 ...
      }
    } else if (num === 2) {
      if (!meal.lunch.length) {
        console.log('lunch size : ' + meal.lunch.length);
      }
    } else if (num === 3) {
      if (!meal.dinner.length) {
        console.log('dinner size : ' + meal.dinner.length);
      }
    } else if (num === 4) {
      if (!meal.snack.length) {
        console.log('snack size : ' + meal.snack.length);
      }
    }
    navigation.navigate('식단');
  };

  const handleChangeNuturitionGoal = (name, value) => {
    value = Number(value);
    setNuturitionInput({...nuturitionInput, [name]: value});
  };

  const nuturitionFun = async (nuturitionGoal) => {
    await dispatch(
      requestUpdateNuturitionGoal({
        calorie: nuturitionGoal.calorie,
        protein: nuturitionGoal.protein,
        phosphorus: nuturitionGoal.phosphorus,
        potassium: nuturitionGoal.potassium,
        sodium: nuturitionGoal.sodium,
      }),
    );
  };

  const handlePressUpdateGoal = async (nuturitionGoal) => {
    await nuturitionFun(nuturitionGoal);
    await dispatch(changeNuturitionGoal(nuturitionGoal));
    console.log('nutiritionGoal ' + nuturitionGoal.protein);

    await handlePressModal();
    await setNuturitionInput({
      calorie: nuturitionGoal.calorie,
      protein: nuturitionGoal.protein,
      phosphorus: nuturitionGoal.phosphorus,
      potassium: nuturitionGoal.potassium,
      sodium: nuturitionGoal.sodium,
    });
  };

  const handlePressNonUpdateGoal = () => {
    setNuturitionInput({
      calorie: goal.calorie,
      protein: goal.protein,
      phosphorus: goal.phosphorus,
      potassium: goal.potassium,
      sodium: goal.sodium,
    });
    handlePressModal();
  };

  return (
    <View style={ScreenStyles.container}>
      <TouchableOpacity
        style={HomeScreenStyles.textViewContainer}
        onPress={() => handlePressModal()}>
        <Text style={HomeScreenStyles.textTitle}>오늘의 목표</Text>

        <Text style={HomeScreenStyles.textDetail}>
          열량 ({nuturition.calorie} kcal / {goal?.calorie} kcal)
        </Text>
        <NuturitionBarChart
          nuturition={nuturition.calorie}
          goal={goal?.calorie}
        />

        <Text
          style={{
            ...HomeScreenStyles.textDetail,
            ...HomeScreenStyles.textInterval,
          }}>
          단백질 ({nuturition.protein} g/ {goal?.protein} g)
        </Text>
        <NuturitionBarChart
          nuturition={nuturition.protein}
          goal={goal?.protein}
        />

        <Text
          style={{
            ...HomeScreenStyles.textDetail,
            ...HomeScreenStyles.textInterval,
          }}>
          인 ({nuturition.phosphorus} mg / {goal?.phosphorus} mg)
        </Text>
        <NuturitionBarChart
          nuturition={nuturition.phosphorus}
          goal={goal?.phosphorus}
        />

        <Text
          style={{
            ...HomeScreenStyles.textDetail,
            ...HomeScreenStyles.textInterval,
          }}>
          칼륨 ({nuturition.potassium} mg / {goal?.potassium} mg)
        </Text>

        <NuturitionBarChart
          nuturition={nuturition.potassium}
          goal={goal?.potassium}
        />

        <Text
          style={{
            ...HomeScreenStyles.textDetail,
            ...HomeScreenStyles.textInterval,
          }}>
          나트륨 ({nuturition.sodium} mg / {goal?.sodium} mg)
        </Text>
        <NuturitionBarChart
          nuturition={nuturition.sodium}
          goal={goal?.sodium}
        />
      </TouchableOpacity>

      <View style={HomeScreenStyles.mealButtonView}>
        <View style={HomeScreenStyles.mealButtonContainer}>
          <TouchableOpacity
            style={HomeScreenStyles.mealButton}
            onPress={() => handlePressMealButton(1)}>
            <Text style={HomeScreenStyles.mealButtonText}>아침</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={HomeScreenStyles.mealButton}
            onPress={() => handlePressMealButton(2)}>
            <Text style={HomeScreenStyles.mealButtonText}>점심</Text>
          </TouchableOpacity>
        </View>
        <View style={HomeScreenStyles.mealButtonContainer}>
          <TouchableOpacity
            style={HomeScreenStyles.mealButton}
            onPress={() => handlePressMealButton(3)}>
            <Text style={HomeScreenStyles.mealButtonText}>저녁</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={HomeScreenStyles.mealButton}
            onPress={() => navigation.navigete('MyDiet')}>
            <Text style={HomeScreenStyles.mealButtonText}>간식</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handlePressModal}>
        <View style={FoodInformationModalStyles.modalViewContainer}>
          <View style={FoodInformationModalStyles.modalView}>
            <View style={HomeScreenStyles.nuturitionInputContainer}>
              <Text style={HomeScreenStyles.nuturitionInputSubject}>
                목표 섭취량 조절하기
              </Text>
              <Text style={HomeScreenStyles.nuturitionTitle}>열량</Text>
              <TextInput
                style={HomeScreenStyles.nuturitionInput}
                keyboardType="numeric"
                value={String(nuturitionInput.calorie)}
                onChangeText={(value) => {
                  handleChangeNuturitionGoal(
                    'calorie',
                    value.replace(/[^0-9]/g, ''),
                  );
                }}
              />
              <Text style={HomeScreenStyles.nuturitionTitle}>단백질</Text>
              <TextInput
                style={HomeScreenStyles.nuturitionInput}
                keyboardType="numeric"
                value={String(nuturitionInput.protein)}
                onChangeText={(value) => {
                  handleChangeNuturitionGoal(
                    'protein',
                    value.replace(/[^0-9]/g, ''),
                  );
                }}
              />
              <Text style={HomeScreenStyles.nuturitionTitle}>인</Text>
              <TextInput
                style={HomeScreenStyles.nuturitionInput}
                keyboardType="numeric"
                value={String(nuturitionInput.phosphorus)}
                onChangeText={(value) => {
                  handleChangeNuturitionGoal(
                    'phosphorus',
                    value.replace(/[^0-9]/g, ''),
                  );
                }}
              />
              <Text style={HomeScreenStyles.nuturitionTitle}>칼륨</Text>
              <TextInput
                style={HomeScreenStyles.nuturitionInput}
                keyboardType="numeric"
                value={String(nuturitionInput.potassium)}
                onChangeText={(value) => {
                  handleChangeNuturitionGoal(
                    'potassium',
                    value.replace(/[^0-9]/g, ''),
                  );
                }}
              />
              <Text style={HomeScreenStyles.nuturitionTitle}>나트륨</Text>
              <TextInput
                style={HomeScreenStyles.nuturitionInput}
                keyboardType="numeric"
                value={String(nuturitionInput.sodium)}
                onChangeText={(value) => {
                  handleChangeNuturitionGoal(
                    'sodium',
                    value.replace(/[^0-9]/g, ''),
                  );
                }}
              />
            </View>

            <View style={FoodInformationModalStyles.modalButtonContainer}>
              <Button
                title="수정"
                onPress={() => handlePressUpdateGoal(nuturitionInput)}
              />
              <Button title="취소" onPress={() => handlePressNonUpdateGoal()} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
