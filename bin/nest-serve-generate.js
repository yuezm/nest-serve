#!/usr/env/bind node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_symbols_1 = require("log-symbols");
const chalk = require("chalk");
const fs_1 = require("fs");
const util_1 = require("./util");
const APP_IMPORT_REG = /(import.*?)((?=@Global)|(?=@Module))/s;
const APP_MODULE_IMPORTS_REG = /@Module.*?imports.*?(?=])/s;
const APP_PATH = './src/app/app.module.ts';
function generator(name, options) {
    const sourceData = util_1.serializePathName(name);
    ['module', 'controller', 'service', 'dto', 'static', 'controller.spec'].map((type) => util_1.compileByType(type, sourceData, `./src/app/${name}`));
    if (fs_1.existsSync(APP_PATH)) {
        let appStr = fs_1.readFileSync(APP_PATH).toString();
        appStr = appStr.replace(APP_IMPORT_REG, (p) => {
            return p + `import { ${sourceData.nameHump}Module } from '@App/${name}/${sourceData.path}.module';\n\n`;
        });
        appStr = appStr.replace(APP_MODULE_IMPORTS_REG, (p) => {
            return p + `\u00A0\u00A0${sourceData.nameHump}Module,`;
        });
        console.log(appStr);
        fs_1.writeFileSync(APP_PATH, appStr);
    }
}
function serveGenerate(name, options) {
    try {
        generator(name, options);
        console.log(log_symbols_1.success, chalk.default.green('already created'));
    }
    catch (e) {
        console.error(chalk.default.red(e));
        process.exit();
    }
}
exports.serveGenerate = serveGenerate;
