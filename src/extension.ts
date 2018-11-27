'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const Dat = require('dat-node');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "dat-dir" is now active!');

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
        
        vscode.window.showInputBox()
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