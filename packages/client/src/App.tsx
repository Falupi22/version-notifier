import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/toast";
import { ProjectList } from "./component/ProjectList";
import { ClientProjectInfo } from "@version-notifier/common";
import { fetchProjects } from "./api";
//const socket = io("http://localhost:3000");

function App() {
  const [projects, setProjects] = useState<ClientProjectInfo[]>([]);
  const toast = useToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          title: "Error loading projects",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    loadProjects();

    /*socket.on("updates", (payload: Project) => {
      setProjects((currentProjects) =>
        currentProjects.map((project) => {
          const update = payload.projects.find(
            (p: { id: unknown }) => p.id === project.id.toString()
          );
          if (update) {
            return {
              ...project,
              newestVersion: {
                version: update.newVersion,
                description: update.description,
              },
            };
          }
          return project;
        })
      );

      toast({
        title: "Updates Available",
        description: "New versions are available for some projects",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    });*/
  }, [toast]);

  return (
    <div
      style={{
        padding: "2rem",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          alignItems: "stretch",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "2rem", textAlign: "center" }}>Daily Updates</h1>
        <div id="project-list">
          <ProjectList projects={projects} />
        </div>
      </div>
    </div>
  );
}

export default App;
