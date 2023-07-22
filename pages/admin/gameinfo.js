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

  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "" && userData.isAdmin) {
      setUser(userData);
    } else {
      router.push(`/?${data==1?"lan=h":"lan=en"}`);
    }
    router.query.ref && showuser();
    showgameinfo();
    console.log(router.query);
  }, []);
  const showgameinfo = async () => {
    const req = await fetch("/api/showgame");
    const response = await req.json();
    console.log(response);
    setGameinfo(response);
  };
  const handleLogout = () => {
    Cookies.remove("UserInfo");
    router.push(`/?${data==1?"lan=h":"lan=en"}`);
  };
  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
    const new_url=new URL(window.location.href);
    const search_params=new_url.searchParams;
    search_params.set('lan', ` ${ data==0 ? "en" : "h" } `);
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
    console.log(data);
    setUsers(data);
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
          {data==0?"Logout":"लॉग आउट"}
        </button>
      </div>
      <div className="ProfileHeader" onClick={() => router.push("/admin")}>
        <span>{`🔙    Back`}</span>
        <span>{`Hello ${user.name} `}&ensp;</span>
      </div>
      <div className="RefferTitle">{`Number with bets and Date`}</div>
      <div className="RefferedTableRoot">
        <div className="RefCol">Number</div>
        <div className="RefCol">Amount</div>
        <div className="RefCol">Date</div>
        {game.length > 0 &&
          game.map((e, i) =>
            e.game.map((x, i) => {
              return (
                <>
                  <div className="RefCol">{x.number}</div>
                  <div className="RefCol">{x.amount}</div>
                  <div className="RefCol">{Date(e.date).toString()}</div>
                </>
              );
            })
          )}
      </div>
    </Layout>
  );
};

export default RefferedUsers;
