import ProjectNavigation from "./project-navigation";

export default function LaunchpadLayout({ children }) {
  return (
    <div id="banner" className="h-screen mt-20">
      <div className="flex mt-10 justify-center">
        <div className="flex flex-col md:flex-row mt-10 basis-11/12 sm:basis-5/6">
          <ProjectNavigation />
          <div className="flex flex-auto">
            <div className="basis-full lg:basis-5/6 xl:basis-4/6 justify-center items-center">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
