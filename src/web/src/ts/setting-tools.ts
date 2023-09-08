import $ from 'jquery';

export default class SettingsTools {
    isWindowVisible: boolean;

    constructor() {
        this.isWindowVisible = false;
    }

    toggle() {
        let settingsWindow = $(`[data-type='settings']`);

        if (this.isWindowVisible) {
            settingsWindow.addClass('hide');
        } else {
            settingsWindow.removeClass('hide');
        }

        this.isWindowVisible = !this.isWindowVisible;
    }
}
