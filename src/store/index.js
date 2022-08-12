import { configureStore } from '@reduxjs/toolkit';

import nodesSlice from './nodeSlice/index.js';

export const store = configureStore({
  reducer: {
    nodes: nodesSlice,
  },
})