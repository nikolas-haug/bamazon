## bamazon marketplace

This is a command line application that replicates an Amazon-like storefront for the user.

The products and their respective prices, quantities, IDs, and department locations are all stored in a MySQL database.

There are two diferent levels, or iterations of this storefront/marketplace:

* Customer view

* Manager view

The Customer view allows users to view and purchase available products from the databse.

The Manager view allows an admin to view and update the products in the database (stock quantity etc.).

### Technologies used:

* node.js

* MySQL

* npm packages: inquirer, mysql, cli-table (prettify)

## Application overview:

### bamazonCustomer.js

The user is prompted with a cli-table of the available products and their prices, quantities, and department names.

![customer image 1](images/bamazoncustomer1.png)

They are asked to enter a valid product ID and a desired quantity.

![customer image 2](images/bamazoncustomer2.png)

The order is placed and they are shown a receipt of their purchase.

![customer image 3](images/bamazoncustomer3.png)

The stock quantity of the chosen product is updated in the database.

![customer image 4](images/bamazoncustomer4.png)

The user is then prompted if they would like another sale. If yes, the products table is displayed again. If no, they exit the application.

![customer image 5](images/bamazoncustomer5.png)