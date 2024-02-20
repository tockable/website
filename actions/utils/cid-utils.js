import { toHex32 } from "@/utils/crypto-utils";

export default function getCidTuple(_cid) {
  const _part1 = _cid.slice(0, 32);
  const _part2 = _cid.slice(32);

  const hexPart1 = toHex32(_part1);
  const hexPart2 = toHex32(_part2);

  return { part1: hexPart1, part2: hexPart2 };
}

export function decodeCid(_cidTuple) {
  const _part1 = _cidTuple.part1.slice(2);
  const _part2 = _cidTuple.part2.slice(2);

  let decodedPart1 = hexDecode(_part1);
  let decodedPart2 = hexDecode(_part2);

  const cid = decodedPart1 + decodedPart2;

  return cid;
}
