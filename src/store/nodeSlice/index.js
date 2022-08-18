import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
}

export const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.value = action.payload;
    },
    addNode: (state, action) => {
      state.value.push(action.payload);
    },
    removeNode: (state, action) => {
      state.value = state.value.filter(node => node._id !== action.payload.id);
    }
  }
});

export const { setNodes, addNode, removeNode } = nodesSlice.actions;

export default nodesSlice.reducer;
