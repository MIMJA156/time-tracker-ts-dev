import $ from "jquery";
import { toggleWindow } from "../../tools/windowLoader";

$("#open-options").on("click", () => {
    toggleWindow();
}); 