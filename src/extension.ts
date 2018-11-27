'use strict';

import * as vscode from 'vscode';
const Dat = require('dat-node');

export function activate(context: vscode.ExtensionContext) {
    const dat = new DatHelper();

    let datShare = vscode.commands.registerCommand('extension.datShare', () => {
        const rootPath = vscode.workspace.rootPath || '';

        vscode.window.showInputBox({
            value: rootPath,
            placeHolder: 'Path to the directory to share'
        }).then(path => {
            if (path) {
                dat.share(path);
            }
        });
    });

    let datClone = vscode.commands.registerCommand('extension.datClone', () => {
        const rootPath = vscode.workspace.rootPath || '';

        vscode.window.showInputBox({
            placeHolder: 'Dat link'
        })
        .then(key => {
            if (key) {
                vscode.window.showInputBox({
                    value: rootPath,
                    placeHolder: 'Path to the directory to clone'
                })
                .then(path => {
                    if (path) {
                        dat.clone(key, path);
                    }
                });
            }
        });
    });

    context.subscriptions.push(datClone);
    context.subscriptions.push(datShare);

}

// this method is called when your extension is deactivated
export function deactivate() {
}

class DatHelper {

    public share(path: string) {
        Dat(path, (err: any, dat: any) => {
            if (!err) {
                dat.importFiles();
                dat.joinNetwork();

                vscode.window.showInformationMessage(`dat://${dat.key.toString('hex')}`);
                vscode.window.createOutputChannel('DatDir').appendLine(`dat://${dat.key.toString('hex')}`);
            }
        });
    }

    public clone(key: string, path: string) {
        Dat(path, {
            key
        }, (err: any, dat: any) => {
            if (!err) {
                dat.joinNetwork();
            }
        });
    }
}