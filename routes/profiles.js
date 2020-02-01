const express = require('express');
const router = express.Router();
const helpers = require('../helpers/util.js');

module.exports= (pool) => {
    router.get('/', helpers.isLoggedIn, (req, res, next) => {
        const selectQuery = 'SELECT * FROM users WHERE userid = $1';
        const id = [req.session.user.userid];
        pool.query(selectQuery, id, (err, result) => {
            res.render('profile/profile', {userData : result.rows[0]});
        })
    });

    router.post('/', helpers.isLoggedIn, (req, res, next) => {
            console.log(req.session.user.userid);
            console.log(req.session.user)
            const data = [req.body.email, req.body.password, req.body.position, req.body.isfulltime, req.session.user.userid];
            if(req.body.password == ''){
                data[1] = req.session.user.password;
            }
            let updateQuery = 'UPDATE users SET email=$1, password=$2, position=$3, isfulltime=$4 WHERE userid=$5';
            console.log(data);
            pool.query(updateQuery, data, (err, result) => {
                if(err){
                    return console.log(err);
                }
                res.redirect('/profiles');
            });
    })
    return router;
}