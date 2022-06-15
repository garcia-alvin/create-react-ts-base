#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};
const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/garcia-alvin/create-react-ts-base.git ${repoName}`;
const installDepsCommandNPM = ` cd ${repoName} && npm install`;
const installDepsCommandYarn = ` cd ${repoName} && yarn`;
function isUsingYarn() {
  return (process.env.npm_config_user_agent || '').indexOf('yarn') === 0;
}
function updatePackageName() {
  runCommand(`cd ${repoName}`);
  try {
    let packageJSON = JSON.parse(fs.readFileSync(`./${repoName}/package.json`));
    console.log(`package.json : ${packageJSON}`);
    packageJSON.name = `${repoName}`;
    packageJSON.version = `1.0.0`;

    console.log(`Writing package.json`);
    fs.writeFileSync(`./${repoName}/package.json`, JSON.stringify(packageJSON, null, 4));
  } catch (e) {
    console.error(`Failed in updating package.json`, e);
    runCommand(`rm -rf ${repoName}`);
    process.exit(-1);
  }
}

console.log(`Cloning the repository with name ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

let installedDeps;
if (!isUsingYarn) {
  console.log(`Installing dependencies for ${repoName} using NPM`);
  updatePackageName();
  installedDeps = runCommand(installDepsCommandNPM);
} else {
  console.log(`Installing dependencies for ${repoName} using Yarn`);
  updatePackageName();
  installedDeps = runCommand(installDepsCommandYarn);
}
if (!installedDeps) {
  runCommand(`cd .. && rm -rf ${repoName}`);
  process.exit(-1);
}
runCommand(`rm -rf bin`);
console.log(`Congratulations!! You are ready. `);
