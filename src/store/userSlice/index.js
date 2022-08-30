import { createSlice } from '@reduxjs/toolkit';
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";

const cookies = new Cookies();

const initialState = {
  idUser: cookies.get('refreshToken') ? jwt_decode(cookies.get('refreshToken').split(' ')[1]).idUser : undefined,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIdUser: (state, action) => {
      state.idUser = action.payload;
    }
  }
});

export const { setIdUser } = userSlice.actions;

export default userSlice.reducer;
