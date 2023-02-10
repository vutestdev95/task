import { FunctionComponent, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const PrivateLayout: FunctionComponent = ({ children }) => {
  const { state } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!state?.isInitialLoading && !state?.user) {
      history.replace("/login");
    }
  }, [state, history]);

  return children as any;
};

export default PrivateLayout;
