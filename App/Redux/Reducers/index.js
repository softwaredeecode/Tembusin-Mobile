import { combineReducers } from 'redux';
import { RegisterReducer } from './RegisterReducer';
import { LoginReducer } from './LoginReducer';
import { ForumReducer } from './ForumReducer';
import { MaterialReducer } from './MaterialReducer';

const rootReducer = combineReducers({
    register: RegisterReducer,
    login: LoginReducer,
    forum: ForumReducer,
    material: MaterialReducer,
});

export default rootReducer;
