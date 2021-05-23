#!/usr/bin/env node
// 使用Node开发命令行工具所执行的 JavaScript 脚本必须在顶部加入 #!/usr/bin/env node声明，注释要用node来执行


// 1、原生获取用户输入命令  process.argv比较麻烦，使用commander工具包
// console.log(process.argv)
const { Command } = require('commander');
const program = new Command();

program
  .version('0.1.0')

program
  .command('init <template> <project>')
  .description('初始化项目模板')
  .action((templateName, projectName) => {
    // 根据模板名下载对应的模板到本地并起名为 projectName
    console.log(templateName, projectName)
  });
program
  .command('list')
  .description('查看所有可用模板')
  .action()
  
program.parse(process.argv);

