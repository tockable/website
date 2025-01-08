import { redirect } from "next/navigation";

export default function Page() {
  redirect(`/explore/${process.env.NEXT_PUBLIC_EXPLORE}`);
}
