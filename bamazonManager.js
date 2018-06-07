var mysql = require("mysql");
var inquirer = require("inquirer"); 
//prettify the console output
var Table = require('cli-table');

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
        pageSize: 10,
        choices: [
            "View products for sale",
            new inquirer.Separator(),
            "Inspect low inventory",
            new inquirer.Separator(),
            "Add to inventory",
            new inquirer.Separator(),
            "Add new product",
            new inquirer.Separator(),
            "* * Exit * *",
            new inquirer.Separator()
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
    if(answers.options === "* * Exit * *") {
        exitApp();
    }
    });
}

//show all of the available products for sale and their details - despite stock quantity
function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    // instantiate
    var table = new Table({
        head: ["Product", "ID", "Department", "Price $ ", "Quantity"],
        colWidths: [40, 10, 20, 10, 10]
    });
    for(var i = 0; i < res.length; i++) {

        //push products and product details into cli-table
        table.push(
            [res[i].product_name, res[i].item_id, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity]
        );
    }
    console.log(table.toString());
    displayMenu();
    });
}

//show all of the products with stock quantity lower than 5
function inspectInventory() {
    //check for low inventory items
    connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    // instantiate
    var table = new Table({
        head: ["Product", "Low quantity"],
        colWidths: [40, 40]
    });
    for(var i = 0; i < res.length; i++) {
        if(res[i].stock_quantity < 5) {
            table.push([
                res[i].product_name,
                res[i].stock_quantity
            ]);
        }
    }
    console.log(table.toString());
    displayMenu();
});   
}

//add to the stock quantity of a chosen product
function addInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        inquirer.prompt([
            {
                name: "product",
                type: "list",
                message: "what product do you want to add to?",
                choices: function() {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }
                return choiceArray;
                }
            },
            {
                name: "quantity",
                type: "input",
                //validate that input is a number with a regEx
                validate: function(value) {
                    return /^[0-9]+$/.test(value);
                },
                message: "how many do you want to add?"

            },
        ]).then(function(answers) {
            updateStock(answers.product, answers.quantity);
            displayMenu();
        });
    });   
}

//update the database with the added stock quantity input
function updateStock(item, addQuant) {
    connection.query("SELECT stock_quantity FROM products WHERE product_name = ?",
    [item],
    function(err, res) {
        if(err) throw err;
        connection.query("UPDATE products SET stock_quantity = ? WHERE product_name = ?",
        [
            res[0].stock_quantity + parseInt(addQuant), item
        ],
            function(err) {
                if(err) throw err;
            });
        }
    )
}

//add a new product to the database
function addProduct() {
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "Product name:"
        },
        {
            name: "department",
            type: "input",
            message: "Department:"
        },
        {
            name: "price",
            type: "input",
            message: "Price:"
        },
        {
            name: "quantity",
            type: "input",
            message: "Quantity:"
        },
    ]).then(function(answers) {
        var addedProduct = {
            product_name: answers.productName,
            department_name: answers.department,
            price: answers.price,
            stock_quantity: answers.quantity
        }
        connection.query("INSERT INTO products SET ?", addedProduct, function(err) {
            if(err) throw err;
            console.log("product added!");
            displayMenu();
        });
    });
}

//exit the application
function exitApp() {
    console.log("===== logout successful! ====");
    connection.end();
}