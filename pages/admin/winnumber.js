import { Switch } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout";
import Data from "../../JSON/admin.json";
import { Button, Modal } from "antd";
import Link from "next/link";

export default function Users() {
  const [data, setData] = useState(0);
  const [login, setLogin] = useState(false);
  const [userInfoData, setUserInfoData] = useState([""]);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [userModalData, setUserModalData] = useState("");
  const router = useRouter();
  useEffect(() => {
    let userData = Cookies.get("UserInfo");
    userData = userData && JSON.parse(userData);
    if (userData && userData.name !== "" && userData.isAdmin) {
      setUser(userData);
      setLogin(true);
    } else {
      router.push("/");
    }
    ShowUsers();
  }, [login, router]);
  useEffect(() => {
    console.log(userModalData);
    userModalData !== "" && setOpen(true);
  }, [userModalData]);
  const ShowUsers = async () => {
    const request = await fetch(
      `/api/shownumber`
    );
    console.log("Response", request);
    const data = await request.json();
    setUserInfoData(data);
  };
  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
  };
  const handleLogout = () => {
    Cookies.remove("UserInfo");
    setLogin(false);
    router.push("/");
  };
  const ShowUserInfo = (e) => {
    console.log("User Info Index", e);
    setUserModalData(e);
  };
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
            {data==0?"Logout":"लॉग आउट"}
          </button>
        </div>
        <div className="ProfileHeader" onClick={() => router.push("/admin")}>
          <span>{`🔙    Back`}</span>
          <span>{`Hello ${user.name} `}&ensp;</span>
        </div>
        <div className="ListUsersParent">
          <div className="ListUsers">
            <div className="ListUserHead">id</div>
            <div className="ListUserHead">Number</div>
            <div className="ListUserHead">Date</div>
            <div className="ListUserHead"></div>
            {userInfoData &&
              userInfoData.map((e, i) => (
                <>
                  <div key={i}>
                    <span>{e._id}</span>
                  </div>
                  <div key={i + 1}>
                    <span>{e.number}</span>
                  </div>
                  <div key={i + 2}>
                    <span>{e.time}</span>
                  </div>
                  <div></div>
                </>
              ))}
          </div>
        </div>
        <div className="InfoContest">{`Total Number ${
          userInfoData && userInfoData.length
        }`}</div>
        <div className="ActiveUsers">
          {Data.activeuser[`${data === 0 ? "english" : "hindi"}`]}
        </div>
        <MsgModal
          open={open}
          setOpen={setOpen}
          content={JSON.stringify(userModalData)}
        />
      </Layout>
    )
  );
}

const MsgModal = ({ open, setOpen, content }) => {
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const UserInfo =
    content !== ""
      ? JSON.parse(content)
      : {
          _id: "",
          name: "",
          email: "",
          phoneNumber: "",
          isAdmin: "",
          refferalCode: "",
        };
  const handleDelete = async () => {
    if (UserInfo._id !== "") {
      const sure = confirm(
        "Are You Sure You want to delete This Account This Action can't be Undone"
      );
      console.log(sure);
      if (sure) {
        const deleteRequest = await fetch(
          `${process.env.NEXT_PUBLIC_API_ROOT}/api/deleteuser`,
          {
            method: "POST",
            body: JSON.stringify({ _id: UserInfo._id }),
          }
        );
        deleteRequest.status === 200 && window.location.reload(false);
      }
    }
  };
  return (
    <>
      <Modal
        open={open}
        title={`Account Info of ${UserInfo && UserInfo.name} `}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Okay
          </Button>,
          <Button key="delete" type="primary" onClick={handleDelete}>
            Delete User
          </Button>,
        ]}
      >
        <ul className="MsgModalUser">
          <li>
            <span>User DataBaseID</span>
            <span>{UserInfo && UserInfo._id.substring(0, 9)}</span>
          </li>
          <li>
            <span>User Name</span>
            <span>{UserInfo && UserInfo.name}</span>
          </li>
          <li>
            <span>User Email</span>
            <span>{UserInfo && UserInfo.email}</span>
          </li>
          <li>
            <span>User PhoneNumber </span>
            <span>{UserInfo && UserInfo.phoneNumber}</span>
          </li>
          <li>
            <span>User isAdmin </span>
            <span>{UserInfo && UserInfo.isAdmin}</span>
          </li>
          <li>
            <span>User referralCode </span>
            <span>{UserInfo && UserInfo.refferalCode}</span>
          </li>
          <li>
            <Link href="/">
              <span>View Friends Joined by refference </span>
            </Link>
          </li>
        </ul>
      </Modal>
    </>
  );
};
