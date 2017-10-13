#!/usr/bin/env node

var program = require('commander');

// 使用 program.chdir 就能获得 -C/-chdir 后面的参数。(注意：不能使用program.C)
program
  .version('0.0.1')
  .option('-N, --userName <path>', 'input name');

program.parse(process.argv);

if(program.userName){
  console.log('hi "%s",welcome to use me',program.userName);
}else {
  console.log('hi ,welcome to use me');
}


console.log("my tool finished");