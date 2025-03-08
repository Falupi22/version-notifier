import { ClientProjectInfo, Project } from '@version-notifier/common';
import axios, { AxiosResponse } from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const installPackage = async (
    project: Project,
    destination: string
): Promise<boolean> => {
    const command = `npm ${
        project.isGlobal ? 'install -g' : 'install --save'
    } ${project.packageName}@latest`;
    try {
        const { stdout, stderr } = await execAsync(command, {
            cwd: destination,
        });
        console.log(stdout);
        console.error(stderr);
        console.log(`Package ${project.packageName} installed successfully.`);
        return true;
    } catch (error) {
        console.error(
            `Error updating ${project.name} at ${destination}:`,
            error
        );
        return false;
    }
};

export const diffVersions = async (
    project: Project
): Promise<ClientProjectInfo | null> => {
    const { stdout } = await execAsync(
        `npm view ${project.packageName} version`
    );
    console.log(stdout);
    const latestVersion = stdout.trim();
    let update: ClientProjectInfo | null = null;

    if (latestVersion !== project.currentVersion) {
        const { stdout: description } = await execAsync(
            `npm view ${project.packageName}@${latestVersion} description`
        );

        let updates: string | undefined = undefined;

        try {
            const response = await axios.get(project.repoUrl);
            updates = response.data?.body;
        } catch (error) {
            console.error(`Error fetching ${project.name} repo:`, error);
        }

        update = {
            id: project.id.toString(),
            version: latestVersion,
            name: project.name,
            color: project.color,
            packageName: project.packageName,
            description: description.trim(),
            updates,
        };
    }

    return update;
};
