import $ from "jquery";
import "./scss/main.scss";

const ws = new WebSocket("ws://localhost:3803/");

$("#login").on("click", () => {
    ws.send(JSON.stringify({
        action: "git.auth"
    }));
});

$("#logout").on("click", () => {
    ws.send(JSON.stringify({
        to: "server",
        action: "git.remove"
    }));
});

ws.onmessage = function (e) {
    let data = JSON.parse(e.data);

    console.log(data);

    if (data.gitAuthLink) {
        window.open(data.gitAuthLink);
    }
};

console.log("Hello World!");
