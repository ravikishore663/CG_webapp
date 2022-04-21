import { Reducer, combineReducers } from "redux";
import filterBarReducer from "./../components/Grid/FilterBar/filterBarReducer";

const reducers = combineReducers({
  filterBarReducer
});

export {
  reducers
};
