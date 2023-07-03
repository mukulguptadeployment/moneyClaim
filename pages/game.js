import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Switch, Collapse } from "antd";
import Layout from "../Components/Layout";
import Data from "../JSON/home.json";

export default function Profile() {
  const [data, setData] = useState(0);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState("");
  const [selectedNum, setSelectNum] = useState([]);
  const router = useRouter();
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
  useEffect(() => {
    const Num = Cookies.get("Numbers")
      ? JSON.parse(Cookies.get("Numbers"))
      : [];
    setSelectNum(Num);
  }, []);

  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
  };
  const handleLogout = () => {
    Cookies.remove("UserInfo");
    setLogin(false);
    router.push("/");
  };
  const handleNumberClick = (e) => {
    const NumberClicked = e.target.getAttribute("a-key");
    // console.log(e.target.getAttribute("a-key"));
    var arrnew = [...selectedNum];
    if (existElem(NumberClicked)) {
      const index = arrnew.indexOf(NumberClicked);
      if (index > -1) {
        arrnew.splice(index, 1);
      }
    } else {
      arrnew = [...selectedNum, NumberClicked];
    }
    setSelectNum(arrnew);
  };
  const existElem = (i) => selectedNum.includes(i.toString());
  const handlePlaceBet = () => {
    Cookies.set("Numbers", JSON.stringify(selectedNum));
    router.push("/betmoney");
  };
  return (
    login && (
      <Layout>
        <div className="LoginBtnContainer">
          <span>Change Language / भाषा बदलें</span>
          <Switch onChange={handleClick} />
        </div>
        <div className="ProfileHeader" onClick={() => router.push("/home")}>
          <span>{`🔙    Back`}</span>
          <span>{`Hello ${user.name} `}&ensp;</span>
        </div>
        <div className="ProfileHeader2">
          <span>Game Page</span>
          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="GameRoot">
          <span className="TitleGame">Select Your Number</span>
          <div className="gameGrid">
            {Array.from(Array(100), (e, i) => {
              return (
                <span
                  className={`NumberButtons ${
                    selectedNum.includes((i + 1).toString()) && "active"
                  }`}
                  key={i + 1}
                  a-key={i + 1}
                  onClick={handleNumberClick}
                >
                  {i + 1}
                </span>
              );
            })}
          </div>
        </div>
        <input
          type={"submit"}
          value={data==1?"दांव लगाना जारी रखें" :"Continue to place Bet"}
          className="PlaceBetBtn"
          onClick={handlePlaceBet}
        />
        <div className="Terms_Conditions">
          <span className="TnCtext">
            {data==1?`* जीत की राशि पेटीएम के माध्यम से परिणाम घोषित होने के बाद जमा की जाएगी।`:
              `*Winning amount will be credited after the declaration of results via Paytm.`
            }
          </span>
          <span className="TnCtext">
            {data==1?"*सुनिश्चित करें कि आपका नंबर पेटीएम पर पंजीकृत है":"*Make sure your Number is registered on Paytm."}
          </span>
          <span className="TnCtext">
            {data==1?"* रिजल्ट रोजाना रात 10 बजे घोषित किया जाएगा":"*Result will be declared at 10:00 pm every everyday."}
          </span>
        </div>

        <div className="ActiveUsers">
          {Data.activeuser[`${data === 0 ? "english" : "hindi"}`]}
        </div>
      </Layout>
    )
  );
}
