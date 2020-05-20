"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const ejs_1 = require("ejs");
const TEMPLATE_PATH = path_1.join(__dirname, '../../public/template');
var ETemplateType;
(function (ETemplateType) {
    ETemplateType["CONTROLLER"] = "controller";
    ETemplateType["DTO"] = "dto";
    ETemplateType["MODULE"] = "module";
    ETemplateType["SERVICE"] = "service";
    ETemplateType["STATIC"] = "static";
    ETemplateType["SPEC"] = "spec";
})(ETemplateType = exports.ETemplateType || (exports.ETemplateType = {}));
function effectCompileTemplate(templatePath, templateData, targetPath = templatePath) {
    fs_1.writeFileSync(targetPath, ejs_1.compile(fs_1.readFileSync(templatePath).toString(), null)(templateData), {
        flag: 'w+',
    });
}
exports.effectCompileTemplate = effectCompileTemplate;
function effectCompile(type, templateData, targetDirPath) {
    if (!fs_1.existsSync(targetDirPath)) {
        fs_1.mkdirSync(targetDirPath, { recursive: true });
    }
    effectCompileTemplate(path_1.join(TEMPLATE_PATH, `${type}.ts`), templateData, path_1.join(targetDirPath, `${templateData.path}.${type}.ts`));
}
exports.effectCompile = effectCompile;
function serializePathName(moduleName) {
    const data = { path: moduleName, name: moduleName, nameHump: '' };
    if (moduleName.includes('-')) {
        data.path = moduleName.replace(/-/g, '.');
        data.name = moduleName.replace(/-(\w)?/g, (p1, p2) => p2 ? p2.toUpperCase() : '');
    }
    data.nameHump = toHumpString(data.name);
    return data;
}
exports.serializePathName = serializePathName;
function toHumpString(s) {
    return s === '' ? '' : s.replace(s[0], s[0].toUpperCase());
}
exports.toHumpString = toHumpString;
