import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from "@ant-design/icons";
import { Switch, Button, Divider, notification, Space } from "antd";
import Layout from "../Components/Layout";
import Data from "../JSON/Refferal.json";
import Image from "next/image";

const Context = React.createContext({
  name: "Default",
});

export default function Profile() {
  const [data, setData] = useState(0);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState("");
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.info({
      message: `Notification `,
      description: (
        <Context.Consumer>
          {({ name }) => `Copied To Clipboard!`}
        </Context.Consumer>
      ),
      placement,
    });
  };
  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );
  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "") {
      console.log(userData);
      setUser(userData);
      setLogin(true);
    } else {
      router.push("/");
    }
  }, [login, router]);
  const copyToClipboard = (e) => {
    console.log("text", e.target.getAttribute("data-value"));
    var textField = document.createElement("textarea");
    textField.innerText = `${Data.refferlinktext}${user.refferalCode} to get benefits join now : https://money-claim.vercel.app/register?reffer=true&code=${user.refferalCode}`;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    openNotification();
  };
  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
  };
  const handleLogout = () => {
    Cookies.remove("UserInfo");
    setLogin(false);
    router.push("/");
  };
  return (
    login && (
      <Layout>
        <Context.Provider value={contextValue}>
          {contextHolder}
        </Context.Provider>
        <div className="MoneyRain"></div>
        <div className="LoginBtnContainer">
          <span>Change Language / भाषा बदलें</span>
          <Switch onChange={handleClick} />
        </div>
        <div className="ProfileHeader" onClick={() => router.push("/home")}>
          <span>{`🔙    Back`}</span>
          <span>{`Hello ${user.name} `}&ensp;</span>
        </div>
        <div className="ProfileHeader2">
          <span>{data===0?"Refferal Page":"रेफरल पेज"}</span>
          <button className="logoutBtn" onClick={handleLogout}>
            {data==0?"Logout":"लॉग आउट"}
          </button>
        </div>
        <div className="ShareRoot">
          <span className="infoShare">
            {Data.info[`${data === 0 ? "english" : "hindi"}`]}
          </span>
          <span className="infoShare">
            {Data.share[`${data === 0 ? "english" : "hindi"}`]}
          </span>

          <div className="iconsReffer">
            <a
              href={`https://wa.me/?text=${Data.refferlinktext}${user.refferalCode} to get benefits join now : https://money-claim.vercel.app/register?reffer=true&code=${user.refferalCode}`}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/whatsapp.svg"
                width={"50"}
                height={"50"}
                alt="Whatsapp Logo"
                data-value="sample valuetest"
                // onClick={copyToClipboard}
              />
            </a>
            <Image
              src="/copy.svg"
              width={"50"}
              height={"50"}
              alt="Copy Logo"
              data-value="sample valuetest"
              onClick={copyToClipboard}
            />
          </div>
        </div>

        <div className="ActiveUsers">
          {Data.activeuser[`${data === 0 ? "english" : "hindi"}`]}
        </div>
      </Layout>
    )
  );
}
