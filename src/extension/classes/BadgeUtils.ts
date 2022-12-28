import * as vscode from 'vscode';
export class BadgeUtils {
	private activeBadge: vscode.StatusBarItem;
	private context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;

		this.createNewBadgeItem();
	}

	public text(newText: string | number) {
		this.activeBadge.text = `${newText}`;
	}

	private createNewBadgeItem() {
		this.activeBadge = vscode.window.createStatusBarItem('left', 10);
		this.context.subscriptions.push(this.activeBadge);
		this.activeBadge.show();
	}
}
