import "./scss/main.scss";
import "@fortawesome/fontawesome-free";

import { closeWindow, loadWindow } from "./tools/windowLoader";

import "./ts/windows/options";
import "./ts/windows/movement";
import "./ts/windows/settings";

import "./ts/calender/scripts";

// @ts-ignore
window.loadWindow = loadWindow;
// @ts-ignore
window.closeWindow = closeWindow;

loadWindow(1);