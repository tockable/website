"use server";

export async function getJWT(maxUses) {
  const date = new Date();
  const keyRestrictions = {
    keyName: date,
    maxUses,
    permissions: {
      endpoints: {
        data: {
          pinList: false,
          userPinnedDataTotal: false,
        },
        pinning: {
          pinFileToIPFS: true,
          pinJSONToIPFS: false,
          pinJobs: false,
          unpin: false,
          userPinPolicy: false,
        },
      },
    },
  };

  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify(keyRestrictions),
    };

    const jwtRepsonse = await fetch(
      "https://api.pinata.cloud/users/generateApiKey",
      options
    );

    const json = await jwtRepsonse.json();
    if (json.error) {
      return { success: false };
    }
    const { JWT } = json;

    return { success: true, JWT };
  } catch (e) {
    return { success: false };
  }
}
