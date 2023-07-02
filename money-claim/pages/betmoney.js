import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Switch, Collapse, Button, Checkbox, Form, Input, Modal } from "antd";
import Layout from "../Components/Layout";
import Data from "../JSON/home.json";
import TextData from "../JSON/betMoney.json";
const { Panel } = Collapse;

export default function Profile() {
  const [data, setData] = useState(0);
  const [login, setLogin] = useState(false);
  const [paymentpop, setPaymentPop] = useState(false);
  const [user, setUser] = useState("");
  const [selectedNum, setSelectNum] = useState([]);
  const [GameData, setGameData] = useState([]);
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
    const Num = Cookies.get("Numbers");
    setSelectNum(JSON.parse(Num));
  }, []);
  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
  };
  const handleLogout = () => {
    Cookies.remove("UserInfo");
    setLogin(false);
    router.push("/");
  };
  const handleInputBlur = (e) => {
    const amount = e.target.value;
    amount % 10 !== 0 && console.log("Not a Zeroo");
    console.log(e.target.value, amount % 10 == 0, amount % 10);
    if (amount % 10 >= 5 && amount % 10 !== 0) {
      e.target.value = parseInt(amount) + 10 - (amount % 10);
      alert("Amount can only be multiple of 10");
    } else if (amount % 10 < 5 && amount % 10 !== 0) {
      e.target.value = parseInt(amount) - (amount % 10);
      alert("Amount can only be multiple of 10");
    }
    const data = {
      number: selectedNum[e.target.name],
      amount: parseInt(amount),
    };
    const game = GameData.length > 0 ? [...GameData] : [data];
    const dataofgame = game.findIndex(
      (x) => x.number == selectedNum[e.target.name]
    );
    if (dataofgame != -1) {
      game[dataofgame].amount = parseInt(amount);
    } else {
      game.push(data);
    }
    console.log("game", game);
    setGameData(game);
  };
  const PlaceBet = () => {
    setPaymentPop(true);
    console.log(GameData);
  };
  return (
    login && (
      <Layout>
        <PaymentPopUp
          open={paymentpop}
          close={() => setPaymentPop(false)}
          data={data}
          router={router}
          amount={GameData}
        />
        <div className="LoginBtnContainer">
          <span>Change Language / भाषा बदलें</span>
          <Switch onChange={handleClick} />
        </div>
        <div className="ProfileHeader" onClick={() => router.push("/game")}>
          <span>{`🔙    Back`}</span>
          <span>{`Hello ${user.name} `}&ensp;</span>
        </div>
        <div className="ProfileHeader2">
          <span>Game Page</span>
          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="GameRootMoney">
          <span className="TitleGame">Select Amount For Numbers</span>
          <div className="MoneyTable">
            <span>Number</span>
            <span>Amount</span>
          </div>
          {selectedNum &&
            selectedNum.map((e, i) => (
              <div className="MoneyTable" key={i}>
                <span>{e}</span>
                <input
                  type={"number"}
                  placeholder={`Enter Amount to bet on number ${e}`}
                  className="AmountInput"
                  name={i}
                  onBlur={handleInputBlur}
                  onBlurCapture={handleInputBlur}
                />
              </div>
            ))}
        </div>
        <input
          type={"submit"}
          value={TextData.placebet[`${data === 0 ? "english" : "hindi"}`]}
          className="PlaceBetBtn"
          onClick={PlaceBet}
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
          <span className="TnCtext">
            {data==1?"*10 रुपए से कम गेम नहीं लिखा जाएगा":"*Amount can only be multiple of ₹ 10."}
          </span>
        </div>

        <div className="ActiveUsers">
          {Data.activeuser[`${data === 0 ? "english" : "hindi"}`]}
        </div>
      </Layout>
    )
  );
}

const PaymentPopUp = ({ amount, open, close, data, router }) => {
  const [num, setNum] = useState("");
  const CalcInvestAmount = (items, prop) => {
    return items.reduce(function (a, b) {
      return a + b[prop];
    }, 0);
  };
  const handleOk = async () => {
    const trans_id = document.getElementById("paymentId").value;
    alert(
      `Paid ${CalcInvestAmount(
        amount,
        "amount"
      )} and Game Set Sucessfull with transaction id ${trans_id}`
    );
    const request = await fetch("/api/setgame", {
      method: "POST",
      body: JSON.stringify(amount),
    });
    const response = await request.json();
    console.log("response", response);
    if (response.msg === "Sucess") {
      close();
      console.log("game Data", amount);
      Cookies.remove("Numbers");
      router.push("/home");
    } else {
      alert("There was some error please try again.");
    }
  };
  const paytmNumberfetch = async () => {
    const req = await fetch("/api/getpaytm");
    const data = await req.json();
    setNum(data.Number.number);
  };
  useEffect(() => {
    paytmNumberfetch();
  });
  return (
    <>
      <Modal
        open={open}
        title="Make Payment"
        onCancel={close}
        onOk={handleOk}
        className="paymentModal"
      >
        <div className="PaymentNumText">
          {TextData.payment[`${data === 0 ? "english" : "hindi"}`]}
        </div>
       
        <div className="PayNumber">{num}</div>
        <div className="extraInfoPayment">
          {TextData.extraInfo[`${data === 0 ? "english" : "hindi"}`]}
        </div>
        <div className="betAmount">
          Amount : {CalcInvestAmount(amount, "amount")}
        </div>
        <input placeholder="Transaction id" id="paymentId" />
        <div className="winInfo">{data==1?"आपको अपने पंजीकृत मोबाइल नंबर पर जीत की राशि प्राप्त होगी":"You will receive winning amount on your registered mobile number"}</div>
        <img src="/Paymentapp.avif" height={100} />
      </Modal>
    </>
  );
};
