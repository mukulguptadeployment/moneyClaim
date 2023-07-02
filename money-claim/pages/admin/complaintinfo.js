import { useRouter } from "next/router";
import Layout from "../../Components/Layout";
import react, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Switch } from "antd";
const RefferedUsers = () => {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [data, setData] = useState(0);
  const [user, setUser] = useState({});

  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "" && userData.isAdmin) {
      setUser(userData);
    } else {
      router.push("/");
    }
    showComplaintsData()
  }, []);
  
  const handleLogout = () => {
    Cookies.remove("UserInfo");
    router.push("/");
  };
  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
  };
  const showComplaintsData = async () => {
    const request = await fetch("/api/complaint/view");
    const data = await request.json();
    console.log(data);
    setComplaints(data);
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
          Logout
        </button>
      </div>
      <div className="ProfileHeader" onClick={() => router.push("/admin")}>
        <span>{`🔙    Back`}</span>
        <span>{`Hello ${user.name} `}&ensp;</span>
      </div>
      <div className="RefferedTableRoot1">
        <div className="RefCol">Name</div>
        <div className="RefCol">Message</div>
       {complaints.map((e,i)=>{
        return(
            <>
            <div className="RefCol">{e.name}</div>
            <div className="RefCol">{e.msg}</div>
            </>
        )
       })

       }
      </div>
    </Layout>
  );
};

export default RefferedUsers;
