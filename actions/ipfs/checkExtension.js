import { CID } from "multiformats/cid";

export async function checkExtension(cid) {
  if (cid.match(/^Qm/)) {
    try {
      const res = await fetch(`https://ipfs.io/ipfs/${cid}/1`);
      const json = await res.json();
      if (json) return false;
    } catch (_) {
      try {
        const res = await fetch(`https://ipfs.io/ipfs/${cid}/1.json`);
        const json = await res.json();

        if (json) return true;
      } catch (_) {
        const v0 = CID.parse(cid);

        v0.toString();

        const cidV1 = v0.toV1().toString();

        try {
          const res = await fetch(`https://${cidV1}.ipfs.nftstorage.link/1`);
          const json = await res.json();

          if (json) return false;
        } catch (_) {
          try {
            const res = await fetch(
              `https://${cidV1}.ipfs.nftstorage.link/1.json`
            );

            const json = await res.json();

            if (json) return true;
          } catch (_) {
            return true;
          }
        }
      }
    }
  } else {
    try {
      const res = await fetch(`https://${cid}.ipfs.nftstorage.link/1`);
      const json = await res.json();
      if (json) return false;
    } catch (_) {
      try {
        const res = await fetch(`https://${cid}.ipfs.nftstorage.link/1.json`);
        const json = await res.json();
        if (json) return true;
      } catch (_) {
        return true;
      }
    }
  }
}
