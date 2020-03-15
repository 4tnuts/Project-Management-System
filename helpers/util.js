helpers = {
    isLoggedIn :(req, res, next) => {
        if(req.session.user){
            return next();
        }
        res.redirect('/');
    },
    isAdmin : (req, res, next) => {
        console.log(req.session.user)
        if(req.session.user.isadmin){
         return next();   
        }
        res.redirect('/projects')
    }
}

module.exports = helpers;