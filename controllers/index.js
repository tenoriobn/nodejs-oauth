const bcrypt = require('bcrypt')
const User = require("../models/user")

exports.showIndex = (req, res, next) => {
    res.render('index')
}

exports.showPageSignUp = (req, res, next) => {
    res.render('signUp')
}

exports.showMembersPage = (req, res) => {
    res.render('members')
}

exports.get404Page = (req, res, next) => {
    res.status(404).render('404')
}

exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User(username, email, hashedPassword);

    try {
        await user.save();
        res.redirect('/');
    } catch(err) {
        console.log(err);
        res.redirect('signup');
    }

}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne(email, password);

    try {
        if (user) {
            req.session.user = user;
            res.redirect('/members');
        } else {
            res.redirect('/');
        }        
    } catch(err) {
        console.log(err);
        res.redirect('/');
    }

}

exports.checkAuth = async (req, res, next) => {
    if (req.session && req.session.user || req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

exports.logout = async (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log('erro: ', err)
        } else {
            res.redirect('/');
        }
    })
}