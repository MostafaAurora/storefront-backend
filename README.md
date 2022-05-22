# Storefront Backend Project

this project is an imagined back-end for an online store

<br>
<br>
<br>

## main project dependencies 
    Node.Js
    postgreSQL

<br>

other dependencies will be installed automatically with a command

<br>
<br>

### database port is '5432'

<br>

### server port is 'localhost:3000'

<br>
<br>

## setup instructions
    1.open the terminal in the project folder and run the command 'npm install'
    2.open your sql terminal and log in with your master username and password
    3.type in the terminal 'CREATE USER store_user WITH PASSWORD 'password123' ;' and run the command
    4.type in the terminal 'CREATE DATABASE store_dev;' and run the command
    5.type in the terminal 'CREATE DATABASE store_test;' and run the command
    6.type in the terminal 'GRANT ALL PRIVILEGES ON DATABASE store_dev TO store_user' and run the command
    7.type in the terminal 'GRANT ALL PRIVILEGES ON DATABASE store_test TO store_user' and run the command


## notes 
- postman or an equivalent program is needed for testing all endpoints.
- some test objects along with a pre created admin user for authorization testing are provided in the "postman_test_objects.txt".
- functionality has been added throughout the project for providing feedback on errors and invalid or missing parameters as well as authorization feedback.
- commented code is left for logging hashed passwords to use them to pre create your own user via database migrations.
- run 'db-migrate up' for up migrations and 'db-migrate reset' for down migrations