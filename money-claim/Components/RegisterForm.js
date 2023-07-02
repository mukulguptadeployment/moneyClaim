import React, { useEffect, useState } from "react";
import { Button, Form, Input,setFieldsValue } from "antd";
import Cookies from "js-cookie";
import MsgModal from "./MsgModal";

export default function RegisterFrom({ formlabels }) {
  const [registerform]=Form.useForm();
  const [sucess, setSucess] = useState(false);
  const [msg, setmsg] = useState("");
  const [codedisable,setCode]=useState(false)
  const showMsg = (open, message) => {
    setSucess(open);
    setmsg(message);
  };
  useEffect(()=>{
    const url=document.location.href
    const codedata=url.includes("reffer") && url.split("/")
    const code=codedata && codedata[codedata.length-1].split("=")
  console.log(registerform,"Query Code")
  code && registerform.setFieldsValue({refferCode:code[code.length-1]})
  setCode(true)
  
  },[])
  const onFinish = async (values) => {
    console.log(values);
    values.refferCode===undefined? values.refferCode = "" : null
    Cookies.set("userData", JSON.stringify(values));
    const response = await fetch("/api/register");
    const result = await response.json();
    // console.log(result,"api response")
    showMsg(true, result.message);
    Cookies.remove("userData");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Form
        name={"register_form"}
        form={registerform}
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
          label={formlabels.name}
          name="name"
          rules={[
            {
              required: true,
              message: "Please Enter your Name!",
            },
          ]}
          className="LoginFieldFormItem"
        >
          <Input />
        </Form.Item>
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
          label={formlabels.Phonenumber}
          name="contactnumber"
          rules={[
            {
              required: true,
              message: "Please Enter your Contact Number!",
            },
          ]}
          className="LoginFieldFormItem"
        >
          <Input />
        </Form.Item>
        <Form.Item
          colon={false}
          label={formlabels.refferalCode}
          name="refferCode"
          rules={[
            {
              required: false,
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
        <Form.Item
          colon={false}
          label={formlabels.confirmPassword}
          name="confirmpassword"
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

        <Form.Item className="LoginFieldFormItem">
          <Button type="primary" htmlType="submit">
            Sign up
          </Button>
        </Form.Item>
      </Form>
      <MsgModal open={sucess} setOpen={setSucess} content={msg} />
    </>
  );
}
