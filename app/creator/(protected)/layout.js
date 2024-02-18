import Protected from "@/contexts/protected-context";
import NavbarLaunchpad from "@/components/design/navbar/navbar-launchpad";

export default function DashboardLayout({ children }) {
  return (
    <Protected>
      <NavbarLaunchpad />
      <div>{children}</div>
    </Protected>
  );
}
