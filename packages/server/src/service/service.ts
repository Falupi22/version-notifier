import { diffVersions } from '../shell/shell';
import * as rawData from '../../projects.json';
import fs from 'fs';
import { ClientProjectInfo } from '@version-notifier/common';

export const fetchInfo = async () => {
    setInterval(async () => {
        const projects: Array<Promise<ClientProjectInfo | null>> =
            rawData.projects.map((project) => diffVersions(project));

        const updates = await Promise.all(projects);

        // update data in projects.json
        rawData.projects.forEach((project) => {
            const result = updates.find(
                (update) => update?.id === project.id.toString()
            );

            if (!result) return;

            project.currentVersion = result.version;
            project.newestVersion = {
                version: result.version,
                description: result.description ?? '',
                date: '',
            };

            fs.writeFileSync(
                '../projects.json',
                JSON.stringify(rawData, null, 2)
            );
        });
    }, 1000 * 60 * 60 * 24); // 7 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute = 604800000 ms
};
