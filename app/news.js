"use client";

import { useState } from "react";

export default function News() {
  const [isClose, setClose] = useState(false);
  const handleClose = () => setClose(true);

  return <>{!isClose && <Message handleClose={handleClose} />}</>;
}

function Message({ handleClose }) {
  return (
    <div className="z-30 fixed flex justify-center items-center bottom-0 text-sm w-full h-10 bg-yellow-300 text-center text-tock-black">
      <button
        className="transition duration-200 text-tock-black hover:text-red-500 absolute right-2 mt-1"
        onClick={handleClose}
      >
        &#x2715;
      </button>
      <div className="text-xs font-bold">
        Earn Tockable XP (TXP){" "}
        <a
          className="text-blue-500 hover:text-blue-300 cursor-pointer"
          href="/docs/tockable-xp"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more &gt;
        </a>
      </div>
    </div>
  );
}
