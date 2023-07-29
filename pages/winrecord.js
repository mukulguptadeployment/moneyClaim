import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Switch, Collapse} from "antd";
import Layout from "../Components/Layout";
import Data from "../JSON/winrecord.json";

const { Panel } = Collapse;

export default function Profile() {
  const [data, setData] = useState(0);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState("");
  const router = useRouter();

//   Set Default Language
  useEffect(() => {
    console.info(
      "test Location",
      window.location.href.includes("lan=h") ? "hindi" : "english"
    );
    setData(window.location.href.includes("lan=h") ? 1 : 0);
  }, []);

// handle login or logout
  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "") {
      console.log(userData);
      setUser(userData);
      setLogin(true);
    } else {
      router.push(`/?${data == 1 ? "lan=h" : "lan=en"}`);
    }
  }, [login, router]);

// handle language change 
  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
    const new_url = new URL(window.location.href);
    const search_params = new_url.searchParams;
    search_params.set("lan", ` ${data == 0 ? "en" : "h"} `);
  };

// logout function
  const handleLogout = () => {
    Cookies.remove("UserInfo");
    setLogin(false);
    router.push(`/?${data == 1 ? "lan=h" : "lan=en"}`);
  };

  return (
    login && (
      <Layout>
        <div className="LoginBtnContainer">
          <span>Change Language / भाषा बदलें</span>
          <Switch onChange={handleClick} />
        </div>
        <div
          className="ProfileHeader"
          onClick={() => router.push(`/profile?${data == 1 ? "lan=h" : "lan=en"}`)}
        >
          <span>{`🔙    Back`}</span>
          <span>{`Hello ${user.name} `}&ensp;</span>
        </div>

        <div className="ProfileHeader2">
          <span>{data == 0 ? "Winning Record" : "जीत का रिकॉर्ड"}</span>
          <button className="logoutBtn" onClick={handleLogout}>
            {data == 0 ? "Logout" : "लॉग आउट"}
          </button>
        </div>

        <div className="WinRecordParent">
         <div className="TitleWinRecord"> {Data.title[`${data === 0 ? "english" : "hindi"}`]}</div>
         
        </div>

        <div className="ActiveUsers">
          {Data.activeuser[`${data === 0 ? "english" : "hindi"}`]}
        </div>
      </Layout>
    )
  );
}

