const childProcess = require("child_process");

const chalk = require("chalk");

let appProc = childProcess.fork("./app.js");
appProc.on('close', function(code) {
    console.clear();
    console.error(`${chalk.red("X")} Process exited with code ${code}, trying to restart...`);
    appProc = childProcess.fork('./app.js');
});