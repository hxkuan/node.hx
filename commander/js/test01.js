//console.log(process.argv);

var commader = require('commander');
commader
  .version('0.0.1')
  .description('a test commander')
  .option('-n, --name <name>','your name','GK')
  .option('-a, --age <age>', 'your age', '22');

commader.parse(process.argv);