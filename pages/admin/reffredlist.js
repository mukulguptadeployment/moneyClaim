import { useRouter } from "next/router";
import Layout from "../../Components/Layout";
import react, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Switch } from "antd";
const RefferedUsers = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [data,setData]=useState(0)
  const [user, setUser] = useState({});

  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "" && userData.isAdmin) {
      setUser(userData);
    } else {
      router.push("/");
    }
    router.query.ref && showuser();
    console.log(router.query);
  }, []);
  const handleLogout = () => {
    Cookies.remove("UserInfo");
    router.push("/");
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
    console.log(data);
    setUsers(data)
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
      <div className="RefferTitle">{`People Joined by Refrence id of ${router.query.user}`}</div>
      <div className="RefferedTableRoot">
        <div className="RefCol">Name</div>
        <div className="RefCol">Email</div>
        <div className="RefCol">Phone</div>
        {users.length>0 ? users.map((e,i)=><>
            <div className="RefCol">{e.name}</div>
            <div className="RefCol">{e.email}</div>
            <div className="RefCol">{e.phoneNumber}</div>
        </>) : <div>No Refferals</div>}
      </div>
    </Layout>
  );
};

export default RefferedUsers;
