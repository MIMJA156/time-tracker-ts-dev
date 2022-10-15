import $ from "jquery";
import "./scss/main.scss";

console.log("Hello World!");

const ws = new WebSocket("ws://localhost:3803/");

const loginButton = $("#login");
const logoutButton = $("#logout");

loginButton.on("click", () => {
    ws.send(JSON.stringify({
        to: "server",
        action: "github.auth"
    }));
});

logoutButton.on("click", () => {
    ws.send(JSON.stringify({
        to: "server",
        action: "github.remove"
    }));
});

ws.onmessage = function (e) {
    let data = JSON.parse(e.data);
    let actionArgs = data.action.split(".");

    console.log(data);

    if (data.to === "client") {
        if (actionArgs[0] === "system") {
            if (actionArgs[1] === "init") {
                update(data.package);
            }
        }

        if (actionArgs[0] === "github") {
            if (actionArgs[1] === "auth") {
                window.open(data.gitAuthLink);
            }
            if (actionArgs[1] === "remove") {
                update({ githubAccountAdded: false });
            }
            if (actionArgs[1] === "callback") {
                update({ githubAccountAdded: true });
            }
        }
    }
};

function update(dataPackage: systemInitDataPackage) {
    console.log(dataPackage.githubAccountAdded);

    if (dataPackage.githubAccountAdded) {
        loginButton.prop('disabled', true);
        logoutButton.prop('disabled', false);
    } if (!dataPackage.githubAccountAdded) {
        loginButton.prop('disabled', false);
        logoutButton.prop('disabled', true);
    }
}

interface systemInitDataPackage {
    githubAccountAdded: boolean;
}