import Link from "next/link";
import React from "react";
import Image from "next/image";

const LpHeader = () => {
  return (
    <header className="flex w-screen items-center justify-between gap-4 bg-gray-50 p-8 shadow-sm md:px-16">
      <Link href={"/"}>
        <Image src={"/header.png"} alt="PARADIA" height={100} width={150} />
      </Link>
    </header>
  );
};

export default LpHeader;
