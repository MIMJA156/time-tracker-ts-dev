export function drawSegmentedFloater() {
	let allSegmentedViews = document.getElementsByClassName('segmented-view-wrapper');

	for (const segmentedViewIndex in allSegmentedViews) {
		if (Object.hasOwnProperty.call(allSegmentedViews, segmentedViewIndex)) {
			const segmentedView = allSegmentedViews[segmentedViewIndex];

			let segmentedViewFloater = segmentedView.getElementsByClassName('segmented-view-floater')[0];
			let segmentedViewItems = segmentedView.getElementsByClassName('segmented-view-item');

			for (const itemIndex in segmentedViewItems) {
				if (Object.hasOwnProperty.call(segmentedViewItems, itemIndex)) {
					const item = segmentedViewItems[itemIndex];

					if (item.classList.contains('selected')) {
						//@ts-ignore
						segmentedViewFloater.style.left = item.offsetLeft + 'px';
					}
				}
			}
		}
	}
}

export function clearAllSelections() {
	let allSegmentedViews = document.getElementsByClassName('segmented-view-wrapper');
	for (const segmentedViewIndex in allSegmentedViews) {
		if (Object.hasOwnProperty.call(allSegmentedViews, segmentedViewIndex)) {
			const segmentedView = allSegmentedViews[segmentedViewIndex];
			let segmentedViewItems = segmentedView.getElementsByClassName('segmented-view-item');

			for (const itemIndex in segmentedViewItems) {
				if (Object.hasOwnProperty.call(segmentedViewItems, itemIndex)) {
					const item = segmentedViewItems[itemIndex];

					if (item.classList.contains('selected')) {
						item.classList.remove('selected');
					}
				}
			}
		}
	}
}
