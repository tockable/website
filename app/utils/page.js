import { createDb } from "@/scripts/createdb";

export default function Page() {
  return (
    <button className="p-2 bg-red-200" onClick={() => createDb()}>
      create
    </button>
  );
}
