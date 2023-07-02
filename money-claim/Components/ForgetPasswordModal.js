import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Form } from "antd";

export default function ForgetPassowrd({ open, setOpen, content, title }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleCancel = () => {
    setOpen(false);
    setLoading(false);
  };
  const onFinish = async (values) => {
    setLoading(true);
    try {
      setError(false);
      const sendPassowrd = await fetch("/api/forgetpassword", {
        method: "POST",
        body: values.username.toString(),
      });
      console.log(sendPassowrd);
      sendPassowrd.status === 404 &&
        setError("User Account Doesn't Exist Please Register");
      sendPassowrd.ok && setError("Password Sent to you via mail");
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
    console.log(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setLoading(false);
  };
  return (
    <>
      <Modal open={open} title={title} onCancel={handleCancel} footer={null}>
        <Form
          name="forgotForm"
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
            label={"Enter Your Email Id"}
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
          {error && (
            <span className={error.includes("mail") ? "sucess" : "error"}>
              {error}
            </span>
          )}
          <Button loading={loading} htmlType="submit">
            Send Password to my Email
          </Button>
        </Form>
      </Modal>
    </>
  );
}
