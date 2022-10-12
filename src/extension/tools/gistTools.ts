/* eslint-disable @typescript-eslint/naming-convention */
import { Octokit } from "@octokit/rest";
import { getLocalStoredSettings, setLocalStoredSettings } from "./storageTools";
import { git } from "./../config.json";
import open from "open";
import { bootServer } from "./serverTools";

export async function getGist(auth_token: string, gist_id: string) {
    if (auth_token === "") { return initiateLogin(); };
    if (gist_id === "") { return await createGist(auth_token); }

    const octokit = new Octokit({
        auth: auth_token,
    });

    let gist: any;

    try {
        gist = await octokit.rest.gists.get({
            gist_id,
        });
    } catch (e) {
        return createGist(auth_token);
    }

    return gist.data.files;
}

async function createGist(auth_token: string) {
    const octokit = new Octokit({
        auth: auth_token,
    });

    let createdGist = await octokit.rest.gists.create({
        public: false,
        files: {
            "cloud-time.mimja.json": {
                content: "{}"
            }
        }
    });

    let localSettings = getLocalStoredSettings();
    localSettings.git.gist_id = createdGist.data.id;
    setLocalStoredSettings(JSON.stringify(localSettings));

    return createdGist.data.files;
}

async function initiateLogin() {
    await bootServer();
    open(`https://github.com/login/oauth/authorize?client_id=${git.CLIENT_ID}&scope=gist`);
}

export function loginUser(access_token: string, username: string) {
    let localSettings = getLocalStoredSettings();
    localSettings.git.access_token = access_token;
    setLocalStoredSettings(JSON.stringify(localSettings));
}