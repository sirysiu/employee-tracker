
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
if (answers.view === 'Add Employees') {
   
    inquirer
        .prompt([
            {
                name: "employee_firstName",
                type: "input",
                message: "Employee first name?",
            },
            {
                name: "employee_lastName",
                type: "input",
                message: "Employee last name?",
            },
            {
                name: "employee_role",
                type: "input",
                message: "What role are they?",
            },
            {
                name: "employee_manager",
                type: "input",
                message: "Manager last name?",
            },
        ])
        .then((response) => {

            const insertEmployeeSql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";

            selectRoleIdSql = "SELECT id FROM role WHERE title = ?";
            selectManagerIdSql = "SELECT id FROM employee WHERE last_name = ?";

            // This gets role Id based on the role name. 
            db.query(selectRoleIdSql, [response.employee_role], (error, roleResults) => {
                if (error) {
                    console.log("Error retieving role ID:", error);
                    
                } else {
                    // This checks to make sure we retreived the Id from the role
                    const roleId = roleResults[0] ? roleResults[0].id : null;

                    if (roleId !== null) {

                        if (response.employee_manager.trim() !== '') {
                            // This will retreive the manager_id based on manager last name.
                            db.query(selectManagerIdSql, [response.employee_manager], (error, managerResults) => {
                                if (error) {
                                    console.log("Error retrieving manager ID: ", error);
                                    
                                } else {
                                    const managerId = managerResults[0] ? managerResults[0].id : null;

                                    if (managerId !== null) {
                                        db.query(
                                            insertEmployeeSql, [response.employee_firstName, response.employee_lastName, roleId, managerId], (error, results) => {
                                                if (error) {
                                                    console.log("Error inserting into db: ", error);
                                                } else {
                                                    console.log("Added employee: ", response.employee_firstName, response.employee_lastName);
                                                }

                                                
                                            }
                                        );
                                    } else {
                                        console.log("Manager not found. Employee not added.");
                                        
                                    }
                                }
                            });
                        } else {
                            db.query(insertEmployeeSql, [response.employee_firstName, response.employee_lastName, roleId, null], (error, results) => {
                                if (error) {
                                    console.log("Error inserting into db: ", error);
                                } else {
                                    console.log("Added employee:", response.employee_firstName, response.employee_lastName);
                                }

                               
                            })
                        }

                    } else {
                        console.log("Role not found. Employee not added.");
                       
                    }
                }
            });

        });
};

if (answers.view === 'View All Departments') {
   // This SQL query selects all departments and displays them in a table. 
   db.query('SELECT id AS Department_ID, name AS Department_Name FROM department;', (error, results) => {
    if (error) {
        console.log("Error getting query: ", error);
    } else {
        console.log("View All Departments:");
        console.table(results)
    }

   
})
};
if (answers.view === 'Exit') {
    process.exit();
}
});
};

start();

