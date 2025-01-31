//Se obtiene la sesion del usuario
//Verifica si el token es valido
//Si no expiro el token retorna la session, sino retorna null
//Se pide que el usuario se loguee otra vez

import { supabase } from "../../config/supabaseClient";
import { setLoading, setSession } from "../../store/sessionSlice";
import { isTokenExpired } from "./isTokenExpired";

export const fetchSession = async () => {
  const { data } = await supabase.auth.getSession();

  if (data) {
    const isExpired = isTokenExpired(data?.session?.expires_at);

    if (!isExpired) {
      return data.session;
    } else {
      console.warn("Token expired");

      return null;
    }
  }

  return null;
};

export const initializeSession = async (dispatch) => {
  // 1RO VERIFICAR SI EXISTE TOKEN ALMACENADO EN EL LOCALSTORAGE
  console.log("USER PROVIDER USO");

  const storedToken = localStorage.getItem("access_token");
  const storedExpiresAt = localStorage.getItem("expires_at");

  if (storedToken && storedExpiresAt) {
    // Si el token y la fecha de expiración existen en el localStorage

    const isExpired = isTokenExpired(storedExpiresAt);
    if (!isExpired) {
      // Si no ha expirado, cargamos la sesión desde localStorage
      const session = {
        access_token: storedToken,
        expires_at: parseInt(storedExpiresAt),
        user: JSON.parse(localStorage.getItem("user")),
      };
      dispatch(setSession(session));
    } else {
      console.warn("Token expired in localStorage");
      localStorage.removeItem("access_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("user");
      dispatch(setSession(null));
    }
  } else {
    // SI HABIA TOKEN EXPIRADO EN EL LOCALSTORAGE SE OBTIENE DE SUPABASE
    const session = await fetchSession();
    if (session) {
      dispatch(setSession(session));
    } else {
      dispatch(setSession(null));
    }
  }

  dispatch(setLoading(false));
};
