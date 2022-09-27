import $ from "jquery";
import { dayIndex, monthIndex } from "./../vars";

let today = new Date();
$("#today-is").text(`Today. ${dayIndex.short[today.getDay()]}, ${monthIndex.short[today.getMonth()]} ${today.getDate()}`);