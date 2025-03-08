import { diffVersions } from '../shell/shell';
import * as rawData from '../../projects.json';
import fs from 'fs';
import { ClientProjectInfo } from '@version-notifier/common';
import cron from 'node-cron';

export const fetchInfo = async () => {
    cron.schedule('0 11 * * *', async () => {
        const projects: Array<Promise<ClientProjectInfo | null>> =
            rawData.projects.map((project) => diffVersions(project));

        const updates = await Promise.all(projects);

        // update data in projects.json
        rawData.projects.forEach((project) => {
            const result = updates.find(
                (update) => update?.id === project.id.toString()
            );

            if (!result) return;

            project.newestVersion = {
                version: result.version,
                description: result.description ?? '',
                date: '',
                updates: result.updates ?? 'fetch error',
            };

            fs.writeFileSync(
                '../../projects.json',
                JSON.stringify(rawData, null, 2)
            );
        });
    }); // 7 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute = 604800000 ms
};

export const getProjects = async () => {
    const projects: Array<Promise<ClientProjectInfo | null>> =
        rawData.projects.map((project) => diffVersions(project));

    const updates = await Promise.all(projects);

    // update data in projects.json
    rawData.projects.forEach((project) => {
        const result = updates.find(
            (update) => update?.id === project.id.toString()
        );

        if (!result) return;

        project.newestVersion = {
            version: result.version,
            description: result.description ?? '',
            date: '',
            updates: result.updates ?? 'fetch error',
        };

        fs.writeFileSync('./projects.json', JSON.stringify(rawData, null, 2));
    });
};
