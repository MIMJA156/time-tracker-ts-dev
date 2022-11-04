import { StorageUtils } from '../classes/StorageUtils';

export default (storageUtils: StorageUtils): String => {
	return JSON.stringify({
		to: 'client',
		action: 'system.init',
		package: {
			githubAccountAdded: !!storageUtils.getLocalStoredSettings().gist.access_token,
		},
	});
};
