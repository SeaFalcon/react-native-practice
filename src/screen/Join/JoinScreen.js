import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
  Platform,
  Button,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {changeJoinField, logout, setKakaoUser} from '../../actions';
import {JoinScreenStyles, ScreenStyles} from '../../style/styles';
import NativeButton from 'apsl-react-native-button';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-date-picker';
import {pickerItems} from '../../../assets/data/pickerData';
import {getTwoDigits} from '../../utils/functions';
import {SERVER_PATH} from '../../service/apis';
import errors from '../../utils/errors';
import RNRestart from 'react-native-restart';
import Picker from '@gregfrench/react-native-wheel-picker';

export default function JoinScreen({
  navigation,
  route: {params: {userInfo, accessToken} = {}} = {},
}) {
  const dispatch = useDispatch();

  const error = useSelector((state) => state.error);
  const email = useSelector((state) => state.JoinFields.email);
  const password = useSelector((state) => state.JoinFields.password);
  const nickname = useSelector((state) => state.JoinFields.nickname);
  const height = useSelector((state) => state.JoinFields.height);
  const weight = useSelector((state) => state.JoinFields.weight);
  const gender = useSelector((state) => state.JoinFields.gender);
  const birth = useSelector((state) => state.JoinFields.birth);
  const kidneyType = useSelector((state) => state.JoinFields.kidneyType);
  const activityId = useSelector((state) => state.JoinFields.activityId);
  const password2 = useSelector((state) => state.JoinFields.password2);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const kidneyTypes = [
    {label: '투석전단계<신증후군>', value: 1},
    {label: '투석전단계<만성신부전>', value: 2},
    {label: '신장이식<신장이식후~8주>', value: 3},
    {label: '신장이식<신장이식8주후>', value: 4},
    {label: '혈액투석', value: 5},
    {label: '복막투석', value: 6},
    {label: '해당없음', value: 7},
  ];

  var PickerItem = Picker.Item;

  const [date, setDate] = useState(new Date('1980-01-01'));

  function handleChangJoinField(name, value) {
    dispatch(changeJoinField(name, value));
  }

  function handleGenderField() {
    dispatch(changeJoinField('gender', 'M'));
    console.log(gender);
  }

  function handleGenderField2() {
    dispatch(changeJoinField('gender', 'F'));
    console.log(gender);
  }

  function handlePressSetDate() {
    dispatch(
      changeJoinField(
        'birth',
        date.getFullYear() +
          '-' +
          getTwoDigits(+date.getMonth() + 1) +
          '-' +
          getTwoDigits(date.getDate()),
      ),
    );
  }

  // function handelPressEmailCheck() {
  //   if (!email) {
  //     return Alert.alert('이메일 오류', '이메일을 입력하세요.');
  //   }
  //   fetch(SERVER_PATH + '/Emailcheck', {
  //     headers: {'Content-Type': 'application/json'},
  //     method: 'POST',
  //     mode: 'cors',
  //     credentials: 'include',
  //     body: JSON.stringify({
  //       email,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((response) => {
  //       if (response.isSuccess === false) {
  //         return Alert.alert('중복', '중복된 이메일입니다.');
  //       } else {
  //         return Alert.alert('사용가능', '사용가능 이메일 입니다.');
  //       }
  //     })
  //     .catch((fetchErr) => {
  //       return Alert.alert(
  //         '이메일 중복 확인 에러',
  //         '이메일 중복 확인 중 에러가 발생했습니다. \n 잠시 후 다시 시도해주세요',
  //       );
  //     });
  // }

  function handelPressEmailCheck() {
    if (!email) {
      return Alert.alert('이메일 오류', '이메일을 입력하세요. ');
    }

    fetch(SERVER_PATH + '/EmailValidation', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.isSuccess === false) {
          return Alert.alert('중복', '중복된 이메일입니다.');
        } else {
          return Alert.alert('사용가능', '사용가능 이메일 입니다.');
        }
      })
      .catch((fetchErr) => {
        return Alert.alert(
          '이메일 중복 확인 에러',
          '이메일 중복 확인 중 에러가 발생했습니다. \n 잠시 후 다시 시도해주세요',
        );
      });
  }

  function handelPressNickNameCheck() {
    if (!nickname) {
      return Alert.alert('닉네임 오류', '닉네임을 입력하세요.');
    }
    fetch(SERVER_PATH + '/nicknameCheck', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        nickname,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.isSuccess === false) {
          return Alert.alert('중복', '중복된 닉네임입니다.');
        } else {
          return Alert.alert('사용가능', '사용가능 닉네임 입니다.');
        }
      })
      .catch((fetchErr) => {
        return Alert.alert(
          '닉네임 중복 확인 에러',
          '닉네임 중복 확인 중 에러가 발생했습니다. \n 잠시 후 다시 시도해주세요',
        );
      });
  }

  function handlePressJoin() {
    if (password !== password2) {
      return Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
    }
    if (
      !email ||
      !password ||
      !nickname ||
      !height ||
      !weight ||
      !gender ||
      !birth ||
      !kidneyType ||
      !activityId
    ) {
      return Alert.alert('회원가입 오류', '기입 하지 않은 부분이 있습니다.');
    }
    fetch(SERVER_PATH + '/user', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
        nickname,
        height,
        weight,
        gender,
        kidneyType,
        birth,
        activityId,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.isSuccess === false) {
          return Alert.alert('오류', response.message);
        } else {
          handleChangJoinField('email', '');
          handleChangJoinField('password', '');
          handleChangJoinField('password2', '');
          handleChangJoinField('nickname', '');
          handleChangJoinField('height', '');
          handleChangJoinField('weight', '');
          handleChangJoinField('gender', '');
          handleChangJoinField('birth', '');
          handleChangJoinField('kidneyType', '');
          handleChangJoinField('activityId', '');
          return navigation.navigate('JoinCompleteScreen');
        }
      });
  }

  function handlePressKakaoJoin() {
    if (!height || !weight || !gender || !birth || !kidneyType || !activityId) {
      return Alert.alert('회원가입 오류', '기입 하지 않은 부분이 있습니다.');
    }

    fetch(SERVER_PATH + '/user/kakao', {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': accessToken,
      },
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        height,
        weight,
        gender,
        kidneyType,
        birth,
        activityId,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.isSuccess === false) {
          return Alert.alert('오류', response.message);
        } else {
          dispatch(
            setKakaoUser({
              ...userInfo,
              height,
              weight,
              gender,
              kidneyType,
              age: new Date().getFullYear() - new Date(birth).getFullYear(),
              activityId,
            }),
          );
          handleChangJoinField('height', 0);
          handleChangJoinField('weight', 0);
          handleChangJoinField('gender', null);
          handleChangJoinField('birth', null);
          handleChangJoinField('kidneyType', null);
          handleChangJoinField('activityId', null);
        }
      });
  }

  useEffect(() => {
    if (error.status && error.name === errors.GET_USER_INFO_ERROR) {
      dispatch(logout());
      Alert.alert(error.name, error.message);
      RNRestart.Restart();
    }
  }, [dispatch, error, navigation]);

  useEffect(() => {
    dispatch(changeJoinField('height', ''));
    dispatch(changeJoinField('weight', ''));
  }, []);

  return (
    <ScrollView>
      {/* <Text>{JSON.stringify(userInfo)}</Text> */}
      {/* <Text>{JSON.stringify(accessToken)}</Text> */}

      <View style={ScreenStyles.container}>
        {userInfo && (
          <View style={{flex: 1, alignItems: 'center', top: 10}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              {userInfo ? '카카오톡 회원가입' : '회원가입'}
            </Text>
          </View>
        )}

        <View style={{flex: 3, alignItems: 'center', width: '100%'}}>
          {!userInfo ? (
            <>
              <View style={JoinScreenStyles.ViewContainer}>
                <Text style={JoinScreenStyles.JoinFieldMainText}>이메일 </Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    autoCapitalize="none"
                    style={JoinScreenStyles.JoinFieldWithBtn}
                    placeholder="이메일을 입력해주세요."
                    value={email}
                    onChangeText={(value) =>
                      handleChangJoinField('email', value)
                    }
                  />
                  <NativeButton
                    style={JoinScreenStyles.checkIdBtn}
                    textStyle={JoinScreenStyles.GenderButtonText}
                    onPress={() => {
                      handelPressEmailCheck();
                    }}>
                    중복확인
                  </NativeButton>
                </View>
              </View>

              <View style={JoinScreenStyles.ViewContainer}>
                <Text>비밀번호 </Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    autoCapitalize="none"
                    secureTextEntry={show === false ? true : false}
                    style={JoinScreenStyles.JoinFieldWithBtn}
                    placeholder="4~10자리 영문 숫자, 특수문자 조합"
                    value={password}
                    onChangeText={(value) =>
                      handleChangJoinField('password', value)
                    }
                  />
                  <NativeButton
                    style={JoinScreenStyles.checkIdBtn}
                    textStyle={JoinScreenStyles.GenderButtonText}
                    onPress={() => {
                      setShow(!show);
                    }}>
                    show
                  </NativeButton>
                </View>
              </View>

              <View style={JoinScreenStyles.ViewContainer}>
                <Text>비밀번호 확인</Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    autoCapitalize="none"
                    secureTextEntry={show2 === false ? true : false}
                    style={JoinScreenStyles.JoinFieldWithBtn}
                    placeholder="4~10자리 영문 숫자, 특수문자 조합"
                    value={password2}
                    onChangeText={(value) =>
                      handleChangJoinField('password2', value)
                    }
                  />
                  <NativeButton
                    style={JoinScreenStyles.checkIdBtn}
                    textStyle={JoinScreenStyles.GenderButtonText}
                    onPress={() => {
                      setShow2(!show2);
                    }}>
                    show
                  </NativeButton>
                </View>
              </View>

              <View style={JoinScreenStyles.ViewContainer}>
                <View style={JoinScreenStyles.ViewContainer}>
                  <Text style={JoinScreenStyles.JoinFieldMainText}>닉네임</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      autoCapitalize="none"
                      style={JoinScreenStyles.JoinFieldWithBtn}
                      placeholder="닉네임을 입력해주세요."
                      value={nickname}
                      onChangeText={(value) =>
                        handleChangJoinField('nickname', value)
                      }
                    />
                    <NativeButton
                      style={JoinScreenStyles.checkIdBtn}
                      textStyle={JoinScreenStyles.GenderButtonText}
                      onPress={() => {
                        handelPressNickNameCheck();
                      }}>
                      중복확인
                    </NativeButton>
                  </View>
                </View>
              </View>
            </>
          ) : null}

          <View style={JoinScreenStyles.ViewContainer}>
            <Text>키(cm)</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="number-pad"
              style={JoinScreenStyles.JoinField}
              placeholder="키를 입력해주세요."
              value={String(height)}
              onChangeText={(value) =>
                handleChangJoinField('height', value.replace(/[^0-9]/g, ''))
              }
            />
          </View>

          <View style={JoinScreenStyles.ViewContainer}>
            <Text>몸무게(kg) </Text>
            <TextInput
              style={JoinScreenStyles.JoinField}
              keyboardType="number-pad"
              placeholder="몸무게를 입력해주세요"
              value={String(weight)}
              onChangeText={(value) =>
                handleChangJoinField('weight', value.replace(/[^0-9]/g, ''))
              }
            />
          </View>

          <View style={JoinScreenStyles.ViewContainer}>
            <Text>성별</Text>
            <View style={JoinScreenStyles.GenderButtonContainer}>
              <NativeButton
                style={JoinScreenStyles.buttonContent(gender)}
                textStyle={JoinScreenStyles.GenderButtonText}
                onPress={() => {
                  handleGenderField();
                }}>
                남자
              </NativeButton>

              <NativeButton
                style={JoinScreenStyles.buttonContent2(gender)}
                textStyle={JoinScreenStyles.GenderButtonText}
                activeOpacity={0.5}
                onPress={() => {
                  handleGenderField2();
                }}>
                여자
              </NativeButton>
            </View>
          </View>

          <View style={JoinScreenStyles.ViewContainer}>
            <View style={JoinScreenStyles.ViewContainer}>
              <Text>생년월일 </Text>
              <View style={JoinScreenStyles.birthButtonContainer}>
                {/* <Text style={{fontSize: 24, fontWeight: '600'}}>
                  {date.getFullYear() +
                    '-' +
                    getTwoDigits(+date.getMonth() + 1) +
                    '-' +
                    getTwoDigits(date.getDate())}
                </Text> */}
                <View style={JoinScreenStyles.birthButtonContainer}>
                  <DatePicker
                    style={{width: Platform.OS === 'ios' ? 400 : 200}}
                    date={date}
                    mode="date"
                    placeholder="select date"
                    format="YY-MM-DD"
                    minDate="2016-05-01"
                    maxDate="2016-06-01"
                    onDateChange={(date) => {
                      setDate(date);
                    }}
                  />
                  <NativeButton
                    style={JoinScreenStyles.birthBtn}
                    onPress={() => {
                      handlePressSetDate();
                    }}>
                    확인
                  </NativeButton>
                </View>
              </View>
            </View>

            <View style={JoinScreenStyles.PickerContainer}>
              <Text>건강상태 </Text>
              <Picker
                style={{width: 250, height: 180}}
                lineColor="#008000"
                lineGradientColorFrom="#008000"
                lineGradientColorTo="#008000"
                selectedValue={kidneyType}
                itemStyle={{color: '#757575', fontSize: 20}}
                onValueChange={(value) => {
                  handleChangJoinField('kidneyType', value);
                }}>
                {kidneyTypes.map((i, index) => (
                  <PickerItem label={i.label} value={i.value} key={index} />
                ))}
              </Picker>
              {/* <RNPickerSelect
                onValueChange={(value) => {
                  handleChangJoinField('kidneyType', value);
                }}
                placeholder={pickerItems.kidneyTypes.placeholder({
                  value: null,
                })}
                value={kidneyType}
                items={pickerItems.kidneyTypes.items}
                style={pickerSelectStyles}
              /> */}
            </View>

            <View style={JoinScreenStyles.ViewContainer}>
              <Text>활동상태 </Text>
              <RNPickerSelect
                onValueChange={(value) => {
                  handleChangJoinField('activityId', value);
                }}
                placeholder={pickerItems.activityTypes.placeholder({
                  value: null,
                })}
                value={activityId}
                items={pickerItems.activityTypes.items}
                style={pickerSelectStyles}
              />
            </View>
          </View>
        </View>

        <NativeButton
          // onPress={()=>navigation.navigate('SignIn')}
          onPress={() => {
            if (!userInfo) {
              handlePressJoin();
            } else {
              handlePressKakaoJoin();
            }
          }}>
          회원가입
        </NativeButton>
      </View>
    </ScrollView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: '80%',
    fontSize: 18,
    fontWeight: '800',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 30,
  },
});
