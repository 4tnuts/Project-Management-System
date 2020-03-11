helpers = {
    isLoggedIn :(req, res, next) => {
        if(req.session.user){
            return next();
        }
        res.redirect('/');
    },
    isAdmin : (req, res, next) => {
        if(req.session.user.isAdmin == 'Admin'){
         return next();   
        }
        res.redirect()
    }
}

module.exports = helpers;