"use client";

import { useState, createContext, useEffect } from "react";
// import { toast, ToastContainer, Bounce } from "react-toastify";
// import { ls } from "@/utils/utils";
import ShareModal from "./modals/share-modal";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";

export const MintContextRegular = createContext();

export default function MintProviderRegular({ project, abi, children }) {
  // const setFollowState = () => {
  //   return ls()
  //     ? Boolean(localStorage.getItem("tockfollow"))
  //       ? Boolean(localStorage.getItem("tockfollow"))
  //       : false
  //     : true;
  // };
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [mintData, setMintData] = useState({ quantity: 0, address: "0x0" });
  const [successfullyMinted, setSuccessfullyMinted] = useState(true);
  // const [isFollow, setFollow] = useState(setFollowState());

  // useEffect(() => {
  //   if (!successfullyMinted) return;

  //   toast.success(<Success isFollow={isFollow} setFollow={setFollow} />, {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: false,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //     transition: Bounce,
  //     onClose: () => setSuccessfullyMinted(false),
  //   });
  // }, [successfullyMinted]);

  return (
    <MintContextRegular.Provider
      value={{
        project,
        abi,
        ref,
        setSuccessfullyMinted,
        setMintData,
      }}
    >
      {successfullyMinted && (
        <ShareModal
          project={project}
          mintData={mintData}
          onClose={() => setSuccessfullyMinted(false)}
        />
      )}
      {/* <ToastContainer closeOnClick={false} /> */}
      {children}
    </MintContextRegular.Provider>
  );
}

// function Success({ isFollow, setFollow }) {
//   return (
//     <div>
//       <p className="text-sm font-bold text-white">Successfully minted!</p>
//       {!isFollow && (
//         <div>
//           <p className="text-xs mt-4 text-white">
//             If you enjoy, please follow us on X
//           </p>
//           <button
//             className="my-4"
//             onClick={() => {
//               localStorage.getItem("tockfollow");
//               if (ls()) {
//                 setFollow(true);
//                 localStorage.setItem("tockfollow", "true");
//               }
//             }}
//           >
//             <a
//               href="https://twitter.com/Tockablexyz?ref_src=twsrc%5Etfw"
//               data-show-count="false"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="border px-2 py-2 rounded-2xl hover:bg-tock-semiblack transition duration-200"
//             >
//               Follow @Tockablexyz
//             </a>
//           </button>
//           <script
//             async
//             src="https://platform.twitter.com/widgets.js"
//             charset="utf-8"
//           ></script>
//         </div>
//       )}
//     </div>
//   );
// }
