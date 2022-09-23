export function makeDraggable(headerElement: HTMLElement, bodyElement: HTMLElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    headerElement.addEventListener("mousedown", (ev) => {
        document.addEventListener("mousemove", update);

        ev.preventDefault();

        pos3 = ev.clientX;
        pos4 = ev.clientY;

        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", update);
        });
    });

    function update(ev: MouseEvent) {
        ev.preventDefault();

        pos1 = pos3 - ev.clientX;
        pos2 = pos4 - ev.clientY;
        pos3 = ev.clientX;
        pos4 = ev.clientY;

        bodyElement.style.top = (bodyElement.offsetTop - pos2) + "px";
        bodyElement.style.left = (bodyElement.offsetLeft - pos1) + "px";
    }
}