import { useEffect, useState } from "react";
import MintTockable from "./mint-tockable";

export default function MintpadMintSectionTockable({
  roles,
  prepareMint,
  session,
}) {
  const [states, setStates] = useState({});

  useEffect(() => {
    if (!roles || roles.length === 0) return;
    const newStates = {};

    if (roles.length === 1) {
      newStates[roles[i].id] = true;
    } else {
      for (let i = 0; i < roles.length; i++) {
        newStates[roles[i].id] = false;
      }
    }

    setStates(newStates);
  }, [roles]);

  function handleRoleVisibility(_roleId) {
    const newStates = {};

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].id == _roleId) {
        newStates[roles[i].id] = true;
      } else {
        newStates[roles[i].id] = false;
      }

      setStates(newStates);
    }
  }

  return (
    <div>
      {roles.map((role, i) => (
        <div key={"mint-sec-" + i}>
          <MintTockable
            handleRoleVisibility={handleRoleVisibility}
            prepareMint={prepareMint}
            role={role}
            show={states[role.id]}
            session={session}
          />
        </div>
      ))}
    </div>
  );
}
