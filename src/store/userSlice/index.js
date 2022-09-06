import { createSlice } from '@reduxjs/toolkit';
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";

const cookies = new Cookies();

const refreshToken = cookies.get('refreshToken');

const initialState = {
  idUser: refreshToken ? jwt_decode(refreshToken.split(' ')[1]).idUser : undefined,
  isLogin: refreshToken ? true : false,
  info: {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIdUser: (state, action) => {
      state.idUser = action.payload;
    },
    setInfoUser: (state, action) => {
      state.info = action.payload;
    }
  }
});

export const { setIdUser, setInfoUser } = userSlice.actions;

export default userSlice.reducer;
