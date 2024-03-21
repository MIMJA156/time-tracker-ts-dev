import * as vscode from 'vscode';

export class BadgeUtils {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public createBadge(data: { alignment: vscode.StatusBarAlignment; priority: number; text: string; tooltip: string; icon: string; command: string | null }, show: boolean = false) {
        let newBadge = new Badge(data);
        this.context.subscriptions.push(newBadge.badge);

        if (show) {
            newBadge.show(true);
        }

        return newBadge;
    }

    public deleteBadge(toBeDeletedBadge: Badge) {
        toBeDeletedBadge.badge.dispose();
    }

    public linkCommandToBadge(badge: Badge, uri: string, callback: (...args: any[]) => any) {
        try {
            this.context.subscriptions.push(vscode.commands.registerCommand(uri, callback));
        } finally {
            badge.commandURI = uri;
        }
    }
}

export class Badge {
    public badge: vscode.StatusBarItem;

    private _alignment: vscode.StatusBarAlignment;
    private _priority: number;
    private _text: string;
    private _tooltip: string;
    private _icon: string;
    private _command: string;

    private isShowing: boolean;

    constructor({ alignment, priority, text, tooltip, icon, command }) {
        this._alignment = alignment;
        this._priority = priority;
        this._text = text;
        this._tooltip = tooltip;
        this._icon = icon;
        this._command = command;

        this.createBadge();
    }

    private createBadge() {
        if (this.badge) this.badge.dispose();
        this.badge = null;

        if (!this._text) throw new Error('Text Required!');
        if (!this._icon) throw new Error('Icon Required!');

        let newBadge = vscode.window.createStatusBarItem(this._text.toLowerCase().replace(' ', '-'), this._alignment, this._priority);

        newBadge.text = `$(${this._icon}) ${this._text}`;
        newBadge.tooltip = this._tooltip;

        if (this._command) {
            newBadge.command = this._command;
        }

        if (this.isShowing) {
            newBadge.show();
        }

        this.badge = newBadge;
    }

    public show(toggle: boolean) {
        if (toggle) {
            this.badge.show();
            this.isShowing = true;
        } else {
            this.badge.hide();
            this.isShowing = false;
        }
    }

    public set text(data: string) {
        this.badge.text = `$(${this._icon}) ${data}`;
        this._text = data;
    }

    public set icon(data: string) {
        this.badge.text = `$(${data}) ${this._text}`;
        this._icon = data;
    }

    public set tooltip(data: string) {
        this.badge.tooltip = data;
        this._tooltip = data;
    }

    public set alignment(data: vscode.StatusBarAlignment) {
        this._alignment = data;
        this.createBadge();
    }

    public set priority(data: number) {
        this._priority = data;
        this.createBadge();
    }

    public set commandURI(uri: string) {
        this._command = uri;
        this.badge.command = uri;
    }
}
