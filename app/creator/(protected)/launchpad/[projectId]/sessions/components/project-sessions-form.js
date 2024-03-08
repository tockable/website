"use client";

import { useState, useReducer, useEffect } from "react";
import { useNetwork } from "wagmi";
import { useSession } from "next-auth/react";
import getChainData from "@/utils/chain-utils";
import DeploySessionsModal from "./modal-deploy-sessions";
import { fetchProjectByUUID } from "@/actions/launchpad/projects";
import Session from "./session-component";
import Loading from "@/components/loading/loading";
import LabeledInput from "@/components/design/labeled-input";
import { getContractAbi } from "@/actions/contract/metadata";
import SwitchNetworkButton from "@/components/design/button-switch-network";
import Fade from "@/components/design/fade/fade";
import Button from "@/components/design/button";

export default function ProjectSessionsForm({ params }) {
  // Page states
  const [token, setToken] = useState(null);
  const [project, setProject] = useState(null);
  const [lastState, setLastState] = useState(null);
  const [abiError, setAbiError] = useState(false);
  const [pleaseFillRequired, setPleaseFillRequired] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [abi, setAbi] = useState([]);
  const [sessionArgs, setSessionArgs] = useState([
    { id: 0, allowedRoles: [0], allocation: 0 },
  ]);
  const [sessions, dispatch] = useReducer(sessionReducer, []);

  const session = useSession();
  const { chain } = useNetwork();

  function handleCloseDeployModal() {
    setShowDeployModal(false);
  }

  useEffect(() => {
    if (session.status !== "authenticated") return;

    (async () => {
      const res = await fetchProjectByUUID(
        session.data.user.address,
        params.projectId
      );

      if (res.success === true) {
        setProject(res.payload);
        setLastState(res.payload);
        setToken(getChainData(Number(res.payload.chainId)).nativeToken);
      }

      // if (res.success === false) setLoadingError(true);
    })();
  }, [session]);

  useEffect(() => {
    if (!project) return;
    if (abi.length) return;

    (async () => {
      try {
        const _abi = await getContractAbi(project);
        setAbi(_abi);
      } catch (err) {
        setAbiError(true);
      }
    })();
  }, [project]);

  useEffect(() => {
    if (
      sessionArgs.length == 1 &&
      sessionArgs[0].id == 0 &&
      sessionArgs[0].allowedRoles.length == 1 &&
      sessionArgs[0].allowedRoles[0] == 0 &&
      sessionArgs[0].allocation == 0
    )
      return;
    setDeploying(false);
    setShowDeployModal(true);
  }, [sessionArgs]);

  useEffect(() => {
    if (!project) return;
    if (project.sessions.length > 0) {
      dispatch({ type: "load", sessions: project.sessions });
    } else {
      dispatch({ type: "init" });
    }
  }, [project]);

  const handleEditSession = (session) => dispatch({ type: "edit", session });
  const handleDeleteSession = (id) => dispatch({ type: "delete", id });

  async function deploy() {
    let valid = true;

    sessions.forEach((session) => {
      if (session.name.length == 0 || session.allocation.length == 0) {
        setPleaseFillRequired(true);
        valid = false;
        return;
      }
    });

    if (!valid) return;

    setDeploying(true);

    if (pleaseFillRequired) setPleaseFillRequired(false);

    const _sessionArgs = [];

    for (let i = 0; i < sessions.length; i++) {
      const roleToIntArray = [];

      for (let j = 0; j < sessions[i].roles.length; j++) {
        const sessionRoles = sessions[i].roles;
        roleToIntArray.push(Number(sessionRoles[j]));
      }
      const _session = {
        id: Number(sessions[i].id),
        allowedRoles: roleToIntArray,
        allocation: Number(sessions[i].allocation),
      };

      _sessionArgs.push(_session);
    }

    setSessionArgs(_sessionArgs);
    setDeploying(false);
  }

  return (
    <>
      {!project ? (
        <div className="flex h-64 justify-center items-center">
          <Loading isLoading={!project} size={30} />
        </div>
      ) : (
        <>
          <Fade show={!project.isDeployed}>
            <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
              <div className="flex justify-center items-center h-24 text-sm text-tock-orange">
                You need to deploy the contract first.
              </div>
            </div>
          </Fade>

          <Fade show={project.isDeployed && !project.roleDeployed}>
            <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
              <div className="flex justify-center items-center h-24 text-sm text-tock-orange">
                You need to set & deploy the roles first.
              </div>
            </div>
          </Fade>

          <Fade show={project.isDeployed && project.roleDeployed}>
            <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
              {abiError ? (
                <p className="text-tock-red text-sm">
                  something wrong, please refresh the page.
                </p>
              ) : (
                <div>
                  <div id="modal">
                    {showDeployModal && (
                      <DeploySessionsModal
                        onClose={handleCloseDeployModal}
                        writeArgs={sessionArgs}
                        project={project}
                        abi={abi}
                        sessions={sessions}
                      />
                    )}
                  </div>
                  <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
                    add minting sessions
                  </h1>
                  <p className="text-zinc-400 text-sm mb-4">
                    With setting sessions, you can control when and how people
                    can mint your collection.
                  </p>
                  {sessions.map((session, i) => {
                    if (i == 0) {
                      return (
                        <div
                          key={"session_" + i}
                          className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800"
                        >
                          <label className="block text-tock-orange text-sm font-bold mb-2">
                            <span className="text-zinc-400">0: </span>{" "}
                            {session.name}
                          </label>
                          <LabeledInput
                            value={session.allocation}
                            id={`session_allocation_${session.id}`}
                            type="number"
                            min="0"
                            step="1"
                            onChange={(e) =>
                              handleEditSession({
                                ...session,
                                allocation: e.target.value,
                              })
                            }
                            required={true}
                          >
                            token allocation for{" "}
                            <span className="text-tock-orange">
                              {session.name}
                            </span>
                          </LabeledInput>
                          <LabeledInput
                            subtitle={
                              <p>
                                <span className="text-tock-orange">
                                  DISCLAIMER:{" "}
                                </span>
                                Currently, date and time fields are only for
                                display and setting the date and time does not
                                make the contract change sessions automatically.
                                This should be done manually in the actions
                                section.
                              </p>
                            }
                            value={session.start}
                            id={`session_start_${session.id}`}
                            type="datetime-local"
                            onChange={(e) =>
                              handleEditSession({
                                ...session,
                                start: e.target.value,
                              })
                            }
                            required={true}
                          >
                            start session at{" "}
                            <span className="text-zinc-400 text-xs">(UTC)</span>
                          </LabeledInput>
                          <LabeledInput
                            value={session.end}
                            id={`session_start_${session.id}`}
                            type="datetime-local"
                            onChange={(e) =>
                              handleEditSession({
                                ...session,
                                end: e.target.value,
                              })
                            }
                            required={true}
                          >
                            end session at{" "}
                            <span className="text-zinc-400 text-xs">(UTC)</span>
                          </LabeledInput>
                        </div>
                      );
                    } else {
                      return (
                        <div key={"session_" + i}>
                          <Session
                            token={token}
                            sessions={project.sessions}
                            session={session}
                            roles={project.roles}
                            onChangeSession={handleEditSession}
                            onDeleteSession={handleDeleteSession}
                          />
                        </div>
                      );
                    }
                  })}
                  <div className="border rounded-xl border-dashed border-zinc-500 flex justify-center p-4 mb-6">
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => dispatch({ type: "add" })}
                    >
                      + add new session
                    </Button>
                  </div>
                  <div className="text-tock-orange text-xs my-4">
                    <p className="mb-2">
                      IMPORTANT* : You need to deploy changes on-chain to
                      proceed.
                    </p>
                    <p className="mb-2">
                      IMPORTANT** : sessions cannot be removed after deployment,
                      but can be changed or added.
                    </p>
                  </div>
                  {!abiError && (
                    <div>
                      {chain.id != project.chainId && (
                        <SwitchNetworkButton project={project} />
                      )}
                      {chain.id === Number(project.chainId) && (
                        <Button
                          className="xs:mt-2"
                          variant="secondary"
                          type="button"
                          onClick={() => deploy()}
                          disabled={deploying}
                        >
                          <div>
                            {deploying && (
                              <Loading isLoading={deploying} size={10} />
                            )}
                          </div>
                          {!deploying && <div> Save & Deploy</div>}
                        </Button>
                      )}
                      {pleaseFillRequired && (
                        <p className="mt-2 text-xs text-tock-red">
                          Please provide valid information for all required
                          fields.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Fade>
        </>
      )}
    </>
  );
}

function sessionReducer(sessions, action) {
  switch (action.type) {
    case "load": {
      return action.sessions;
    }

    case "init": {
      const now = new Date();
      const start = now.toISOString().slice(0, 16);
      now.setDate(now.getDate() + 1);
      const end = now.toISOString().slice(0, 16);
      return [
        {
          id: 0,
          name: "public",
          allocation: 10,
          roles: [0],
          start,
          end,
        },
      ];
    }

    case "add": {
      const id = sessions.length;
      const now = new Date();
      const start = now.toISOString().slice(0, 16);
      now.setDate(now.getDate() + 1);
      const end = now.toISOString().slice(0, 16);
      return [
        ...sessions,
        {
          id,
          name: "",
          allocation: 10,
          roles: [],
          start,
          end,
        },
      ];
    }
    case "delete": {
      const remain = sessions.filter((session) => session.id !== action.id);
      remain.forEach((session, i) => {
        session.id = i;
      });
      return remain;
    }
    case "edit": {
      return sessions.map((session) => {
        if (session.id === action.session.id) {
          return action.session;
        } else {
          return session;
        }
      });
    }
  }
}
