#!/usr/bin/sh

echo $(cat <<EOF
exports.sequelize = {
  database: "gridpaste",
  host:     "localhost",
  user:     "travis",
  password: ""
};
  
exports.mongo = {
  url: 'mongodb://localhost/gridpaste'
};
EOF
) > config.js
