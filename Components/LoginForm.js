import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import ForgetPassowrd from "./ForgetPasswordModal";

export default function LoginForm({ formlabels }) {
  const [login, setLogin] = useState(false);
  const [forgetModal, setForgetModal] = useState(false);
  const router = useRouter();
  const onFinish = async (values) => {
    // console.log(values);
    setLogin(true);
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(values),
    });

    console.log("Success:", Cookies.get("UserInfo"));
    if (response.status == 200) {
      Cookies.get("UserInfo") &&
      JSON.parse(Cookies.get("UserInfo")).isAdmin === "true"
        ? router.push("/admin")
        : router.push(`/home?${data==1?"lan=h":"lan=en"}`);
      setLogin(false);
    } else if (response.status == 403) {
      alert("Invalid Username Or Password");
      setLogin(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const sendPassowrd = () => {
    setForgetModal(true);
  };
  return (
    <>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="LoginFieldForm"
      >
        <Form.Item
          colon={false}
          label={formlabels.email}
          name="username"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please Enter your Email!",
            },
          ]}
          className="LoginFieldFormItem"
        >
          <Input />
        </Form.Item>

        <Form.Item
          colon={false}
          label={formlabels.password}
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          className="LoginFieldFormItem"
        >
          <Input.Password />
        </Form.Item>
        <span className="ForgetPasswordRoot" onClick={sendPassowrd}>
          Forgot Password ?
        </span>

        <Form.Item className="LoginFieldFormItem">
          <Button type="primary" htmlType="submit" loading={login}>
            Login
          </Button>
        </Form.Item>
      </Form>
      <ForgetPassowrd
        open={forgetModal}
        setOpen={setForgetModal}
        title={"Forgot Password"}
      />
    </>
  );
}
