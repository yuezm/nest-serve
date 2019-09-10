const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

function compile(sourcePath, sourceData, targetPath = sourcePath) {
  fs.writeFileSync(
    targetPath,
    handlebars.compile(fs.readFileSync(sourcePath).toString())(sourceData),
    {
      flag: 'w+'
    }
  );
}

function compileByType(type, sourceData, targetDirPath) {
  fs.access(targetDirPath, err => {
    if (err) {
      fs.mkdirSync(targetDirPath, { recursive: true });
    }
    compile(
      path.join(__dirname, `../libs/${type}.txt`),
      sourceData,
      path.join(targetDirPath, `${type}.ts`)
    );

  });
}


module.exports = {
  compile,
  compileByType,
};
