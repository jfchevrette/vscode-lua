"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const os = require("os");
const fs = require("fs");
const vscode = require("vscode");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let defaultClient;
let clients = new Map();
function registerCustomCommands(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand('lua.config', (data) => {
        let config = vscode_1.workspace.getConfiguration(undefined, vscode_1.Uri.parse(data.uri));
        if (data.action == 'add') {
            let value = config.get(data.key);
            value.push(data.value);
            config.update(data.key, value, data.global);
            return;
        }
        if (data.action == 'set') {
            config.update(data.key, data.value, data.global);
            return;
        }
    }));
}
let _sortedWorkspaceFolders;
function sortedWorkspaceFolders() {
    if (_sortedWorkspaceFolders === void 0) {
        _sortedWorkspaceFolders = vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders.map(folder => {
            let result = folder.uri.toString();
            if (result.charAt(result.length - 1) !== '/') {
                result = result + '/';
            }
            return result;
        }).sort((a, b) => {
            return a.length - b.length;
        }) : [];
    }
    return _sortedWorkspaceFolders;
}
vscode_1.workspace.onDidChangeWorkspaceFolders(() => _sortedWorkspaceFolders = undefined);
function getOuterMostWorkspaceFolder(folder) {
    let sorted = sortedWorkspaceFolders();
    for (let element of sorted) {
        let uri = folder.uri.toString();
        if (uri.charAt(uri.length - 1) !== '/') {
            uri = uri + '/';
        }
        if (uri.startsWith(element)) {
            return vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.parse(element));
        }
    }
    return folder;
}
function start(context, documentSelector, folder) {
    // Options to control the language client
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: documentSelector,
        workspaceFolder: folder,
        progressOnInitialization: true,
        markdown: {
            isTrusted: true,
        },
    };
    let config = vscode_1.workspace.getConfiguration(undefined, folder);
    let develop = config.get("Lua.develop.enable");
    let debuggerPort = config.get("Lua.develop.debuggerPort");
    let debuggerWait = config.get("Lua.develop.debuggerWait");
    let commandParam = config.get("Lua.misc.parameters");
    let command;
    let platform = os.platform();
    switch (platform) {
        case "win32":
            command = context.asAbsolutePath(path.join('server', 'bin', 'Windows', 'lua-language-server.exe'));
            break;
        case "linux":
            command = context.asAbsolutePath(path.join('server', 'bin', 'Linux', 'lua-language-server'));
            fs.chmodSync(command, '777');
            break;
        case "darwin":
            command = context.asAbsolutePath(path.join('server', 'bin', 'macOS', 'lua-language-server'));
            fs.chmodSync(command, '777');
            break;
    }
    let serverOptions = {
        command: command,
        args: [
            '-E',
            context.asAbsolutePath(path.join('server', 'main.lua')),
            `--develop=${develop}`,
            `--dbgport=${debuggerPort}`,
            `--dbgwait=${debuggerWait}`,
            commandParam,
        ]
    };
    let client = new node_1.LanguageClient('Lua', 'Lua', serverOptions, clientOptions);
    client.registerProposedFeatures();
    client.start();
    client.onReady().then(() => {
        onCommand(client);
        onDecorations(client);
        statusBar(client);
    });
    return client;
}
let barCount = 0;
function statusBar(client) {
    let bar = vscode_1.window.createStatusBarItem();
    bar.text = 'Lua';
    barCount++;
    bar.command = 'Lua.statusBar:' + barCount;
    vscode_1.commands.registerCommand(bar.command, () => {
        client.sendNotification('$/status/click');
    });
    client.onNotification('$/status/show', (params) => {
        bar.show();
    });
    client.onNotification('$/status/hide', (params) => {
        bar.hide();
    });
    client.onNotification('$/status/report', (params) => {
        bar.text = params.text;
        bar.tooltip = params.tooltip;
    });
}
function onCommand(client) {
    client.onNotification('$/command', (params) => {
        vscode_1.commands.executeCommand(params.command, params.data);
    });
}
function isDocumentInClient(textDocuments, client) {
    let selectors = client.clientOptions.documentSelector;
    if (!node_1.DocumentSelector.is(selectors)) {
        {
            return false;
        }
    }
    if (vscode.languages.match(selectors, textDocuments)) {
        return true;
    }
    return false;
}
function onDecorations(client) {
    let textType = vscode_1.window.createTextEditorDecorationType({});
    function notifyVisibleRanges(textEditor) {
        if (!isDocumentInClient(textEditor.document, client)) {
            return;
        }
        let uri = client.code2ProtocolConverter.asUri(textEditor.document.uri);
        let ranges = [];
        for (let index = 0; index < textEditor.visibleRanges.length; index++) {
            const range = textEditor.visibleRanges[index];
            ranges[index] = client.code2ProtocolConverter.asRange(new vscode.Range(Math.max(range.start.line - 3, 0), range.start.character, Math.min(range.end.line + 3, textEditor.document.lineCount - 1), range.end.character));
        }
        client.sendNotification('$/didChangeVisibleRanges', {
            uri: uri,
            ranges: ranges,
        });
    }
    for (let index = 0; index < vscode_1.window.visibleTextEditors.length; index++) {
        notifyVisibleRanges(vscode_1.window.visibleTextEditors[index]);
    }
    vscode_1.window.onDidChangeVisibleTextEditors((params) => {
        for (let index = 0; index < params.length; index++) {
            notifyVisibleRanges(params[index]);
        }
    });
    vscode_1.window.onDidChangeTextEditorVisibleRanges((params) => {
        notifyVisibleRanges(params.textEditor);
    });
    client.onNotification('$/hint', (params) => {
        let uri = params.uri;
        for (let index = 0; index < vscode_1.window.visibleTextEditors.length; index++) {
            const editor = vscode_1.window.visibleTextEditors[index];
            if (editor.document.uri.toString() == uri && isDocumentInClient(editor.document, client)) {
                let textEditor = editor;
                let edits = params.edits;
                let options = [];
                for (let index = 0; index < edits.length; index++) {
                    const edit = edits[index];
                    options[index] = {
                        hoverMessage: edit.newText,
                        range: client.protocol2CodeConverter.asRange(edit.range),
                        renderOptions: {
                            light: {
                                after: {
                                    contentText: edit.newText,
                                    color: '#888888',
                                    backgroundColor: '#EEEEEE;border-radius: 5px;',
                                    fontWeight: '400; font-size: 12px; line-height: 1;',
                                }
                            },
                            dark: {
                                after: {
                                    contentText: edit.newText,
                                    color: '#888888',
                                    backgroundColor: '#333333;border-radius: 5px;',
                                    fontWeight: '400; font-size: 12px; line-height: 1;',
                                }
                            }
                        }
                    };
                }
                textEditor.setDecorations(textType, options);
            }
        }
    });
}
function activate(context) {
    registerCustomCommands(context);
    function didOpenTextDocument(document) {
        // We are only interested in language mode text
        if (document.languageId !== 'lua' || (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled')) {
            return;
        }
        let uri = document.uri;
        let folder = vscode_1.workspace.getWorkspaceFolder(uri);
        // Untitled files go to a default client.
        if (folder == null && vscode_1.workspace.workspaceFolders == null && !defaultClient) {
            defaultClient = start(context, [
                { scheme: 'file', language: 'lua' }
            ], null);
            return;
        }
        // Files outside a folder can't be handled. This might depend on the language.
        // Single file languages like JSON might handle files outside the workspace folders.
        if (!folder) {
            return;
        }
        // If we have nested workspace folders we only start a server on the outer most workspace folder.
        folder = getOuterMostWorkspaceFolder(folder);
        if (!clients.has(folder.uri.toString())) {
            let client = start(context, [
                { scheme: 'file', language: 'lua', pattern: `${folder.uri.fsPath}/**/*` }
            ], folder);
            clients.set(folder.uri.toString(), client);
        }
    }
    function didCloseTextDocument(document) {
        let uri = document.uri;
        if (clients.has(uri.toString())) {
            let client = clients.get(uri.toString());
            if (client) {
                clients.delete(uri.toString());
                client.stop();
            }
        }
    }
    vscode_1.workspace.onDidOpenTextDocument(didOpenTextDocument);
    //Workspace.onDidCloseTextDocument(didCloseTextDocument);
    vscode_1.workspace.textDocuments.forEach(didOpenTextDocument);
    vscode_1.workspace.onDidChangeWorkspaceFolders((event) => {
        for (let folder of event.removed) {
            let client = clients.get(folder.uri.toString());
            if (client) {
                clients.delete(folder.uri.toString());
                client.stop();
            }
        }
    });
}
exports.activate = activate;
function deactivate() {
    let promises = [];
    if (defaultClient) {
        promises.push(defaultClient.stop());
    }
    for (let client of clients.values()) {
        promises.push(client.stop());
    }
    return Promise.all(promises).then(() => undefined);
}
exports.deactivate = deactivate;
//# sourceMappingURL=languageserver.js.map