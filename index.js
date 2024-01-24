
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     _____                 _                                      ║
║    | ____|_ __ ___  _ __ | | ___  _   _  ___  ___                ║
║    |  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\               ║
║    | |___| | | | | | |_) | | (_) | |_| |  __/  __/               ║
║    |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|               ║
║                    |_|            |___/                          ║
║                                                                  ║
║     __  __                                                       ║
║    |  \\/  | __ _ _ __   __ _  __ _  ___ _ __                     ║
║    | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |\/ _ \\ '__                     ║
║    | |  | | (_| | | | | (_| | (_| |  __/ |                       ║
║    |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|                       ║
║                              |___/                               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);

const db = mysql.createConnection({
    database: 'employees',
    user: 'root',
}, console.log('connected'));

const prompt = inquirer.createPromptModule();

const start = () => {
prompt({
    message: 'Choose an options',
    type: 'rawlist',
    name: 'view',
    choices: [
        'View All Employees',
        'Add Employees',
        'Update Employee',
        'View Managers Employees',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',

        'Exit'
    ]
}).then((answers) => {
    if (answers.view === 'View All Employees') {
        db.query('SELECT * FROM employee', (error, employees) => {
            if (error) console.error(error);
            console.table(employees);
            start();
        });
}
if (answers.view === 'View Managers Employees') {
    db.query('SELECT * FROM employee', (error, employees) => {
        if (error) console.error(error);
        console.table(employees);
        start();
    });
}
if (answers.view === 'View All Roles') {
    db.query('SELECT * FROM employee', (error, employees) => {
        if (error) console.error(error);
        console.table(role);
        start();
    });
}
if (answers.view === 'Exit') {
    process.exit();
}
});
};

start();

