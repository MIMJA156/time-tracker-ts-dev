/* eslint-disable @typescript-eslint/naming-convention */
import { Octokit } from "@octokit/rest";
import { getLocalStoredSettings, setLocalStoredSettings } from "./storageTools";

export async function getGist(auth_token: string, gist_id: string) {
    if (gist_id === "") { return await createGist(auth_token); }

    const octokit = new Octokit({
        auth: auth_token,
    });

    let gist = await octokit.rest.gists.get({
        gist_id,
    });

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

    let settings = getLocalStoredSettings();
    settings.gist.gist_id = createdGist.data.id;
    setLocalStoredSettings(JSON.stringify(settings));

    return createdGist.data.files;
}