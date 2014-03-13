gridpaste
=========

![gridpaste](http://i.imgur.com/SgA43Vu.png) 

A tool to paste functions, transformations, and proofs on a geometric plane

Dependencies:
- A MySQL server (MySQL, Percona, etc)

Add a config.js to the base directory:
```
var config = {}

config.dbname = "gridpaste"
config.dbhost = "your_database_host"
config.dbuser = "your_database_user"
config.dbpassword = "your_database_password"

module.exports = config;
```
