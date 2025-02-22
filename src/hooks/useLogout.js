import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../config/supabaseClient";
import { logout } from "../../store/sessionSlice";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
    } else {
      dispatch(logout());
      navigate("/", { replace: true });
    }
  };

  return handleLogout;
};
