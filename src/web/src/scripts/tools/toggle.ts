import $ from "jquery";

export function openWindowFromId(windowParentClass: string, wantedWindow: number) {
    $("." + windowParentClass).children().each((i) => {
        let child = $("." + windowParentClass).children().get(i);
        if (child?.classList[0].split("id-")[1] === wantedWindow + "") {
            child.classList.add("active");
        } else {
            child?.classList.remove("active");
        }
    });
}