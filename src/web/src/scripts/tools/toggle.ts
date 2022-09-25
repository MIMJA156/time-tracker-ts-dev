import $ from "jquery";

export function openWindowPageFromId(windowParentClass: string, wantedWindow: number) {
    $("." + windowParentClass).children().each((i) => {
        let child = $("." + windowParentClass).children().get(i);
        if (child?.classList[0].split("id-")[1] === wantedWindow + "") {
            child.classList.add("active");
        } else {
            child?.classList.remove("active");
        }
    });
}

export function openWindowFromClass(windowClass: string) {
    $("." + windowClass).addClass("active");
}

export function closeWindowFromClass(windowClass: string) {
    $("." + windowClass).removeClass("active");
}

export function toggleWindowFromClass(windowClass: string) {
    if ($("." + windowClass).hasClass("active")) {
        closeWindowFromClass(windowClass);
    } else {
        $("." + windowClass).addClass("active");
    }
}