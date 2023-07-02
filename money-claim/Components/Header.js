import Image from "next/image";
import React from "react";

export default function Header() {
  return (
    <div className="Header">
      <Image src="/Logo.png" alt="MoneyClaimLogo" width={120} height={110} />
      <div className="HeaderText">Money Claim</div>
    </div>
  );
}
