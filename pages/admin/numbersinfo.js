import { useRouter } from "next/router";
import Layout from "../../Components/Layout";
import react, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Switch } from "antd";
const RefferedUsers = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(0);
  const [user, setUser] = useState({});
  const [game, setGameinfo] = useState([]);
  const [numbergame, setNumberGame] = useState([]);
  const [bestTotal, setBets] = useState([]);
  const [maxbet,setMaxbet]=useState({})
  const [minBet,setMinbet]=useState({})

  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "" && userData.isAdmin) {
      setUser(userData);
    } else {
      router.push(`/?${data == 1 ? "lan=h" : "lan=en"}`);
    }
    router.query.ref && showuser();
    showgameinfo();
    console.log(router.query);
  }, []);

  // show max and min bets
  useEffect(() => {
    CheckMaxMin();
  }, []);

  // max and min number check function
  const CheckMaxMin = async () => {
    const req = await fetch("/api/showgame");
    const response = await req.json();

    const arr1 = [];
    for (var i = 0; i < response.length; i++) {
      arr1.push(response[i].game);
    }

    const newgame = [].concat(...arr1);
    const arraayData = [];

    for (var i = 1; i < 100; i++) {
      const arrData = newgame.filter((x) => x.number == i);

      const amountarr = arrData
        .map((x) => x.amount)
        .reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0);

      arraayData.push({
        number: arrData.length > 0 && arrData[0].number,
        total: amountarr,
      });
    }
    // Contains info of all numbers with total amount placed as bet
    const finalarr = arraayData.filter((x) => x.number != false);

    setBets(finalarr);
    const arr = [];
    for (var i = 0; i < finalarr.length; i++) {
      arr.push(finalarr[i].total);
    }
    const maxNum = Math.max(...arr);
    const minNum = Math.min(...arr)

    const numinfo = finalarr.filter((x) => x.total == maxNum);
    const minnuminfo = finalarr.filter((x) => x.total == minNum);

    console.info("CMax Betsss :", numinfo);
    setMaxbet(numinfo[0]);
    setMinbet(minnuminfo[0])
  };

  const showgameinfo = async () => {
    const req = await fetch("/api/showgame");
    const response = await req.json();
    console.log("Data Response from api", response);
    setGameinfo(response);
  };

  const handleLogout = () => {
    Cookies.remove("UserInfo");
    router.push(`/?${data == 1 ? "lan=h" : "lan=en"}`);
  };

  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
  };

  const showuser = async () => {
    const body = {
      reffer: router.query.ref,
    };
    const request = await fetch("/api/listreffered", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await request.json();
    setUsers(data);
  };

  const showInfo = () => {
    const Num = prompt("Enter Number to show info");
    console.log("Number selected", Number);
    const arr1 = [];

    for (var i = 0; i < game.length; i++) {
      arr1.push(game[i].game);
    }

    const arr2 = [].concat(...arr1);
    const Filtered = arr2.filter((x) => x.number == Num);
    console.log("Data", Filtered);
    setNumberGame(Filtered);
  };

  return (
    <Layout>
      <div className="LoginBtnContainer">
        <span>Change Language / भाषा बदलें</span>
        <Switch onChange={handleClick} />
      </div>
      <div className="ProfileHeader">
        <span>Home Page</span>
        <button className="logoutBtn" onClick={handleLogout}>
          {data == 0 ? "Logout" : "लॉग आउट"}
        </button>
      </div>
      <div className="ProfileHeader" onClick={() => router.push("/admin")}>
        <span>{`🔙    Back`}</span>
        <span>{`Hello ${user.name} `}&ensp;</span>
      </div>
      <div className="RefferTitle">{`Number with bets and Date`}</div>
      <div onClick={showInfo} className={"ButtonInfo"}>
        Enter Number to Filter
      </div>
      <div>{`Total Amount placed on Number ${
        numbergame.length > 0 ? numbergame[0].number : "0"
      } is Rs. ${
        numbergame.length > 0
          ? numbergame
              .map((item) => parseInt(item.amount))
              .reduce((prev, next) => prev + next)
          : "0"
      }`}</div>
      <div className="RefferedTableRoot">
        <div className="RefCol">Number</div>
        <div className="RefCol">Amount</div>
        <div className="RefCol">Date</div>
        {numbergame.length > 0 &&
          numbergame.map((x, i) => (
            <>
              <div className="RefCol">{x.number}</div>
              <div className="RefCol">{x.amount}</div>
              <div className="RefCol">{"element" + i}</div>
              {/* {console.log("Element after sorting",x)} */}
            </>
          ))}
        {numbergame.length <= 0 &&
          bestTotal.length > 0 &&
          bestTotal.map((x, i) => (
            <>
              <div className="RefCol">{x.number}</div>
              <div className="RefCol">Rs. {x.total}</div>
              <div className="RefCol">{"element" + i}</div>
              {/* {console.log("Element after sorting",x)} */}
            </>
          ))}
          <div className="">Maximum Amount Placed on Number {maxbet.number} is Rs. {maxbet.total}</div>
          <div className="">Minimum Amount Placed on Number {minBet.number} is Rs. {minBet.total}</div>
      </div>
    </Layout>
  );
};

export default RefferedUsers;
