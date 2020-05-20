#!/usr/env/bind node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_symbols_1 = require("log-symbols");
const chalk = require("chalk");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("./util");
const APP_PATH = './src/app/app.module.ts';
const APP_IMPORT_REG = /(import.*?)((?=@Global)|(?=@Module))/s;
const APP_MODULE_IMPORTS_REG = /@Module.*?imports.*?(?=])/s;
function effectGenerator(options) {
    const sourceData = util_1.serializePathName(options.moduleName);
    options.templateList.map(type => util_1.effectCompile(type, sourceData, path_1.join(options.appPath, options.moduleName)));
    if (fs_1.existsSync(APP_PATH)) {
        let appStr = fs_1.readFileSync(APP_PATH).toString();
        appStr = appStr.replace(APP_IMPORT_REG, (p) => {
            return p + `import { ${sourceData.nameHump}Module } from '@App/${options.moduleName}/${sourceData.path}.module';\n\n`;
        });
        appStr = appStr.replace(APP_MODULE_IMPORTS_REG, (p) => {
            return p + `\u00A0\u00A0${sourceData.nameHump}Module,`;
        });
        fs_1.writeFileSync(APP_PATH, appStr);
    }
}
function serveGenerate(name, cmd) {
    var _a;
    try {
        let templateList = [];
        if (cmd.module)
            templateList.push(util_1.ETemplateType.MODULE);
        if (cmd.controller)
            templateList.push(util_1.ETemplateType.CONTROLLER);
        if (cmd.service)
            templateList.push(util_1.ETemplateType.SERVICE);
        if (cmd.dto)
            templateList.push(util_1.ETemplateType.DTO);
        if (cmd.static)
            templateList.push(util_1.ETemplateType.STATIC);
        if (templateList.length < 1) {
            templateList = [util_1.ETemplateType.MODULE, util_1.ETemplateType.CONTROLLER, util_1.ETemplateType.SERVICE, util_1.ETemplateType.DTO, util_1.ETemplateType.STATIC, util_1.ETemplateType.SPEC];
        }
        effectGenerator({ moduleName: name, appPath: (_a = cmd.path) !== null && _a !== void 0 ? _a : 'src/app', templateList });
        console.log(log_symbols_1.success, chalk.default.green('already created'));
    }
    catch (e) {
        console.error(chalk.default.red(e));
        process.exit();
    }
}
exports.serveGenerate = serveGenerate;
