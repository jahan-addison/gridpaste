
/*
 * GET users listing.
 */

exports.list = function(req, res){
    req.db.query('SELECT * FROM `users`', function(err, rows, fields) {
        if (err) throw err;
        for(var i = 0; i < rows.length; i++) {
            res.send(rows[i].username + "\n");
        }
    });
};
