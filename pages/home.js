import { Switch } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import Data from "../JSON/home.json";

export default function Home() {
  const [data, setData] = useState(0);
  const [login, setLogin] = useState(false);
  const [luckyNum, setLuckyNum] = useState("..");
  const router = useRouter();
  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "") {
      console.log(userData);
      setLogin(true);
    } else {
      router.push("/");
    }
  }, [login, router]);

  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
  };
  const handleLogout = () => {
    Cookies.remove("UserInfo");
    setLogin(false);
    router.push("/");
  };
  const handleComplaint = () => {
    const msg = window.prompt("Raise a Complaint ?");
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    const submit_complaint = fetch("/api/complaint/create", {
      method: "POST",
      body: JSON.stringify({
        name: userData.name,
        msg: msg,
      }),
    });
  };
  useEffect(() => {
    getNum();
  }, []);
  const getNum = async () => {
    const request = await fetch(`/api/shownumber`);
    const data = await request.json();
    console.log("Response", data[data.length - 1]);

    setLuckyNum(data[data.length - 1]);
  };
  return (
    login && (
      <Layout>
        <div className="LoginBtnContainer">
          <span>Change Language / भाषा बदलें</span>
          <Switch onChange={handleClick} />
        </div>
        <div className="ProfileHeader">
          <span>{data==0?"Home Page":"होम पेज"}</span>
          <button className="logoutBtn" onClick={handleLogout}>
            {data==0?"Logout":"लॉग आउट"}
          </button>
        </div>
        <div className="btnContainer">
          <span className="TitleLuckyNumber">
            {luckyNum != ".." &&
              luckyNum.time.substring(0, 10).split("-").reverse().join("-") +
                Data.LuckyNum[`${data === 0 ? "english" : "hindi"}`]}
          </span>
          <div className="LuckyNumber">
            <span className="LotteryNum">{luckyNum.number}</span>
          </div>
          <div className="Clickbtn" onClick={() => router.push("/profile")}>
            {Data.profile[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <div className="Clickbtn" onClick={() => router.push("/game")}>
            {Data.startplaying[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <div className="Clickbtn" onClick={() => router.push("/reffer")}>
            {Data.upcoming[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <div className="Clickbtn" onClick={handleComplaint}>
            {Data.complain[`${data === 0 ? "english" : "hindi"}`]}
          </div>
        </div>
        <div className="InfoContest">
          {data == 1
            ? "गेम खेलने का टाइम सुबह 10:00 Am से लेकर रात के 9:00 PM तक  होगा"
            : "All Games will be played between 10:00 AM to 9:00 PM"}
        </div>
        <div className="ActiveUsers">
          {Data.activeuser[`${data === 0 ? "english" : "hindi"}`]}
        </div>
      </Layout>
    )
  );
}
