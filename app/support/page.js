"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import TockConnectButton from "@/components/tockConnectButton";
import { getChats, sendMessage } from "@/actions/support/support";
import Loading from "@/components/loading/loading";
import Button from "@/components/design/button";
import Footer from "@/components/design/footer";

export default function Page() {
  const { isConnected, address } = useAccount();
  const [content, setContent] = useState("");
  const [oldChats, setOldChats] = useState([]);
  const [newChats, setNewChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getChats(address);
      const _old = res.filter((c) => c.readbyuser === 1);
      const _new = res.filter((c) => c.readbyuser === 0);
      setOldChats(_old);
      setNewChats(_new);
      setLoading(false);
    })();
  }, []);

  const onChangeContent = (e) => setContent(e.target.value);

  const send = async () => {
    try {
      setWaiting(true);
      setError(false);
      const res = await sendMessage(address, "user", content);
      setOldChats(res);
      setContent("");
    } catch (e) {
      setError(true);
    }
    setWaiting(false);
  };

  return (
    <div className="mt-20 p-4 h-[100vh]">
      {!isConnected ? (
        <div className="border rounded-xl border-zinc-400 p-4 flex flex-col justify-center items-center">
          <p className="text-zinc-400 mb-4">Please connect wallet</p>
          <TockConnectButton />
        </div>
      ) : (
        <div className="flex-col h-[60%]">
          <div className="rounded-xl border border-zinc-400 h-full p-4 overflow-y-auto flex-auto">
            {loading ? (
              <div className="w-ful h-full flex justify-center items-center">
                <Loading isLoading={loading} size={20} />
              </div>
            ) : (
              <>
                {oldChats.length > 0 ? (
                  <>
                    {oldChats.map((c, i) => (
                      <div key={"old-msg-" + i}>
                        <Message data={c} />
                      </div>
                    ))}
                    {newChats.length > 0 && (
                      <>
                        <p className="border-b border-zinc-400">New!</p>
                        {newChats.map((c) => (
                          <div key={"new-msg-" + i}>
                            <Message data={c} />
                          </div>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex w-full h-full justify-center items-center text-zinc-600">
                    Nothing yet, it's good!
                  </div>
                )}
              </>
            )}
          </div>
          <div className="">
            {error && (
              <p className="text-rose-500 text-xs mt-2">
                Something happened, please try again.
              </p>
            )}
            <label className="block text-tock-blue text-sm font-bold mb-2 mt-8">
              Describe your issue:
              <p className="font-normal text-xs text-zinc-500">
                Providing collection link or contract address could help admins
                to solve the problem faster.
              </p>
            </label>
            <textarea
              value={content}
              className="text-sm appearance-none resize-none h-28 bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
              id="content"
              type="text"
              placeholder="Please Describe the issue, the more info you provide, the faster our admins find the problem "
              onChange={onChangeContent}
            />
            <div className="flex justify-center sm:justify-end">
              <Button
                className="w-44"
                variant="secondary"
                onClick={() => send()}
              >
                {waiting === true ? <Loading size={20} /> : "Send"}
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}

const Message = ({ data }) => {
  return (
    <div className="hover:bg-zinc-800 p-2">
      {data.sender === "user" && (
        <p className="text-tock-green font-bold text-xs">
          You:{" "}
          <span className="text-end text-xs text-zinc-500">
            {getDate(data.date)}
          </span>
        </p>
      )}
      {data.sender === "admin" && (
        <p className="text-tock-orange font-bold text-xs">
          Mod:{" "}
          <span className="text-end text-xs text-zinc-500">
            {getDate(data.date)}
          </span>
        </p>
      )}
      <div className="p-2">
        <p className="text-sm text-zinc-300">{data.content}</p>
      </div>
    </div>
  );
};

function getDate(_timestamp) {
  const date = new Date(Number(_timestamp));
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();

  const formattedTime =
    year + "/" + month + "/" + day + " " + hours + ":" + minutes.slice(-2);
  return formattedTime;
}
