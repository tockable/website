import { useState, useEffect } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { updateProject } from "@/actions/launchpad/projects";
import Loading from "@/components/loading/loading";
import Button from "@/components/design/button";

export default function ActionSetActiveSession({ abi, _project }) {
  const [project, setProject] = useState(_project);
  const [key, setKey] = useState(1);
  const [ready, setReady] = useState(false);

  const [sessionToActive, setSessionToActive] = useState("0");
  const [args, setArgs] = useState(null);
  const [isWriting, setWriting] = useState(false);
  const [sessionName, setSessionName] = useState();
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!project) return;
    setSessionToActive(
      project.activeSession.toString().length === 0
        ? "0"
        : project.activeSession.toString()
    );
    setArgs(Number(sessionToActive));
  }, [project]);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "setActiveSession",
    args: [args],
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  function onChangeActiveSession(e) {
    setSessionToActive(e.target.value);
  }

  useEffect(() => {
    if (!uwt.isSuccess) return;
    setWriting(true);

    (async () => {
      try {
        const { creator, uuid } = project;
        const updatedProject = await updateProject(creator, {
          uuid,
          activeSession: Number(sessionToActive),
        });
        setProject(updatedProject);
        setUpdated(true);
        setKey(key + 1);
      } catch (err) {}
    })();

    setWriting(false);
  }, [uwt.isSuccess]);

  useEffect(() => {
    if (!sessionToActive) return;
    const _sessionName = getActiveSessionName(sessionToActive);
    setSessionName(_sessionName);
  }, [sessionToActive]);

  function getActiveSessionName(_sessionToActive) {
    const _session = project.sessions.find(
      (session) => session.id == _sessionToActive
    );

    if (_session) return _session?.name;
  }

  return (
    <section id="set-active-session">
      <div key={key}>
        <h1 className="font-bold text-sm text-tock-blue mb-2 ">
          Select a session you want to set:
        </h1>
        {project.paused === true && (
          <div className="bg-orange-500/10 p-2 rounded-xl mt-4 mb-8">
            <p className="font-normal text-xs text-tock-orange mb-4 ">
              Contract minting is <b>Paused</b>. You should <b>Start</b> the
              mint on the "Pause/Unpaused" section to enable minting.
            </p>
          </div>
        )}
        {project.sessions.length > 0 &&
          project.sessions.map((session, i) => {
            return (
              <div
                className="flex items-center my-2"
                key={"session-to-acitve-" + i}
              >
                <input
                  id={"sessions_" + i}
                  type="radio"
                  name="sessions"
                  value={session.id}
                  className="w-4 h-4 accent-tock-green text-blue-100"
                  onChange={onChangeActiveSession}
                  checked={sessionToActive == session.id}
                />

                <label className="grid font-bold grid-cols-3 ml-2 text-xs border border-zinc-400 rounded-2xl p-2 w-full">
                  <p className="text-tock-orange">
                    {session.name}
                    {Number(session.id) === Number(project.activeSession) &&
                      project.activeSession.toString().length > 0 && (
                        <span className="text-zinc-400"> (active)</span>
                      )}
                  </p>
                </label>
              </div>
            );
          })}
      </div>
      <Button
        disabled={isLoading || uwt.isLoading || isWriting || !write}
        className="mt-4"
        variant={"secondary"}
        onClick={() => write?.()}
      >
        {(isLoading || uwt.isLoading || isWriting) && (
          <Loading
            isLoading={isLoading || uwt.isLoading || isWriting}
            size={10}
          />
        )}
        {!isLoading && !uwt.isLoading && !isWriting && (
          <p>
            active "{sessionName}" session (session id: {sessionToActive})
          </p>
        )}
      </Button>
      {(isLoading || uwt.isLoading || isWriting) && (
        <p className="text-tock-orange mt-2 text-xs">
          do not close this window, or change tab...
        </p>
      )}
      {isError && <p className="text-tock-red mt-2 text-xs">{error.name}</p>}
      {uwt.isError && (
        <p className="text-tock-red mt-2 text-xs">transaction failed</p>
      )}
      {updated && (
        <p className="text-tock-green mt-2 text-xs">
          active session updated successfully
        </p>
      )}
    </section>
  );
}
