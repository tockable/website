import Navbar from "@/components/design/navbar/navbar-home";
import DocsNavigation from "./components/docs-navigation";

export default function DocsLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="mt-24 flex">
        <DocsNavigation />
        <div className="h-[80vh] overflow-scroll ml-4">
          <div className="border border-zinc-500 bg-zinc-800/20 rounded-2xl p-4 mr-[10%]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
