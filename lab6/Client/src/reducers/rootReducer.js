import {combineReducers} from 'redux';
import teamReducer from './teamReducer';
import activeReducer from './activeReducer';
const rootReducer = combineReducers({
  teams: teamReducer,
  active: activeReducer
});

export default rootReducer;