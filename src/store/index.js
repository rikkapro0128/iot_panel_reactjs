import { configureStore } from '@reduxjs/toolkit';

import nodesSlice from './nodeSlice/index.js';
import userSlice from './userSlice/index.js';
import commonSlice from './commonSlice/index.js';
import notifySlice from './notifySlice/index.js';

export const store = configureStore({
  reducer: {
    nodes: nodesSlice,
    user: userSlice,
    common: commonSlice,
    notify: notifySlice,
  },
})