
import {SET_USER, SET_USERPAGE} from '../types/userTipe'

const setUser = payload => ({
  type: SET_USER,
  payload,
})
const setUserPage = payload => ({
  type: SET_USERPAGE,
  payload,
})
export {
  setUser,
  setUserPage,
}