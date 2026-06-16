import { configureStore } from '@reduxjs/toolkit';
import podsReducer from './slices/podsSlice';
import clusterReducer from './slices/clusterSlice';
import scalingReducer from './slices/scalingSlice';
import incidentsReducer from './slices/incidentsSlice';
import websocketReducer from './slices/websocketSlice';

export const store = configureStore({
  reducer: {
    pods: podsReducer,
    cluster: clusterReducer,
    scaling: scalingReducer,
    incidents: incidentsReducer,
    websocket: websocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
