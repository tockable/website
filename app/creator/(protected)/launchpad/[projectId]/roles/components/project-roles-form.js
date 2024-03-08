"use client";

import { useState, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";
import { parseEther } from "viem";
import { useNetwork } from "wagmi";
import { fetchProjectByUUID } from "@/actions/launchpad/projects";
import { getContractAbi } from "@/actions/contract/metadata";
import DeployRolesModal from "./modal-deploy-roles";
import Fade from "@/components/design/fade/fade";
import Loading from "@/components/loading/loading";
import Role from "./role-component";
import LabeledInput from "@/components/design/labeled-input";
import SwitchNetworkButton from "@/components/design/button-switch-network";
import Button from "@/components/design/button";
import getChainData from "@/utils/chain-utils";

export default function ProjectRolesForm({ params }) {
  // Pages states
  const [project, setProject] = useState(null);
  const [token, setToken] = useState(null);
  const [roles, dispatch] = useReducer(roleReducer, []);
  const [deploying, setDeploying] = useState(false);
  const [pleaseFillRequired, setPleaseFillRequired] = useState(false);
  const [abiError, setAbiError] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [abi, setAbi] = useState([]);
  const [rolesArg, setRoleArg] = useState([
    { id: 0, price: 0, maxAllowedMint: 0 },
  ]);

  const session = useSession();
  const { chain } = useNetwork();

  const handleCloseDeployModal = () => setShowDeployModal(false);
  const handleEditRole = (role) => dispatch({ type: "edit", role });
  const handleDeleteRole = (id) => dispatch({ type: "delete", id });

  // const updateNeeded = () => !isEqual(project.roles, roles);

  useEffect(() => {
    if (session.status !== "authenticated") return;

    (async () => {
      const res = await fetchProjectByUUID(
        session.data.user.address,
        params.projectId
      );

      if (res.success === true) {
        setProject(res.payload);
        setToken(getChainData(Number(res.payload.chainId)).nativeToken);
        // setLastState(res.payload);
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
      rolesArg.length == 1 &&
      rolesArg[0].id == 0 &&
      rolesArg[0].price == 0 &&
      rolesArg[0].maxAllowedMint == 0
    ) {
      return;
    }

    setDeploying(false);
    setShowDeployModal(true);
  }, [rolesArg]);

  useEffect(() => {
    if (!project) return;
    if (project.roles.length > 0) {
      dispatch({ type: "load", roles: project.roles });
    } else {
      dispatch({ type: "init" });
    }
  }, [project]);

  async function deploy() {
    let valid = true;

    roles.forEach((role) => {
      if (
        role.name.length == 0 ||
        role.quota.length == 0 ||
        role.price.length == 0
      ) {
        setPleaseFillRequired(true);
        valid = false;
        return;
      }
    });

    if (!valid) return;

    setDeploying(true);

    if (pleaseFillRequired) setPleaseFillRequired(false);

    const _roleArgs = [];

    for (let i = 0; i < roles.length; i++) {
      const _role = {
        id: Number(roles[i].id),
        price: parseEther(
          Number(roles[i].price * 1_000_000_000).toString(),
          "gwei"
        ),
        maxAllowedMint: Number(roles[i].quota),
      };

      _roleArgs.push(_role);
    }

    setRoleArg(_roleArgs);
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

          <Fade show={project.isDeployed}>
            <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
              {abiError ? (
                <p className="text-tock-red text-sm">
                  something wrong, please refresh the page.
                </p>
              ) : (
                <div>
                  <div id="modal">
                    {showDeployModal && (
                      <DeployRolesModal
                        onClose={handleCloseDeployModal}
                        writeArgs={rolesArg}
                        project={project}
                        abi={abi}
                        roles={roles}
                      />
                    )}
                  </div>
                  <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
                    Add minting roles
                  </h1>
                  <p className="text-zinc-400 text-sm mb-4">
                    You can set whitelists or any other roles you want
                  </p>
                  {roles.map((role, i) => {
                    if (i == 0) {
                      return (
                        <div
                          key={"role_" + i}
                          className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800"
                        >
                          <label className="block text-tock-orange text-sm font-bold mb-2">
                            <span className="text-zinc-400">0: </span>{" "}
                            {role.name}
                          </label>
                          <LabeledInput
                            value={role.quota}
                            type="number"
                            min="0"
                            step="1"
                            onChange={(e) =>
                              handleEditRole({ ...role, quota: e.target.value })
                            }
                            required={true}
                          >
                            max allowed mint by each address{" "}
                            <span className="text-xs font-normal text-zinc-400">
                              (required)
                            </span>
                          </LabeledInput>
                          <LabeledInput
                            value={role.price}
                            type="number"
                            min="0"
                            step="0.0001"
                            placeholder="0.0005"
                            onChange={(e) =>
                              handleEditRole({ ...role, price: e.target.value })
                            }
                            required={true}
                          >
                            price for{" "}
                            <span className="text-tock-orange">public</span>{" "}
                            mint {`(${token})`}
                            <span className="text-xs font-normal text-zinc-400">
                              (required)
                            </span>
                          </LabeledInput>
                        </div>
                      );
                    } else {
                      return (
                        <div key={"role_" + i}>
                          <Role
                            roles={project.roles}
                            role={role}
                            onChangeRole={handleEditRole}
                            onDeleteRole={handleDeleteRole}
                            token={token}
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
                      + add new role
                    </Button>
                  </div>
                  <div className="text-tock-orange text-xs my-4">
                    <p className="mb-2">
                      IMPORTANT* : You need to deploy changes on-chain to
                      proceed.
                    </p>
                    <p className="mb-2">
                      IMPORTANT** : roles cannot be removed after deployment,
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
                          {deploying ? (
                            <Loading isLoading={deploying} size={10} />
                          ) : (
                            "Save & Deploy"
                          )}
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

function roleReducer(roles, action) {
  switch (action.type) {
    case "load": {
      return action.roles;
    }

    case "init": {
      return [
        {
          id: 0,
          name: "public",
          quota: 5,
          price: "",
          allowedAddresses: [],
        },
      ];
    }

    case "add": {
      const id = roles.length;
      return [
        ...roles,
        {
          id,
          name: "",
          quota: 0,
          price: "",
          allowedAddresses: [],
        },
      ];
    }

    case "delete": {
      const remain = roles.filter((role) => role.id !== action.id);
      remain.forEach((role, i) => {
        role.id = i;
      });
      return remain;
    }

    case "edit": {
      return roles.map((role) => {
        if (role.id === action.role.id) {
          return action.role;
        } else {
          return role;
        }
      });
    }
  }
}
