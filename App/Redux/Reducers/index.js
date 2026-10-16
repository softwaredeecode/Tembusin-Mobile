import { combineReducers } from 'redux';
import { RegisterReducer } from './RegisterReducer';
import { LoginReducer } from './LoginReducer';
import { ForumReducer } from './ForumReducer';
import { MaterialReducer } from './MaterialReducer';
import { ProductReducer } from './ProductReducer';
import { ExercisesReducer } from './ExercisesReducer';
import { TryOutReducer } from './TryOutReducer';

const appReducer = combineReducers({
  register: RegisterReducer,
  login: LoginReducer,
  forum: ForumReducer,
  material: MaterialReducer,
  product: ProductReducer,
  exercises: ExercisesReducer,
  tryout: TryOutReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'AUTH/LOGOUT') {
    state = undefined; // 🔥 RESET SEMUA REDUX STATE
  }

  return appReducer(state, action);
};

export default rootReducer;
