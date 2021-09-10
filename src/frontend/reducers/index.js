import {SET_USER, SET_USERPAGE} from '../types/userTipe'


const reducer = (state, action) => {
  switch(action.type){
    case SET_USER:
      return {...state, ...action.payload}
    case SET_USERPAGE:
      return {...state, ...action.payload}
    default:
      return state;
  }
}

export default reducer