const initialLoginFields = {
  username: '',
  password: '',
};

const initialUser = {
  uid: '',
  photoURL: '',
  displayName: '',
  type: '',
};

const initialState = {
  isLoading: true,
  userToken: null,
  loginFields: {
    ...initialLoginFields,
  },
  user: {
    ...initialUser,
  },
  nuturition: {
    calorie: 0,
    carbohydrate: 0,
    protein: 0,
    fat: 0,
    sodium: 0,
    calcium: 0,
    potassium: 0,
    iron: 0,
    phosphorus: 0,
  },
  meal: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  },
};

const reducers = {
  changeLoginField: (state, {payload: {name, value}}) => {
    return {
      ...state,
      loginFields: {
        ...state.loginFields,
        [name]: value,
      },
    };
  },

  setUserToken: (state, {payload: {userToken}}) => {
    return {
      ...state,
      userToken,
    };
  },

  clearUserToken: (state) => {
    return {
      ...state,
      userToken: null,
    };
  },

  changeIsLoading: (state, {payload: {isLoading}}) => {
    return {
      ...state,
      isLoading,
    };
  },

  setUser: (state, {payload: {user}}) => {
    return {
      ...state,
      user,
    };
  },

  clearUser: (state) => {
    return {
      ...state,
      user: initialUser,
    };
  },

  addMeal: (state, {payload: {time, id}}) => {
    const {meal} = state;

    console.log({
      meal: {
        ...meal,
        [time]: [...meal[time], id],
      },
    });

    return {
      ...state,
      meal: {
        ...meal,
        [time]: [...meal[time], id],
      },
    };
  },

  addNuturition: (state, {payload: {food}}) => {
    const {
      calorie,
      carbohydrate,
      protein,
      fat,
      sodium,
      calcium,
      potassium,
      iron,
      phosphorus,
    } = state.nuturition;

    return {
      ...state,
      nuturition: {
        calorie: calorie + food.calorie,
        carbohydrate: carbohydrate + food.carbohydrate,
        protein: protein + food.protein,
        fat: fat + food.fat,
        sodium: sodium + food.sodium,
        calcium: calcium + food.calcium,
        potassium: potassium + food.potassium,
        iron: iron + food.iron,
        phosphorus: phosphorus + food.phosphorus,
      },
    };
  },
};

function defaultReducer(state) {
  return state;
}

export default function reducer(state = initialState, action) {
  return (reducers[action.type] || defaultReducer)(state, action);
}
