import { Request, Response } from 'express';
import {
    Project,
    ClientProjectInfo,
    ProgressData,
    UpgradeData,
} from '@version-notifier/common';
import * as rawData from '../../projects.json';
import { StatusCodes } from 'http-status-codes';
import { installPackage } from '../shell/shell';

export const getUpdates = async (req: Request, res: Response) => {
    const projects: Project[] = rawData.projects;
    const clientProjects: ClientProjectInfo[] = projects
        .filter(
            (project) =>
                project.currentVersion !== project.newestVersion.version
        )
        .map((project: Project) => {
            return {
                id: project.id,
                color: project.color,
                packageName: project.packageName,
                name: project.name,
                description: project.newestVersion.description,
                updates: project.newestVersion.updates,
                version: project.newestVersion.version,
            };
        });

    res.status(StatusCodes.OK).json(clientProjects);
};

export const upgrade = async (req: Request, res: Response) => {
    try {
        console.log('Upgrading...', req.body);
        const projectIds: Array<string> = (JSON.parse(req.body) as UpgradeData)
            .ids;

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const totalDestinations = rawData.projects.reduce(
            (acc, project) => acc + project.pathDestinations.length,
            0
        );

        let completedDestinations = 0;
        for (const id of projectIds) {
            const project: Project | undefined = rawData.projects.find(
                (project) => project.id.toString() === id
            );

            if (project) {
                console.log(
                    `Upgrading ${project.name} with ${project.pathDestinations.length} destinations`
                );
                for (const destination of project.pathDestinations) {
                    const isInstalled = await installPackage(
                        project,
                        destination
                    );
                    completedDestinations++;
                    const status: ProgressData = {
                        data: {
                            type: 'progress',
                            progress:
                                (completedDestinations / totalDestinations) *
                                100,
                        },
                    };

                    console.log('writing...');
                    res.write(`data: ${JSON.stringify(status)}\n\n`);

                    if (!isInstalled) {
                        const error: ProgressData = {
                            data: {
                                type: 'error',
                            },
                        };

                        res.write(`data: ${JSON.stringify(error)}\n\n`);
                    }
                }
            }
        }

        res.end();
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            'Internal Server Error'
        );
    }
};
