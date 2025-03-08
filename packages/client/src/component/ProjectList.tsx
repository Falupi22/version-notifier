import React, { useState } from "react";
import {
  ProgressData,
  ClientProjectInfo,
  UpgradeData,
} from "@version-notifier/common";
import { PackageIcon } from "lucide-react";
import { SSE } from "sse.js";

interface ProjectListProps {
  projects: ClientProjectInfo[];
}
export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [progress, setProgress] = useState<number>(0);
  const [updating, setUpdating] = useState<Array<number>>([]);

  const handleUpgrade = async (projectIds: Array<number>) => {
    setProgress(0);
    setUpdating([...projectIds]);
    try {
      const data: UpgradeData = {
        ids: projectIds.map((id) => id.toString()),
      };
      console.log(JSON.stringify(data));

      const eventSource: SSE = new SSE(`http://localhost:3000/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        payload: JSON.stringify(data),
      });

      eventSource.addEventListener("message", function (event) {
        console.log(event);

        const progressData: ProgressData = JSON.parse(
          event.data
        ) as ProgressData;
        if (progressData.data.type === "progress") {
          setProgress(progressData.data.progress || 0);
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setProgress(0);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "center",
        width: "100%",
        color: "white",
      }}
    >
      <div
        style={{
          display: updating.length ? "block" : "none",
          width: "30%",
          borderRadius: "8px",
          backgroundColor: "#e0e0e0",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "24px",
            width: `${progress}%`,
            backgroundColor: "green",
            borderRadius: "8px",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 8px",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
          }}
        >
          <span>Total:</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
      <button
        style={{
          backgroundColor: "#3182ce",
          color: "white",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "8px",
          width: "20%",
          border: "none",
          cursor: "pointer",
          marginBottom: "16px",
        }}
        onClick={() =>
          handleUpgrade(projects.map((project) => parseInt(project.id)))
        }
      >
        Upgrade All Projects
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              width: "50%",
              padding: "20px",
              boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
              borderWidth: "1px",
              borderRadius: "8px",
              backgroundColor: project.color?.toLowerCase() || "white",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <PackageIcon size={24} />
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {project.name}
                  </span>
                </div>
                <span
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {project.version}
                </span>
              </div>
              <span style={{ fontSize: "14px", color: "white" }}>
                {project.description}
              </span>
              <span style={{ fontSize: "14px", color: "white" }}>
                <b>What's new?</b>
              </span>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "14px",
                  color: "#abdc68",
                }}
              >
                {project.updates &&
                  project.updates
                    .trimStart()
                    .split("\n")
                    .slice(0, 3)
                    .join("\n")}
                {project.updates && project.updates.split("\n").length > 3 && (
                  <button
                    style={{
                      backgroundColor: "#3182ce",
                      color: "white",
                      padding: "4px 8px",
                      fontSize: "12px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      marginTop: "8px",
                    }}
                    onClick={() => alert(project.updates)}
                  >
                    Show More
                  </button>
                )}
              </div>
              <span
                style={{ fontSize: "14px", color: "white", marginTop: "8px" }}
              >
                Package: {project.packageName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
