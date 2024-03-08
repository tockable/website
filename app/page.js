import FirstPage from "@/components/first-page";
import { TOCKABLE_METADATA } from "@/constants/metadata";

export async function generateMetadata() {
  return TOCKABLE_METADATA;
}

export default async function Page() {
  return <FirstPage />;
}
