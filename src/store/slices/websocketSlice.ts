import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface WebSocketState {
  connected: boolean;
  lastMessage: any;
  error: string | null;
}

const initialState: WebSocketState = {
  connected: false,
  lastMessage: null,
  error: null,
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setConnected(state, action) { state.connected = action.payload; },
    setLastMessage(state, action) { state.lastMessage = action.payload; },
  },
});

export const { setConnected, setLastMessage } = websocketSlice.actions;
export default websocketSlice.reducer;
