import $ from 'jquery';

export function initiateWindow({ parent, child }: { parent: JQuery<HTMLElement>; child: JQuery<HTMLElement> }) {
	let htmlParent = parent[0];
	let htmlChild = child[0];

	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;

	htmlChild.addEventListener('mousedown', (ev) => {
		let targetJ = $(ev.target!);
		if (targetJ.prop('nodeName') === 'I' || targetJ.prop('nodeName') === 'BUTTON') {
			return;
		}
		document.addEventListener('mousemove', update);

		ev.preventDefault();

		pos3 = ev.clientX;
		pos4 = ev.clientY;

		document.addEventListener('mouseup', () => {
			document.removeEventListener('mousemove', update);
		});
	});

	function update(ev: MouseEvent) {
		ev.preventDefault();

		pos1 = pos3 - ev.clientX;
		pos2 = pos4 - ev.clientY;
		pos3 = ev.clientX;
		pos4 = ev.clientY;

		htmlParent.style.top = htmlParent.offsetTop - pos2 + 'px';
		htmlParent.style.left = htmlParent.offsetLeft - pos1 + 'px';
	}
}

export function initiateAllWindows() {
	for (const element of $('.moveable-window')) {
		for (const child of $(element.children)) {
			for (const childOfChild of $(child.children)) {
				if (childOfChild.classList.contains('header')) {
					initiateWindow({
						parent: $(element),
						child: $(childOfChild) as JQuery<HTMLElement>,
					});
				}
			}
		}
	}
}
