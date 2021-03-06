import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {useState} from 'react/cjs/react.development';
import {DialysisScreenStyle} from '../../../style/styles';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import NativeButton from 'apsl-react-native-button';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeDialysis,
  setError,
  fetchMemos,
  removeDialysisMemo,
  updateGeneralDialysisMemo,
  clearDialysis,
  getItem,
} from '../../../actions';
import {useEffect} from 'react/cjs/react.development';
import errors from '../../../utils/errors';
import DateTimePicker from '@react-native-community/datetimepicker';
import SplashScreen from '../../SplashScreen';

export default function UpdateGeneralDialysis({
  navigation,
  route: {
    params: {item},
  },
}) {
  const dispatch = useDispatch();

  const error = useSelector((state) => state.error);
  const dialysis = useSelector((state) => state.dialysis);

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [photo, setPhoto] = useState(item.image);
  const [exchangeTime, setExchangeTime] = useState(new Date(item.exchangeTime));
  const kidneyType = useSelector((state) => state.user.kidneyType);

  const [hour, setHour] = useState(exchangeTime.getHours());
  const [min, setMin] = useState(exchangeTime.getMinutes());
  const [isLoding, setIsLoding] = useState(true);

  if (isLoding) {
    dialysis.degrees = item.degrees;
    dialysis.exchangeTime = item.exchangeTime;
    dialysis.injectionConcentration = item.injectionConcentration;
    dialysis.injectionAmount = item.injectionAmount;
    dialysis.drainage = item.drainage;
    dialysis.dehydration = item.dehydration;
    dialysis.weight = item.weight;
    dialysis.bloodPressure = item.bloodPressure;
    dialysis.bloodSugar = item.bloodSugar;
    dialysis.edema = item.edema;
    dialysis.memo = item.name;
    setIsLoding(false);
  }

  let time = `${hour}시 ${min}분`;

  function handleChangDialysis(name, value) {
    dispatch(changeDialysis(name, value));
  }

  const handlePressShowImagePicker = () => {
    Alert.alert('선택해주세요', '', [
      {
        text: '사진 찍기',
        onPress: () => Alert.alert('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: '갤러리에서 불러오기',
        onPress: () => {
          launchImageLibrary({}, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
              Alert.alert(response.customButton);
            } else {
              setPhoto(response);
            }
          });
        },
        style: 'cancel',
      },
      {
        text: '닫기',
        style: 'cancel',
      },
    ]);
  };

  const handlePressUpdateMemo = () => {
    dispatch(
      updateGeneralDialysisMemo({
        dialysisId: item.dialysisId,
        image: photo,
        dialysis,
      }),
    );
  };

  const handlePressDeleteMemo = () => {
    Alert.alert('삭제', '정말 삭제하시겠습니까?', [
      {
        text: '삭제',
        onPress: () => {
          const dialysisId = item.dialysisId;
          dispatch(removeDialysisMemo(dialysisId));
        },
      },
      {text: '취소'},
    ]);
    if (error.status && error.name === errors.DELETE_DIALYSIS_MEMOS_FAILED) {
      Alert.alert('메모 삭제 실패! 다시 시도해주세요. ', errors.message);
      dispatch(setError());
    }

    if (!error.status && error.name === errors.DELETE_DIALYSIS_MEMOS_SUCCESS) {
      dispatch(clearDialysis());
      dispatch(fetchMemos(item.date, kidneyType));
      navigation.navigate('Calendar');
      dispatch(setError());
    }
  };

  function handleBack() {
    dispatch(clearDialysis());
    navigation.navigate('Calendar');
  }

  useEffect(() => {
    if (error.status && error.name === errors.UPDATE_DIALYSIS_MEMOS_FAILED) {
      Alert.alert('메모 수정 실패', errors.message);
      dispatch(setError());
    }

    if (error.status && error.name === errors.UPDATE_DIALYSIS_MEMOS_ERROR) {
      Alert.alert(
        '오류 발생',
        '메모 작성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
      );
      dispatch(setError());
    }

    if (!error.status && error.name === errors.LOADING) {
      // Alert.alert('로딩 중', '사진이 업로드될때까지 잠시 기다려주세요...');
    }

    if (!error.status && error.name === errors.UPDATE_DIALYSIS_MEMOS_SUCCESS) {
      navigation.navigate('Calendar');
      dispatch(fetchMemos(item.date, kidneyType));
      dispatch(setError());
    }
  }, [error]);

  if (!error.status && error.name === errors.LOADING) {
    return <SplashScreen />;
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setExchangeTime(currentDate);
    setHour(currentDate.getHours());
    setMin(currentDate.getMinutes());
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <View
          style={{
            margin: 20,
            borderColor: 'red',
            borderWidth: 2,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 25,
          }}>
          <Text>{item.date}</Text>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
            }}>
            [일반복막투석] 총 제수량 차트
          </Text>
        </View>
        <ScrollView>
          <View style={{justifyContent: 'center', marginLeft: 20}}>
            <View
              style={{
                alignItems: 'center',
                width: '100%',
                flexDirection: 'row',
              }}>
              <TextInput
                style={{
                  width: '10%',
                  backgroundColor: 'white',
                  height: 35,
                  paddingHorizontal: 10,
                  fontSize: 10,
                  fontWeight: 'bold',
                  marginBottom: '1%',
                  marginRight: '5%',
                  borderWidth: 1,
                  borderColor: 'blue',
                }}
                keyboardType="numeric"
                value={String(dialysis.degrees)}
                onChangeText={(value) => handleChangDialysis('degrees', value)}
              />
              <Text>차</Text>
            </View>
            <View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={exchangeTime}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>
            <View style={DialysisScreenStyle.basicView}>
              <Text>교환시간 : </Text>

              <NativeButton
                style={{backgroundColor: 'white', width: 100}}
                onPress={showTimepicker}>
                {time}
              </NativeButton>
            </View>
            <View style={DialysisScreenStyle.basicView}>
              <Text>주입액 농도: </Text>
              <TextInput
                style={DialysisScreenStyle.basicTextInput}
                keyboardType="numeric"
                value={String(dialysis.injectionConcentration)}
                onChangeText={(value) =>
                  handleChangDialysis('injectionConcentration', value)
                }
              />
              <Text>%</Text>
            </View>
            <View style={DialysisScreenStyle.basicView}>
              <Text>주입량 : </Text>
              <TextInput
                style={DialysisScreenStyle.basicTextInput}
                keyboardType="numeric"
                value={String(dialysis.injectionAmount)}
                onChangeText={(value) =>
                  handleChangDialysis('injectionAmount', value)
                }
              />
              <Text>g</Text>
            </View>

            <View style={DialysisScreenStyle.basicView}>
              <Text>배액량 : </Text>
              <TextInput
                style={DialysisScreenStyle.basicTextInput}
                keyboardType="numeric"
                value={String(dialysis.drainage)}
                onChangeText={(value) => handleChangDialysis('drainage', value)}
              />
              <Text>g</Text>
            </View>

            <View style={DialysisScreenStyle.basicView}>
              <Text>제수량 : </Text>
              <TextInput
                style={DialysisScreenStyle.basicTextInput}
                keyboardType="numeric"
                value={String(dialysis.dehydration)}
                onChangeText={(value) =>
                  handleChangDialysis('dehydration', value)
                }
              />
              <Text>g</Text>
            </View>

            <View style={DialysisScreenStyle.basicView}>
              <Text>몸무게 : </Text>
              <TextInput
                style={DialysisScreenStyle.basicTextInput}
                keyboardType="numeric"
                value={String(dialysis.weight)}
                onChangeText={(value) => handleChangDialysis('weight', value)}
              />
              <Text>kg</Text>
            </View>
            <View style={DialysisScreenStyle.basicView}>
              <Text>혈압 : </Text>
              <TextInput
                style={DialysisScreenStyle.basicTextInput}
                keyboardType="numeric"
                value={String(dialysis.bloodPressure)}
                onChangeText={(value) =>
                  handleChangDialysis('bloodPressure', value)
                }
              />
              <Text>g</Text>
            </View>

            <View style={DialysisScreenStyle.basicView}>
              <Text>혈당 : </Text>
              <TextInput
                style={DialysisScreenStyle.basicTextInput}
                keyboardType="numeric"
                value={String(dialysis.bloodSugar)}
                onChangeText={(value) =>
                  handleChangDialysis('bloodSugar', value)
                }
              />
              <Text>g</Text>
            </View>

            <View style={DialysisScreenStyle.basicView}>
              <Text>부종 : </Text>
              <NativeButton
                style={DialysisScreenStyle.buttonContent(dialysis.edema)}
                onPress={() => {
                  handleChangDialysis('edema', '1');
                  console.log(dialysis.edema);
                }}>
                O
              </NativeButton>
              <NativeButton
                style={DialysisScreenStyle.buttonContent2(dialysis.edema)}
                onPress={() => {
                  handleChangDialysis('edema', '2');
                  //console.log(edema);
                }}>
                X
              </NativeButton>
            </View>

            <View style={{marginTop: 30, marginBottom: 30}}>
              <Text>갤러리</Text>

              <TouchableOpacity
                style={{
                  width: '80%',
                  borderRadius: 20,
                  height: 300,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'skyblue',
                }}
                onPress={() => handlePressShowImagePicker()}>
                {photo ? (
                  <Image
                    source={{
                      uri: photo && photo.uri ? photo.uri : photo,
                    }}
                    style={{
                      resizeMode: 'stretch',
                      borderRadius: 20,
                      width: '100%',
                      height: 300,
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: 'white',
                    }}>
                    사진 첨부하기
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <Text>메모 </Text>
            <View style={DialysisScreenStyle.basicView}>
              <TextInput
                style={{
                  width: '95%',
                  backgroundColor: 'white',
                  height: 100,
                  paddingHorizontal: 10,
                  fontSize: 16,
                  marginBottom: '1%',
                  marginRight: '5%',
                  borderWidth: 1,
                  borderColor: 'black',
                }}
                placeholder={item.memo}
                value={String(dialysis.memo)}
                onChangeText={(value) => handleChangDialysis('memo', value)}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <NativeButton
                style={{
                  margin: 10,
                  width: 180,
                }}
                onPress={() => {
                  console.log('1. 수정하기 버튼 클릭됨');
                  handlePressUpdateMemo();
                }}>
                수정하기
              </NativeButton>
              <NativeButton
                style={{
                  margin: 10,
                  width: 180,
                }}
                onPress={() => {
                  console.log('1. 지우기 버튼 클릭됨');
                  handlePressDeleteMemo();
                }}>
                지우기
              </NativeButton>
            </View>
            <Button
              title="뒤로가기"
              onPress={() => {
                handleBack();
              }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
