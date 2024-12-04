import { useEffect } from "react";
import { AuthPage } from "@refinedev/antd";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@refinedev/core";

export const Login = () => {
  const navigate = useNavigate();
  const { data } = useIsAuthenticated();

  useEffect(() => {
    document.title = "HireWire Client - Login";
  }, []);

  useEffect(() => {
    if (data?.authenticated) {
      navigate("/home");
    }
  }, [navigate, data]);

  return (
    <AuthPage
      title="HireWire Client"
      type="login"
      rememberMe={false}
      forgotPasswordLink={false}
    />
  );
};
