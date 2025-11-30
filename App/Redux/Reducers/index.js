import { combineReducers } from 'redux';
import { RegisterReducer } from './RegisterReducer';
import { LoginReducer } from './LoginReducer';
import { ForumReducer } from './ForumReducer';

const rootReducer = combineReducers({
    register: RegisterReducer,
    login: LoginReducer,
    forum: ForumReducer,
});

export default rootReducer;
