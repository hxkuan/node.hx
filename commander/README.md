# commander简介--node小工具开发

## 前言
当下，作为一名js开发，不知道node那是不可原谅的。但很多同学不知道，node当下使用最多的不是后端开发，而是使用工具的开发，尤其是一些命令行程序。

## 土著做法
当一个Nodejs程序运行时，会有许多存在内存中的全局变量，其中有一个叫做process，意为进程对象。process对象中有一个叫做argv的属性。命令行程序的第一个重头戏就是解析这个process.argv属性。

我们先随便写一个node程序，把process.argv打印出来看看，
```shell
$ node test1.js --name gk
[
    '/usr/local/Cellar/node/6.6.0/bin/node',
    '/Users/gejiawen/code/20160921/test1.js',
    '--name',
    'gk'
]
```
看起来process.argv好像是一个数组，其中第一个元素是node的执行路径，第二个元素是当前执行文件的路径，从第三个元素开始，是执行时带入的参数。

所以，规律很简单。我们在写命令行程序时，只需要对process.argv这个数组的第三个元素及其之后的参数进行解析即可。

如果不嫌麻烦，完全可以写出很多判断分支来做。但是现在我们有更好的方法。

## 使用commander.js
commander.js是TJ所写的一个工具包，其作用是让node命令行程序的制作更加简单。

### 安装及使用
```shell
$ npm install commander
```
注意包名是commander而不是commander.js。

然后我们在新建一个js文件，叫做index.js，内容如下
```shell
var program = require('commander')

program
    .version('0.0.1')
    .description('a test cli program')
    .option('-n, --name <name>', 'your name', 'GK')
    .option('-a, --age <age>', 'your age', '22')
    .option('-e, --enjoy [enjoy]')

program.parse(process.argv)
```
此时，一个简单的命令行程序就完成了。我们通过如下的命令来执行它，
```shell
$ node index.js -h
```
结果如下，
```shell
$ ./test -h

  Usage: test [options]

  a test cli program

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -n, --name <name>    your name
    -a, --age <age>      your age
    -e, --enjoy [enjoy]
```
commander.js第一个优势就是提供了简介的api对可选项、参数进行解析。第二个优势就是自动生成帮助的文本信息。

## 常用API
commander.js中命令行有两种可变性，一个叫做option，意为选项。一个叫做command，意为命令。

```js

//选项
program
   .version('0.0.1')
   .option('-C, --chdir <path>', 'change the working directory')
   .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
   .option('-T, --no-tests', 'ignore test hook');

//命令
 program
   .command('name <dir> [otherDirs...]')
   .description('run teardown commands')
   .action(function(dir, otherDirs) {
     console.log('dir "%s"', dir);
     if (otherDirs) {
       otherDirs.forEach(function (oDir) {
         console.log('dir "%s"', oDir);
       });
     }
   });

```
命令的用法：node *.js [command_name] [dir..]

### 方法描述
#### version
用法： .version('x.y.z')

#### description
用法：.description('command description')

用于设置命令的描述
用于设置命令程序的版本号，

#### option
用户：.option('-n, --name <name>', 'your name', 'GK')

  - 第一个参数是选项定义，分为短定义和长定义。用|，,， 连接。
    -参数可以用<>或者[]修饰，前者意为必须参数，后者意为可选参数。
  - 第二个参数为选项描述
  - 第三个参数为选项参数默认值，可选。

#### command
用法：.command('init <path>', 'description')

command的用法稍微复杂，原则上他可以接受三个参数，第一个为命令定义，第二个命令描述，第三个为命令辅助修饰对象。
  - 第一个参数中可以使用<>或者[]修饰命令参数
  - 第二个参数可选。
    - 当没有第二个参数时，commander.js将返回Command对象，若有第二个参数，将返回原型对象。
    - 当带有第二个参数，并且没有显示调用action(fn)时，则将会使用子命令模式。
    - 所谓子命令模式即，./pm，./pm-install，./pm-search等。这些子命令跟主命令在不同的文件中。
  - 第三个参数一般不用，它可以设置是否显示的使用子命令模式。


#### action
用法：.action(fn)

用于设置命令执行的相关回调。fn可以接受命令的参数为函数形参，顺序与command()中定义的顺序一致。

#### parse
用法：program.parse(process.argv)

此api一般是最后调用，用于解析process.argv。

#### outputHelp
用法：program.outputHelp()

一般用于未录入参数时自动打印帮助信息。

eg:
```js
if (!process.argv.slice(2).length) {
    program.outputHelp(make_red);
}

function make_red(txt) {
    return colors.red(txt); //display the help text in red on the console
}
```

## 实践
结下来，我们就来做个简单的命令行小工具，功能是输出 hi,welcome to use me。

首先我们得创建一个项目，
```shell
$ mkdir npmrc-local
$ cd npmrc-local
$ npm init
$ touch .gitignore
$ mkdir bin
$ mkdir lib
$ touch bin/npmrc.js
$ touch lib/index.js
```
修改package.json文件，添加bin字段，
```Json
{
    "bin": {
        "npmrc": "./bin/npm.js"
    }
}
```
修改bin/npmrc.js,
```js
#!/usr/bin/env node

require('../lib/index')
```
修改lib/index.js,
```js
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
```
然后`npm link`,如此就可以在本地使用了。如：

``` shell
➜  npmrc-local ✗ npmrc-hx -h

  Usage: npmrc-hx [options]


  Options:

    -V, --version          output the version number
    -N, --userName <path>  input name
    -h, --help             output usage information

➜  npmrc-local ✗ npmrc-hx -N hxkuan
hi "hxkuan",welcome to use me
my tool finished

```
当然，你也可以对外发布到npm上面，在这里这方面就不继续开展了。