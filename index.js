#!/usr/bin/env node
// 使用Node开发命令行工具所执行的 JavaScript 脚本必须在顶部加入 #!/usr/bin/env node声明，注释要用node来执行


// 1、原生获取用户输入命令  process.argv比较麻烦，使用commander工具包
// console.log(process.argv)
const { Command } = require('commander');
const program = new Command();

const download = require('download-git-repo');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const ora = require('ora');
const fs = require('fs')

program
  .version('0.1.0')

// 定义模板列表
const templates = {
  'tpl-a': {
    url: 'https://github.com/zongzhu321/tpl-a',
    downloadUrl: 'http://github.com:zongzhu321/tpl-a#main',
    description: '模板 A'
  },
  'tpl-b': {
    url: 'https://github.com/zongzhu321/tpl-b',
    downloadUrl: 'http://github.com:zongzhu321/tpl-b#main',
    description: '模板 B'
  }
};

program
  .command('init <template> <project>')
  .description('初始化项目模板')
  .action((templateName, projectName) => {
    // 根据模板名下载对应的模板到本地并起名为 projectName
    //  第一个参数：仓库地址
    //  第二个参数：下载路径
    // 开始下载
    const spinner = ora('正在下载模板...');
    const { downloadUrl } = templates[templateName]
    download(downloadUrl, projectName, (err) => {
      spinner.start();
      if (err) {
        // 下载失败调用
        spinner.fail();
        return
      } else {
        // 下载成功调用
        spinner.succeed();
        // 把项目下的package.json 文件读取出来
        // 使用向导的方式采集用户输入的值
        // 使用模板引擎把用户输入的数据解析到 package.json
        // 解析完毕，把解析之后的结果重新写入 package.json
        inquirer.prompt([{
          type: 'input',
          name: 'name',
          message: '请输入项目名称'
        }, {
          type: 'input',
          name: 'description',
          message: '请输入项目描述'
        }, {
          type: 'input',
          name: 'author',
          message: '请输入作者名称'
        }]).then((answers) => {
          const packagePath = `${projectName}/package.json`
          const packageContent = fs.readFileSync(packagePath, 'utf8')
          const packageResult = handlebars.compile(packageContent)(answers)
          fs.writeFileSync(packagePath, packageResult)
          console.log('初始化模板成功')
        })
      }
    })
  });

program
  .command('list')
  .description('查看所有可用模板')
  .action(() => {
    for (let key in templates) {
      console.log(`
        ${key} ${templates[key].description}
      `)
    }
  })

program.parse(process.argv);

