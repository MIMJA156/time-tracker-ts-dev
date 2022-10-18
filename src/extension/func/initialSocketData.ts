import { StorageUtils } from "../classes/StorageUtils";

export default (storageUtils: StorageUtils) => {
    return JSON.stringify({
        to: "client",
        action: "system.init",
        package: {
            githubAccountAdded: !!storageUtils.getLocalStoredSettings().gist.access_token
        }
    });
}