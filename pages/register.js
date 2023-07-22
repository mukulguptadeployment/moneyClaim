import Link from "next/link";
import React, { useState } from "react";
import Layout from "../Components/Layout";
import RegisterFrom from "../Components/RegisterForm";
import Data from "../JSON/Register.json";

const Home = () => {
  const [data, setData] = useState(0);
  const labels = {
    name: Data.name[`${data === 0 ? "english" : "hindi"}`],
    email: Data.email[`${data === 0 ? "english" : "hindi"}`],
    Phonenumber: Data.Phonenumber[`${data === 0 ? "english" : "hindi"}`],
    refferalCode: Data.refferalCode[`${data === 0 ? "english" : "hindi"}`],
    password: Data.password[`${data === 0 ? "english" : "hindi"}`],
    confirmPassword:
      Data.confirmPassword[`${data === 0 ? "english" : "hindi"}`],
  };
  const handleClick = () => {
    setData(data === 0 ? 1 : 0);
    const new_url=new URL(window.location.href);
    const search_params=new_url.searchParams;
    search_params.set('lan', ` ${ data==0 ? "en" : "h" } `);
  };
  useEffect(() => {
    console.info("test Location",window.location.href.includes("lan=h") ? "hindi" : "english");
    setData(window.location.href.includes("lan=h") ? 1 : 0)
  }, []);
  return (
    <main>
      <Layout>
        <div className="LoginBtnContainer">
          <button onClick={handleClick} className={"LanguageButton"}>
            Change Language / भाषा बदलें
          </button>
        </div>
        <div className="FormContainer">
          <div className="LoginForm">
            {Data.Pagetitle[`${data === 0 ? "english" : "hindi"}`]}
          </div>
          <RegisterFrom formlabels={labels} />
          <span className="divider">-----------OR-----------</span>
          <Link href="/">
            <span className="CreateAccount">
              {Data.Login[`${data === 0 ? "english" : "hindi"}`]}
            </span>
          </Link>
        </div>
      </Layout>
    </main>
  );
};

export default Home;
