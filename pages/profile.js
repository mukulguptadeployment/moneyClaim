import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Switch, Collapse, Button, Checkbox, Form, Input } from "antd";
import Layout from "../Components/Layout";
import Data from "../JSON/profile.json";
const { Panel } = Collapse;

export default function Profile() {
  const [data, setData] = useState(0);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState("");
  const router = useRouter();
  useEffect(() => {
    console.info("test Location",window.location.href.includes("lan=h") ? "hindi" : "english");
    setData(window.location.href.includes("lan=h") ? 1 : 0)
  }, []);
  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "") {
      console.log(userData);
      setUser(userData);
      setLogin(true);
    } else {
      router.push(`/?${data==1?"lan=h":"lan=en"}`);
    }
  }, [login, router]);

  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
    const new_url=new URL(window.location.href);
    const search_params=new_url.searchParams;
    search_params.set('lan', ` ${ data==0 ? "en" : "h" } `);
  };
  const handleLogout = () => {
    Cookies.remove("UserInfo");
    setLogin(false);
    router.push(`/?${data==1?"lan=h":"lan=en"}`);
  };
  return (
    login && (
      <Layout>
        <div className="LoginBtnContainer">
          <span>Change Language / भाषा बदलें</span>
          <Switch onChange={handleClick} />
        </div>
        <div className="ProfileHeader" onClick={() => router.push(`/home?${data==1?"lan=h":"lan=en"}`)}>
          <span>{`🔙    Back`}</span>
          <span>{`Hello ${user.name} `}&ensp;</span>
        </div>

        <div className="ProfileHeader2">
          <span>{data==0?"Profile Page":"प्रोफ़ाइल पेज"}</span>
          <button className="logoutBtn" onClick={handleLogout}>
            {data==0?"Logout":"लॉग आउट"}
          </button>
        </div>

        <div className="CollapseRootparent">
          <div className="CollapseRoot Clickbtn color-match">
            {Data.winning[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <div className="CollapseRoot Clickbtn color-match">
            {Data.withdrawl[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <Collapse
            bordered={false}
            defaultActiveKey={["0"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            className="site-collapse-custom-collapse CollapseRoot"
          >
            <Panel
              header={Data.password[`${data === 0 ? "english" : "hindi"}`]}
              key="1"
              className="site-collapse-custom-panel collapseCustomText"
            >
              <ChangePassowrdForm />
            </Panel>
            <Panel
              header={Data.phone[`${data === 0 ? "english" : "hindi"}`]}
              key="2"
              className="site-collapse-custom-panel collapseCustomText"
            >
              <ChangePhoneNumber />
            </Panel>
          </Collapse>
        </div>

        <div className="ActiveUsers">
          {Data.activeuser[`${data === 0 ? "english" : "hindi"}`]}
        </div>
      </Layout>
    )
  );
}

const ChangePassowrdForm = ({ title }) => {
  const onFinish = async (values) => {
    if (values.password === values.confirmPassword) {
      const data = await fetch("/api/changepsw", {
        method: "POST",
        body: JSON.stringify({
          password: values.password,
        }),
      });
      if (data.ok) {
        alert("Password Changed Sucessfully");
      }
      console.log("Success:", values);
    } else {
      console.log("Fail:", values);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
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
    >
      <Form.Item
        label="New Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          {title}
        </Button>
      </Form.Item>
    </Form>
  );
};

const ChangePhoneNumber = ({ title }) => {
  const onFinish = async (values) => {
    if (values.phoneNumber === values.ConfirmPhoneNumber) {
      const data = await fetch("/api/changephone", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: values.phoneNumber,
        }),
      });
      if (data.ok) {
        alert("PhoneNumber Changed Sucessfully");
      }
      console.log("Success:", values);
    } else {
      console.log("Fail:", values);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
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
    >
      <Form.Item
        label="New PhoneNumber"
        name="phoneNumber"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Confirm PhoneNumber"
        name="ConfirmPhoneNumber"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          {title}
        </Button>
      </Form.Item>
    </Form>
  );
};
