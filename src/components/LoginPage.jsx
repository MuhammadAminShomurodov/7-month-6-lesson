import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form, notification } from "antd";
import { useForm, Controller } from "react-hook-form";
import "./LoginPage.css";

function LoginPage() {
  const { control, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (values.username === "admin" && values.password === "password") {
        notification.success({ message: "Login successful!" });
        navigate("/students");
      } else {
        notification.error({ message: "Invalid username or password." });
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <Form onFinish={handleSubmit(onSubmit)} className="form-all">
        <h2>Login</h2>
        <Controller
          name="username"
          control={control}
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <Form.Item
              label="Username"
              validateStatus={field.state?.error ? "error" : ""}
              help={field.state?.error?.message}
            >
              <Input {...field} />
            </Form.Item>
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <Form.Item
              label="Password"
              validateStatus={field.state?.error ? "error" : ""}
              help={field.state?.error?.message}
            >
              <Input.Password {...field} />
            </Form.Item>
          )}
        />
        <Form.Item>
          <Button
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "0 auto",
            }}
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginPage;
