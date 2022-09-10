const initialDataQueryEvent = (query) => {
    const event = new CustomEvent('initialDataQuery', {
        detail: {
            query
        },
        bubbles: true,
        cancelable: false
    });

    document.dispatchEvent(event);
};

const updatedDataQueryEvent = (query) => {
    const event = new CustomEvent('updatedDataQuery', {
        detail: {
            query
        },
        bubbles: true,
        cancelable: false
    });

    document.dispatchEvent(event);
};

const linkedGithubEvent = (username) => {
    const event = new CustomEvent('linkedGithub', {
        detail: {
            username
        },
        bubbles: true,
        cancelable: false
    });

    document.dispatchEvent(event);
};

const checkedGithubStatusEvent = (boolean) => {
    const event = new CustomEvent('checkedGithubStatus', {
        detail: {
            boolean
        },
        bubbles: true,
        cancelable: false
    });

    document.dispatchEvent(event);
}