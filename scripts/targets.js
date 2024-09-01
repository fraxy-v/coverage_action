const fs = require('fs');
const { execSync } = require('child_process');

module.exports = (sources) => {
  let outputs = [];
  sources = JSON.parse(sources);
  let commands = JSON.parse(fs.readFileSync('build/compile_commands.json', 'utf8'));
  for (let {file, _} of sources) {
    if (file.endsWith('.cpp') || file.endsWith('.h') || file.endsWith('.c')
      || file.endsWith('.hpp')) {
      const idx = commands.findIndex(entry => entry.file.endsWith(file));
      if (idx >= 0) {
        let entry = commands[idx];
        if (entry.output !== 'undefined') {
          entry.output = entry.command.split(' ').find(token => token.endsWith('.o'));
        }
        outputs.push(entry.output);
        commands.splice(idx, 1);
      }
    }
  }

  targets = new Set();
  while (outputs.length > 0) {
    level_targets = new Set();
    for (const output of outputs) {
      let lines = execSync(`ninja -C build -t query ${output}`).toString().split('\n');

      let insert = false;
      for (const line of lines) {
        if (line.endsWith('outputs:')) {
          insert = true;
          continue;
        }
        const value = line.trim();
        if (insert && value.length > 0) {
          level_targets.add(value);
        }
      }
    }

    outputs = [...level_targets];
    targets = new Set([...targets, ...level_targets]);
  }
  return [...targets].join(' ');
}