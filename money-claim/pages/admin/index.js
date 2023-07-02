import { Switch } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout";
import Data from "../../JSON/admin.json";

export default function Home() {
  const [data, setData] = useState(0);
  const [login, setLogin] = useState(false);
  const router = useRouter();
  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "") {
      if (userData.isAdmin === "true") {
        setLogin(true);
      } else {
        router.push("/home");
      }
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
  const AskNumber = async () => {
    const months = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const todayDate = new Date();
    const currentdate = `${parseInt(todayDate.getDate()) + 1} ${
      months[todayDate.getMonth()]
    } ${todayDate.getFullYear()}`;
    var betnum = prompt(`Please set Number for `);
    betnum = betnum !== "" ? parseInt(betnum) : betnum;
    if (betnum !== "") {
      console.log(
        "Calling api to set Number",
        betnum,
        " For Date ",
        currentdate
      );
      const body = {
        num: betnum,
        time: todayDate,
      };
      const res = await fetch("/api/senumber", {
        method: "POST",
        body: JSON.stringify(body),
      });
      console.log("Set Num Sucess", res);
    } else {
      alert("Please Set a Number");
    }
  };
  const showNumber = async () => {
    router.push("/admin/winnumber");
  };
  const showGame=()=>{
    router.push("/admin/gameinfo")
  }
  const showNumberInfo=()=>{
    router.push("/admin/numbersinfo")
  }
  const setPaytm = async () => {
    var number = prompt("Enter Paytm Number");
    const request = await fetch("/api/setpaytmnumber", {
      method: "POST",
      body: number,
    });
  };
  const showComplaints=()=>{
    router.push("/admin/complaintinfo")
  }
  return (
    login && (
      <Layout>
        <div className="LoginBtnContainer">
          <span>Change Language / भाषा बदलें</span>
          <Switch onChange={handleClick} />
        </div>
        <div className="ProfileHeader">
          <span>Home Page</span>
          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="btnContainer">
          <div className="Clickbtn" onClick={() => router.push("/admin/users")}>
            {Data.title1[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <div className="Clickbtn" onClick={AskNumber}>
            {Data.title2[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <div className="Clickbtn" onClick={showNumber}>
            {Data.title3[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <div className="Clickbtn" onClick={setPaytm}>
            {Data.title4[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <div className="Clickbtn" onClick={showGame}>
            {Data.title5[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <div className="Clickbtn" onClick={showNumberInfo}>
            {Data.title6[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <div className="Clickbtn" onClick={showComplaints}>
            {Data.title7[`${data === 0 ? "english" : "hindi"}`]}
          </div>
        </div>
        <div className="InfoContest">
          {
            "All Entries For Today's contest will Start at 10:00 AM and Close at 11:30 AM !"
          }
        </div>
        <div className="ActiveUsers">
          {Data.activeuser[`${data === 0 ? "english" : "hindi"}`]}
        </div>
      </Layout>
    )
  );
}
