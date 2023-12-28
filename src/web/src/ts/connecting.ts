export function showConnectingScreenWithText(text: string) {
    let item = document.getElementById('connection-cover');
    item.classList.remove('hide');
    item.innerHTML = text;
}
export function hideConnectingScreen() {
    let item = document.getElementById('connection-cover');
    item.classList.add('hide');
}
