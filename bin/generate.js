#!/usr/env/bind node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_symbols_1 = require("log-symbols");
const chalk = require("chalk");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("./util");
const APP_MODULE_PATH = './src/app/app.module.ts';
const APP_IMPORT_REG = /(import.*?)((?=@Global)|(?=@Module))/s;
const APP_MODULE_IMPORTS_REG = /@Module.*?imports.*?(?=])/s;
function effectGenerator(options) {
    const sourceData = Object.assign(util_1.serializePathName(options.moduleName), { isGRpc: options.isGRpc });
    options.templateList.map(type => util_1.effectCompile(type, sourceData, path_1.join(options.appPath, options.moduleName)));
    if (fs_1.existsSync(APP_MODULE_PATH)) {
        let appStr = fs_1.readFileSync(APP_MODULE_PATH).toString();
        if (appStr.includes(`import { ${sourceData.nameHump}Module } from '@App/${sourceData.name}/${sourceData.path}.module'`)) {
            console.error(chalk.default.red('模块重复'));
            return;
        }
        appStr = appStr.replace(APP_IMPORT_REG, (p) => {
            return p + `import { ${sourceData.nameHump}Module } from '@App/${options.moduleName}/${sourceData.path}.module';\n`;
        });
        appStr = appStr.replace(APP_MODULE_IMPORTS_REG, (p) => {
            return p + `\u00A0\u00A0${sourceData.nameHump}Module,`;
        });
        fs_1.writeFileSync(APP_MODULE_PATH, appStr);
    }
}
function serveGenerate(name, cmd) {
    var _a;
    try {
        let templateList = [];
        if (cmd.module)
            templateList.push("module");
        if (cmd.controller)
            templateList.push("controller");
        if (cmd.service)
            templateList.push("service");
        if (cmd.dto)
            templateList.push("dto");
        if (cmd.static)
            templateList.push("static");
        if (templateList.length < 1) {
            templateList = ["module", "controller", "service", "dto", "static", "spec"];
        }
        effectGenerator({
            moduleName: name,
            appPath: (_a = cmd.path) !== null && _a !== void 0 ? _a : 'src/app',
            templateList,
            isGRpc: Boolean(cmd.grpc),
        });
        console.log(log_symbols_1.success, chalk.default.green('already created'));
    }
    catch (e) {
        console.error(chalk.default.red(e.message));
    }
}
exports.serveGenerate = serveGenerate;
