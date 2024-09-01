const { execSync } = require('child_process');
module.exports = () => {
  const output = execSync(`git diff origin/master`).toString().split('\n')
  let count = 0;
  let start = 0;
  let current = 0;
  let sources = [];
  for (let i = 0; i < output.length; i++) {
    if (output[i].startsWith('diff --git')) {
      // skip 'diff --git a/' prefix
      const file = output[i].split(' ')[2].substring(2);
      sources.push({'file': file, 'lines': []});
      // go to header line, e.g. '@@ -1,2 +1,3 @@'
      do {
        ++i;
      }
      while (!output[i].startsWith('@@'));
      output[i].split(' ').forEach((c) => {
          if (c.startsWith('+')) {
              [start, count] = c.split(',');
              start = parseInt(start);
              count = parseInt(count);
              current = 0;
          }
      });
    }
    else if (current < count && !output[i].startsWith('-') && !output[i].startsWith('\\ No newline at end of file')) {
      if (output[i].startsWith('+')) {
        sources[sources.length - 1].lines.push(start + current);
      }
      ++current;
    }
  }

  return sources;
};
