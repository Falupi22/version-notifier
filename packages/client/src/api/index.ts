import axios from "axios";
import { ClientProjectInfo } from "@version-notifier/common";

const API_URL = "http://localhost:3000";

export const fetchProjects = async (): Promise<ClientProjectInfo[]> => {
  console.log("test");
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const upgradeProject = async (): Promise<void> => {
  await axios.post(`${API_URL}/upgrade`);
};
