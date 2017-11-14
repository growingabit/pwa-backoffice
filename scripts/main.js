const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');
const path = require('path');

const scriptsPath = path.resolve(__dirname);

console.log(scriptsPath);

const commands = {
  dev:{
    simple: 'npm run dev',
    dashboard: 'npm run dashboard'
  },
  deploy: `npm run build:prod && sh ${scriptsPath}/deploy.sh`
}
inquirer.prompt([
  {
    type: 'list',
    message: 'What you want to do?',
    default: 'dev',
    name: 'command',
    choices: [{
      name: 'run local server',
      value: 'dev'
    },
    {
      name: 'deploy code to prod',
      value: 'deploy'
    }]
  },
  {
    when: function (answer) {
      return answer.command === 'dev';
    },
    type: 'confirm',
    message: 'Do you want to display the dev dashboard?',
    default: true,
    name: 'dashboard'
  },
]).then(answers => {
  let command = commands[answers.command];
  if(answers.command === 'dev'){
    command = answers.dashboard ? command.dashboard : command.simple
  }
  console.info(`tips: next time you want to run this same commands, if you want to go faster you can type ${chalk.bold.blue(command)}`);
  execSync(command, { stdio: 'inherit' });
});
