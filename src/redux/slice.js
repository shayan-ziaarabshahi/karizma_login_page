import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

const setUser = (state, action) => {
   state.user = action.payload
   Cookies.set('user', JSON.stringify(action.payload), { expires: 1 })
} 
 

const initialState = {
   user: {}
}
 
const slice = createSlice({
   name:'slice',
   initialState,
   reducers:{
    setUser
   }
})
 
export const {
    setUser: setUserAction
} = slice.actions
 
export default slice.reducer
