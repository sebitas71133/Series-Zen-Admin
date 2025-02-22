import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    isAuthenticated: false,
    user: null,
    authToken: null,
    session: null,
    loading: true,
    email: null,
  },

  reducers: {
    setSession: (state, action) => {
      const session = action.payload;
      const user = session?.user || null;
      state.session = session;
      state.isAuthenticated = !!session;
      state.user = user;
      state.authToken = session?.access_token || null;
      state.email = session?.user.email;
      // Guardar en localStorage
      if (session) {
        localStorage.setItem("access_token", session.access_token);
        localStorage.setItem("expires_at", session.expires_at);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        // Limpiar localStorage si no hay sesión
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("user");
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state, action) => {
      state.session = null;
      state.isAuthenticated = false;
      state.authToken = null;
      state.user = null;
    },
  },
});

export const { setSession, setLoading, logout } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
