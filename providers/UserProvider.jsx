import { useDispatch } from "react-redux";

import { useEffect } from "react";

import { setSession } from "../store/sessionSlice";
import { initializeSession } from "../src/utils/authHelpers";
import { supabase } from "../config/supabaseClient";

const UserProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    initializeSession(dispatch);

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setSession(session));
      }
    );

    return () => subscription?.unsubscribe?.();
  }, [dispatch]);

  return <>{children}</>;
};

export default UserProvider;
