import React from "react";
import Link from "next/link";
import Image from "next/image";

const AuthHeader = () => {
  return (
    <header className="flex w-screen items-center justify-between gap-4 bg-gray-50 p-8 shadow-sm md:px-16">
      <Link href={"/"} className="text-xl md:text-2xl">
        <Image
          src={"/header.png"}
          alt="PARADIA"
          height={100}
          width={190}
          className="mb-2"
        />
      </Link>
      <div className="space-x-8">
        <div className="hidden space-x-4 sm:inline">
          <Link
            href="/auth/login"
            className="relative rounded-md px-3 py-2 font-medium text-stone-700 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-gray-500 before:transition-all before:duration-300 hover:text-gray-600 hover:before:w-full"
          >
            ログイン
          </Link>
          <Link
            href="/auth/sign-up"
            className="relative items-center rounded-md px-3 py-2 font-medium text-stone-700 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-gray-500 before:transition-all before:duration-300 before:ease-in-out hover:text-gray-600 hover:before:w-full"
          >
            登録
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
