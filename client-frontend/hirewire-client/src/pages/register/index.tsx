import { AuthPage } from "@refinedev/antd";
import { Form, Input, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRegister, useIsAuthenticated } from "@refinedev/core";

const { Title } = Typography;

export const Register = () => {
  const navigate = useNavigate();
  const { data } = useIsAuthenticated();
  const { mutate: register, isLoading } = useRegister();

  useEffect(() => {
    document.title = "HireWire Client - Register";
  }, []);

  useEffect(() => {
    if (data?.authenticated) {
      navigate("/home");
    }
  }, [navigate, data]);

  const handleFinish = (values: any) => {
    register(
      {
        ...values,
      },
      {
        onSuccess: (data) => {
          if (!data.success) {
            throw data?.error;
          }

          navigate("/login");
        },
        onError: (error) => {
          console.error("Registration failed:", error);
        },
      }
    );
  };

  return (
    <AuthPage
      type="register"
      title="HireWire"
      renderContent={() => (
        <div
          style={{
            maxWidth: 400,
            margin: "0 auto",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            background: "#000",
          }}
        >
          <Title
            level={3}
            style={{ textAlign: "center", marginBottom: "1.5rem" }}
          >
            Sign Up for HireWire
          </Title>
          <Form
            layout="vertical"
            name="register-form"
            onFinish={handleFinish}
            style={{ gap: "1rem" }}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              name="documentId"
              label="Document ID"
              rules={[
                { required: true, message: "Please input your document ID!" },
              ]}
            >
              <Input placeholder="Enter your document ID" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            Already have an account?{" "}
            <Button
              type="link"
              onClick={() => navigate("/login")}
              style={{ padding: 0 }}
            >
              Sign in
            </Button>
          </div>
        </div>
      )}
    />
  );
};
