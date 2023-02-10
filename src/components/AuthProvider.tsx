import { Spinner } from "@blueprintjs/core";
import styled from "@emotion/styled";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useApp } from "../ApplicationProvider";
import {
  GetCustomerInfoResponse,
  useGetCustomerInfoQuery,
} from "../generated/graphql";
import GetCustomerInfoOutput from "../services/mockdata/json/GetCustomerInfoOutput.json";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type AuthState = {
  UserGUID?: string;
  user?: GetCustomerInfoResponse;
  token?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  tenantId?: string;
  groups?: string[];
  tenants?: string[];
  isInitialLoading?: boolean;
};

interface IAuthContext {
  setState: (state: AuthState) => void | any;
  state: AuthState;
}

const setStateInitValue = (state: AuthState) => {
  const newState = {
    ...state,
  };
  return newState;
};

export const AuthContext = createContext<IAuthContext>({
  setState: setStateInitValue,
  state: {
    user: undefined,
    token: undefined,
    isAdmin: undefined,
    isSuperAdmin: undefined,
    tenantId: undefined,
    groups: undefined,
    tenants: undefined,
    isInitialLoading: true,
  },
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: JSX.Element[] | JSX.Element;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useReducer(
    (prev: AuthState, state: AuthState) => ({
      ...prev,
      ...state,
    }),
    {
      UserGUID: undefined,
      user: undefined,
      token: undefined,
      isAdmin: undefined,
      tenantId: undefined,
      groups: undefined,
      tenants: undefined,
      isInitialLoading: true,
    }
  );
  const { refetch: fetchCustomerInfor } = useGetCustomerInfoQuery({
    skip: true,
  });
  const app = useApp();

  useEffect(() => {
    if (localStorage.getItem("UserGUID")) {
      fetchCustomerInfor()
        .then((res) => {
          const status = res.data?.GetCustomerInfo?.status;
          if (status)
            throw new Error(res.data?.GetCustomerInfo?.statusdescription || "");
          const user = res.data?.GetCustomerInfo;
          if (!user) throw new Error();
          setState({
            user: user as any,
            isInitialLoading: false,
          });
        })
        .catch(() => {
          const user = GetCustomerInfoOutput;
          setState({
            user: user as any,
            isInitialLoading: false,
          });
        });
    } else {
      setState({
        isInitialLoading: false,
      });
    }
  }, [fetchCustomerInfor]);

  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={value}>
      {state.isInitialLoading || app.loading ? (
        <Container>
          <Spinner />
        </Container>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export type { AuthState };
