export const optionCells = [
    {
        title: "General Settings",
        click: 2
    },
    {
        title: "Github Account",
        click: 3
    },
    {
        title: "Support Me",
        click: 4
    }
];

export const supportMeCells = [
    {
        title: "Buy Me A Coffee",
        url: "https://buymeacoffee.com/MIMJA156/",
        class: "buy-me-a-coffee-link"
    },
    {
        title: "Pay Pal",
        url: "https://www.paypal.com/donate/?business=X7XDWSPAWFDMC&no_recurring=0&currency_code=USD",
        class: "pay-pal-link"
    },
    {
        title: "Cash App",
        url: "https://cash.app/$Mimja156",
        class: "cash-app-link"
    },
    {
        title: "Venmo",
        url: "https://account.venmo.com/u/mimja156",
        class: "venmo-link"
    }
];

export const generalSettingsCells: GeneralSettingsCellsInterface[] = [
    {
        title: "Graph Type",
        input: {
            type: "select",
            options: [
                { display: "Line", key: "line" },
                { display: "Bar", key: "bar" }
            ]
        }
    },
    {
        title: "Graph Colors",
        input: { type: "cell", click: 4 }
    }
];

export interface GeneralSettingsCellsInterface {
    title: string,
    input: {
        type: string,
        click?: number,
        options?: {
            display: string,
            key: string
        }[]
    }
};