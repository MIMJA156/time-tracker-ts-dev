const apiHost = "http://localhost:3000";

async function getInitialData() {
    let promise = new Promise((resolve, fail) => {
        $.get(apiHost + "/data/first", (data, status) => {
            resolve(data);
        }).catch(e => {
            fail(e);
        });
    })

    return await promise;
}

async function getUpdatedData() {
    let promise = new Promise((resolve, fail) => {
        $.get(apiHost + "/data/updated", (data, status) => {
            resolve(data);
        }).catch(e => {
            fail(e);
        });
    })

    return await promise;
}

function linkGithub() {

}