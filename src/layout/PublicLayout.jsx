import { Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";
import { Loading } from "../components/common/Loading";

const PublicLayout = () => {
  const { session, loading } = useSelector((state) => state.session);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (session) {
    return <Navigate to="/admin/series" replace />;
  }

  return (
    <>
      <main>
        <Outlet></Outlet>
      </main>
    </>
  );
};

export default PublicLayout;
