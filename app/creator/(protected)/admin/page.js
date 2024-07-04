import AdminProtected from "@/contexts/admin-protected-context";
import AdminSupportSection from "./components/admin-support-section";
export default function Page() {
  return (
    <AdminProtected>
      <AdminSupportSection />
    </AdminProtected>
  );
}
