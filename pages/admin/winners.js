import { useRouter } from "next/router";
import Layout from "../../Components/Layout";
import react, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Switch } from "antd";
const RefferedUsers = () => {
  const router = useRouter();
  const [data, setData] = useState(0);
  const [user, setUser] = useState({});

  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "" && userData.isAdmin) {
      setUser(userData);
    } else {
      router.push(`/?${data == 1 ? "lan=h" : "lan=en"}`);
    }
    router.query.ref && showuser();
    showWinners();
  }, []);

  const handleLogout = () => {
    Cookies.remove("UserInfo");
    router.push(`/?${data == 1 ? "lan=h" : "lan=en"}`);
  };

  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
  };

  const showWinners = async () => {
    const req = await fetch("/api/showgame");
    const response = await req.json();
    const y = new Date();
    const arr = [
      "jan",
      "feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const search =
      arr[parseInt(y.getMonth())] +
      " " +
      parseInt(y.getDate() - 1) +
      " " +
      y.getFullYear();
    const winnArr = response.filter((x) => x.date.includes(search));
    console.log(winnArr);
  };

  return (
    <Layout>
      <div className="LoginBtnContainer">
        <span>Change Language / भाषा बदलें</span>
        <Switch onChange={handleClick} />
      </div>
      <div className="ProfileHeader">
        <span>Winners Page</span>
        <button className="logoutBtn" onClick={handleLogout}>
          {data == 0 ? "Logout" : "लॉग आउट"}
        </button>
      </div>
      <div className="ProfileHeader" onClick={() => router.push("/admin")}>
        <span>{`🔙    Back`}</span>
        <span>{`Hello ${user.name} `}&ensp;</span>
      </div>

      <div className="RefferedTableRoot">
        <div className="RefCol">Number</div>
        <div className="RefCol">Amount</div>
        <div className="RefCol">UserName</div>
        {}
      </div>
    </Layout>
  );
};

export default RefferedUsers;
