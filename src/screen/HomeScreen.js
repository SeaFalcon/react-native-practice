import React, {useState} from 'react';
import {Text, TouchableOpacity, View, Modal, Button} from 'react-native';

import {
  FoodInformationModalStyles,
  HomeScreenStyles,
  ScreenStyles,
} from '../style/styles';
import {useSelector, useDispatch} from 'react-redux';
import FoodController from '../controller/FoodController';
import MealTimeSum from './MealTimeSum';
import {convertMealTime} from '../utils/functions';
import NuturitionBarChart from '../moduleComponent/NuturitionBarChart';
import {TextInput} from 'react-native-gesture-handler';
import {changeNuturitionGoal} from '../actions';

export default function HomeScreen() {
  const dispatch = useDispatch();

  const nuturition = useSelector((state) => state.nuturition);
  const {goal} = useSelector((state) => state.user);
  const meal = useSelector((state) => state.meal);

  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const [nuturitionInput, setNuturitionInput] = useState({
    calorie: goal.calorie,
    protein: goal.protein,
    phosphorus: goal.phosphorus,
    potassium: goal.potassium,
    sodium: goal.sodium,
  });

  const handlePressModal = () => {
    setIsOpen(!isOpen);
  };

  const handlePressMealButton = (num) => {
    console.log(num);
    let time = '';

    if (num === 0) {
      time = 'snack';
    } else if (num === 1) {
      time = 'breakfast';
    } else if (num === 2) {
      time = 'lunch';
    } else {
      time = 'dinner';
    }

    setCurrent(time);
  };

  const handleChangeNuturitionGoal = (name, value) => {
    setNuturitionInput({...nuturitionInput, [name]: value});
  };

  const handlePressUpdateGoal = (nuturitionGoal) => {
    dispatch(changeNuturitionGoal(nuturitionGoal));
    handlePressModal();
  };

  return (
    <View style={ScreenStyles.container}>
      <TouchableOpacity
        style={HomeScreenStyles.textViewContainer}
        onPress={() => handlePressModal()}>
        <Text style={HomeScreenStyles.textTitle}>오늘의 목표</Text>

        <Text style={HomeScreenStyles.textDetail}>
          열량 ({nuturition.calorie} kcal / {goal.calorie} kcal)
        </Text>
        <NuturitionBarChart nuturition={nuturition.calorie} />

        <Text
          style={{
            ...HomeScreenStyles.textDetail,
            ...HomeScreenStyles.textInterval,
          }}>
          단백질 ({nuturition.protein} g/ {goal.protein} g)
        </Text>
        <NuturitionBarChart nuturition={nuturition.protein} />

        <Text
          style={{
            ...HomeScreenStyles.textDetail,
            ...HomeScreenStyles.textInterval,
          }}>
          인 ({nuturition.phosphorus} mg / {goal.phosphorus} mg)
        </Text>
        <NuturitionBarChart nuturition={nuturition.phosphorus} />

        <Text
          style={{
            ...HomeScreenStyles.textDetail,
            ...HomeScreenStyles.textInterval,
          }}>
          칼륨 ({nuturition.potassium} mg / {goal.potassium} mg)
        </Text>
        <NuturitionBarChart nuturition={nuturition.potassium} />

        <Text
          style={{
            ...HomeScreenStyles.textDetail,
            ...HomeScreenStyles.textInterval,
          }}>
          나트륨 ({nuturition.sodium} mg / {goal.sodium} mg)
        </Text>
        <NuturitionBarChart nuturition={nuturition.sodium} />
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
            onPress={() => handlePressMealButton(0)}>
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
                  handleChangeNuturitionGoal('calorie', value);
                }}
              />
              <Text style={HomeScreenStyles.nuturitionTitle}>단백질</Text>
              <TextInput
                style={HomeScreenStyles.nuturitionInput}
                keyboardType="numeric"
                value={String(nuturitionInput.protein)}
                onChangeText={(value) => {
                  handleChangeNuturitionGoal('protein', value);
                }}
              />
              <Text style={HomeScreenStyles.nuturitionTitle}>인</Text>
              <TextInput
                style={HomeScreenStyles.nuturitionInput}
                keyboardType="numeric"
                value={String(nuturitionInput.phosphorus)}
                onChangeText={(value) => {
                  handleChangeNuturitionGoal('phosphorus', value);
                }}
              />
              <Text style={HomeScreenStyles.nuturitionTitle}>칼륨</Text>
              <TextInput
                style={HomeScreenStyles.nuturitionInput}
                keyboardType="numeric"
                value={String(nuturitionInput.potassium)}
                onChangeText={(value) => {
                  handleChangeNuturitionGoal('potassium', value);
                }}
              />
              <Text style={HomeScreenStyles.nuturitionTitle}>나트륨</Text>
              <TextInput
                style={HomeScreenStyles.nuturitionInput}
                keyboardType="numeric"
                value={String(nuturitionInput.sodium)}
                onChangeText={(value) => {
                  handleChangeNuturitionGoal('sodium', value);
                }}
              />
            </View>

            <View style={FoodInformationModalStyles.modalButtonContainer}>
              <Button
                title="수정"
                onPress={() => handlePressUpdateGoal(nuturitionInput)}
              />
              <Button title="닫기" onPress={() => handlePressModal()} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
