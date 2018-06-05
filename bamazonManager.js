var mysql = require("mysql");
var inquirer = require("inquirer");  


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon",
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected!");
    displayMenu();
  });

  //function to display the menu options
  function displayMenu() {
      inquirer.prompt([
          {
            name: "options",
            type: "list",
            message: "-- WELCOME BACK MANAGER --",
            choices: [
                "View products for sale",
                new inquirer.Separator(),
                "Inspect low inventory",
                new inquirer.Separator(),
                "Add to inventory",
                new inquirer.Separator(),
                "Add new product"
            ]
          },
      ]).then(function(answers) {
        if(answers.options === "View products for sale") {
            viewProducts();
        }
        if(answers.options === "Inspect low inventory") {
            inspectInventory();
        }
        if(answers.options === "Add to inventory") {
            addInventory();
        }
        if(answers.options === "Add new product") {
            addProduct();
        }
      });
  }