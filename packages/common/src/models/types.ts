export interface Version {
  version: string;
  date?: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  color?: string;
  packageName: string;
  isGlobal: boolean;
  isTypes?: boolean;
  currentVersion: string;
  newestVersion: Version;
  pathDestinations: string[];
}

export interface ClientProjectInfo {
  id: string;
  color?: string;
  packageName: string;
  version: string;
  name: string;
  description?: string;
}

export interface ProgressData {
  progress?: number;
  type: "progress" | "error";
}

export interface Data {
  projects: Project[];
}
