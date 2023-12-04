import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import UberContext from "../context/UberContext";

const Metamask = () => {
  const { connectWallet, setCurrentUser, currentUser } =
    useContext(UberContext);

  const router = useRouter();

  useEffect(() => {
    console.log(currentUser);
    currentUser && router.push("/");
  }, []);

  return (
    <div className='bg-[#E5E7EB] h-[100vh]'>
      <div className='h-[calc(100vh-150px)] w-full flex flex-col items-center justify-center bg-[#E5E7EB] p-4'>
        <Image
          src='/MetaMask.svg'
          width={700}
          height={200}
          className='mb-[200px]'
        />
        <button
          className='bg-black text-white text-center py-4 mt-8 self-center w-full rounded-lg
          transform transition-all hover:shadow-lg duration-300'
          onClick={() => connectWallet()}
        >
          Sign in with Metamask
        </button>
      </div>
    </div>
  );
};

export default Metamask;
