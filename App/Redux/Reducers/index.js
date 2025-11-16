import { combineReducers } from 'redux';
import { RegisterReducer } from './RegisterReducer';
import { LoginReducer } from './LoginReducer';

const rootReducer = combineReducers({
    register: RegisterReducer,
    login: LoginReducer,
});

export default rootReducer;
