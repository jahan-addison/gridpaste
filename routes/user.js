
/*
 * GET users listing.
 */

exports.list = function(req, res) {
	req.db.users.findAll().success(function(results) {
		for(var u in results) {
			res.send(results[u].username);
		}
	});
};


