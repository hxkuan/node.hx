#!/usr/bin/env node

var program = require('commander');

// 使用 program.chdir 就能获得 -C/-chdir 后面的参数。(注意：不能使用program.C)
program
  .version('0.0.1')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf');

// 在terminal 中运行 node *.js setup 调用该action中的方法
program
  .command('setup')
  .description('run remote setup commands')
  .action(function() {
    console.log('setup');
  });

// 在terminal 中运行 node *.js exec cmd 调用该action中的方法
program
  .command('exec <cmd>')
  .description('run the given remote command')
  .action(function(cmd) {
    console.log('exec "%s"', cmd);
  });

program
  .command('teardown <dir> [otherDirs...]')
  .description('run teardown commands')
  .action(function(dir, otherDirs) {
    console.log('dir "%s"', dir);
    if (otherDirs) {
      otherDirs.forEach(function (oDir) {
        console.log('dir "%s"', oDir);
      });
    }
  });

program
  .command('*')
  .description('deploy the given env')
  .action(function(env) {
    console.log('deploying "%s"', env);
  });

program.parse(process.argv);

if(program.chdir){
  console.log("-C,--chdir  ->"+program.chdir)
}

if(program.config){
  console.log("-c, --config  ->"+program.config)
}

console.log("my tool finished")