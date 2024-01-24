
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
    const prompt = inquirer.createPromptModule();
    db.query(`SELECT id as value, CONCAT(first_name, ' ', last_name) as name
     FROM employee`, (error, 
        managers = [])  => {
            prompt({
                message: 'Choose a manager',
                type: 'rawlist',
                name: 'manager_id',
                choices: managers
            }).then((answers) => {
                db.query('SELECT * FROM employee WHERE ?', answers, (error, employees) => {
                    console.table(employees);
                });
            })
    });
};
if (answers.view === 'View All Roles') {
    // This SQL query selects all roles and displays them in a table. 
    db.query('SELECT role.title AS Role_Title, role.id AS Role_ID, department.name AS Department_Name, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id;', (error, results) => {
        if (error) {
            console.log("Error getting query: ", error);
        } else {
            console.log("View All Roles:")
            console.table(results);
        }

        
    })
};
if (answers.view === 'Exit') {
    process.exit();
}
});
};

start();

