module.exports = async (sources, covFile) => {
  const fs = require('fs');
  const parseString = require('xml2js').parseString;
  const result = await new Promise((resolve, reject) => parseString(fs.readFileSync(covFile, 'utf8'), (err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));
  sources = JSON.parse(sources);
  for (let packages of result.coverage.packages) {
    for (let package of packages.package) {
      let file = package.$.name;
      for (let classes of package.classes) {
        for (let clazz of classes.class) {
          for (let lines of clazz.lines) {
            for (let line of lines.line) {
              if (line.$.hits === '0') {
                const idx = sources.findIndex(source => source.file === clazz.$.filename && source.lines.includes(parseInt(line.$.number)));
                if (idx !== -1) {
                  console.log(`Uncovered line in ${clazz.$.filename}:${line.$.number}`);
                  // Found an uncovered line in a changed file
                  return false;
                }
              }
            }
          }
        }
      }
    }
  }
  return true;
};