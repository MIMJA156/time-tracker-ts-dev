import "./scss/main.scss";
import { closeWindow, loadWindow } from "./tools/windowLoader";

import "./ts/windows/options";
import "./ts/windows/movement";

// @ts-ignore
window.loadWindow = loadWindow;
// @ts-ignore
window.closeWindow = closeWindow;

loadWindow(1);