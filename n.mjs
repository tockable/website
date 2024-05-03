import { CID } from "multiformats/cid";

const cid = "QmNNbHvpiian3jTrpGVQdnAdj29fwNBYa44dAVbV6zqLCj";
const v0 = CID.parse(cid);

v0.toString();

const cidV1 = v0.toV1().toString();

console.log(cidV1);
