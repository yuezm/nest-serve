"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const ejs_1 = require("ejs");
var ECompileType;
(function (ECompileType) {
    ECompileType["CONTROLLER"] = "controller";
    ECompileType["DTO"] = "dto";
    ECompileType["MODULE"] = "module";
    ECompileType["SERVICE"] = "service";
    ECompileType["STATIC"] = "static";
    ECompileType["SPEC"] = "controller.spec";
})(ECompileType = exports.ECompileType || (exports.ECompileType = {}));
function compileSourceToTarget(sourcePath, sourceData, targetPath = sourcePath) {
    fs_1.writeFileSync(targetPath, ejs_1.compile(fs_1.readFileSync(sourcePath).toString(), null)(sourceData), {
        flag: 'w+',
    });
}
exports.compileSourceToTarget = compileSourceToTarget;
function compileByType(type, sourceData, targetDirPath) {
    if (!fs_1.existsSync(targetDirPath)) {
        fs_1.mkdirSync(targetDirPath, { recursive: true });
    }
    compileSourceToTarget(path_1.join(__dirname, `../../public/template/${type}.ts`), sourceData, path_1.join(targetDirPath, `${sourceData.path}.${type}.ts`));
}
exports.compileByType = compileByType;
function serializePathName(name) {
    const data = { path: name, name, nameHump: '' };
    if (name.includes('-')) {
        data.path = name.replace(/-/g, '.');
        data.name = name.replace(/-(\w)?/g, (p1, p2) => p2 ? p2.toUpperCase() : '');
    }
    data.nameHump = data.name[0].toUpperCase() + data.name.substring(1);
    return data;
}
exports.serializePathName = serializePathName;
