async function getInitialData() {
    let promise = new Promise((resolve, fail) => {
        $.get("http://localhost:3000/data/first", (data, status) => {
            resolve(data);
        });
    })

    return await promise;
}

async function getUpdatedData() {
    let promise = new Promise((resolve, fail) => {
        $.get("http://localhost:3000/data/updated", (data, status) => {
            resolve(data);
        });
    })

    return await promise;
}

function linkGithub() {

}