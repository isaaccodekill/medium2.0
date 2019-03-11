const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    ejs = require('ejs'),
    override = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require("passport-local-mongoose"),
    session = require("express-session"),
    flash = require('connect-flash'),
    cookieparser = require("cookie-parser"),
    expressValidator = require('express-validator'),
    moment = require("moment")


let Blog = require("./models/blog")
let User = require("./models/user")
let Comment = require("./models/comments")


mongoose.connect('mongodb://localhost/blogs', {
    useNewUrlParser: true
})
mongoose.Promise = Promise
let db = mongoose.connection
db.on('error', () => {
    console.error.bind(console, "there was an error")
})
db.once("open", () => {
    console.log("db connected succesfully")
})


app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(session({
    secret: "this is a secret",
    saveUninitialized: true,
    resave: true

}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(expressValidator())
app.use(expressSanitizer())
app.use(override("_method"))



// express vlidator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.lenght) {
            formParam += '[' + namespace.shift() + ']'
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))




app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.user = req.user
    res.locals.arre = req.arre

    next()
})

// creatign the schema

// restful routes

// index route
arre = []
let counter = 0;
app.get("/", (req, res) => {
    Blog.find({}, (err, allblogs) => {
        if (err) {
            console.log(err)
        } else {
            console.log('hello')
            allblogs.forEach(blog => {
                while (counter < 4) {
                    arre.push(blog)
                    counter++
                }
            })
            res.render("index2", {
                blogs: allblogs,
                arre: arre
            })
        }
    }).sort({
        created: -1
    })
})

//new route
app.get("/blogs/new", islogged2, (req, res) => {
    res.render("new")
})

// create route



app.post("/", islogged2, (req, res) => {
    Blog.create({
        title: req.body.title,
        image: req.body.image,
        body: req.body.body

    }, (err, blog) => {
        if (err) {
            console.log(err)
        } else {
            blog.author.id = req.user._id
            blog.author.username = req.user.username
            blog.save()
            console.log("new blog was created")
            console.log(blog.body)
        }
    })
    res.redirect("/")
})

// show route

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id).populate("comments").exec((err, blog) => {
        if (err) {
            console.log(err)
        } else {
            res.render("show2", {
                blog: blog
            })
        }
    })

})

// comments stuffs
// get comment for a blog route
app.get("/api/blogs/:id/comments", (req, res) => {
    Blog.findById(req.params.id).populate("comments")
        .then(function (data) {
            res.json(data)
        })
        .catch(function (error) {
            console.log(error)
        })
})


app.post("/api/blogs/:id/comments", (req, res) => {
    Blog.findById(req.params.id)
        .then(function (blog) {
            console.log(req.body)
            Comment.create(req.body)
                .then(function (newComment) {
                    console.log("initially created")
                    newComment.author.id = req.user.id
                    newComment.author.username = req.user.username
                    newComment.save()
                    return newComment
                })
                .then(function (newComment) {
                    blog.comments.push(newComment)
                    blog.save()
                    delete req.session.bodyman
                    console.log(newComment)
                    console.log("pushed")   
                    res.status(201).json(newComment)
                })
                .catch(function (error) {
                    res.send(error)
                })
        })
        .catch(function (error) {
            console.log(error)
        })


})

//  delete a comment 
app.delete("/blogs/:id/comments/:commentid/delete", (req, res) => {
    Comment.findByIdAndDelete(req.params.commentid)
        .then(comment => {
            console.log("comment was delted")
        })
        .catch(err => {
            console.log(err)
        })
    Blog.findById()
    res.redirect("/blogs/" + req.params.id)
})


// edit route

app.get("/blogs/:id/edit", isAuthed, (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            console.log(err)
        } else {
            res.render("edit", {
                blog: blog
            })
        }
    })
})


// update route

app.put("/blogs/:id", isAuthed, (req, res) => {
    let id = req.params.id
    Blog.findOne({
        _id: id
    }, (err, blog) => {
        if (err) {
            console.log(err)
        } else {
            blog.set({
                title: req.body.title,
                image: req.body.image,
                body: req.body.body
            })
            blog.save()
            console.log("blog was updated")
            res.redirect("/blogs/" + id)
        }

    })


})

app.delete("/blogs/:id", isAuthed, (req, res) => {
    let id = req.params.id
    Blog.findByIdAndRemove({
            _id: id
        })
        .then(blog => {
            console.log(blog)
        })
        .catch(err => {
            console.log(err)
        })
    console.log("the blog was deleted")
    res.redirect("/")
})

// auth functions

function islogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.session.bodyman = req.body
    req.session.returnTo = req.originalUrl
    req.flash("error_msg", "You need to be logged in to do that")
    res.redirect("/login")

}

function islogged2(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.session.returnTo = req.originalUrl
    req.flash("error_msg", "You need to be logged in to do that")
    res.redirect("/login")




}

function isAuthed(req, res, next) {
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id, (err, blog) => {
            if (err) {
                console.log(err)
            } else {

                if (blog.author.id.equals(req.user._id)) {
                    return next()
                } else {
                    req.flash("error_msg", "You're not authorized")
                    res.redirect("back")
                }
            }
        })

    } else {
        req.flash("error_msg", "pls log in")
        res.redirect("back")
    }
}
// registration

app.get("/register", (req, res) => {
    res.render("register", {
        error: false
    })
})
app.post("/register", (req, res) => {
    let username = req.body.username,
        email = req.body.email,
        password = req.body.password,
        password2 = req.body.password2,
        image = req.body.url

    req.checkBody("username", "A Username is required").notEmpty()
    req.checkBody("email", "Your Email Address is required").notEmpty()
    req.checkBody("email", "Enter a valid Email Address").isEmail()
    req.checkBody("password", "Enter a password").notEmpty()
    req.checkBody("password", "Password must be at least 6 characters long").isLength(6)
    req.checkBody("password2", "Confirm your password").notEmpty()
    req.checkBody("password2", "Your password was not matched").equals(req.body.password)


    let error = req.validationErrors()
    if (error) {
        res.render("register", {
            error: error
        })
    } else {
        let newUser = new User({
            username: req.body.username,
            email: req.body.email,
            avatar: req.body.url
        })

        User.register(newUser, req.body.password, (err, userCreated) => {
            if (err) {
                console.log(err)
                req.flash("error_msg", err.message)
                res.redirect("back")
            } else {
                passport.authenticate("local")(req, res, function () {
                    console.log(userCreated)
                    req.flash("success_msg", "Welcome to the blog app")
                    res.redirect("/")
                })
            }
        })
    }


})


// ======================
// profile Route
// =====================

app.get("/users/:username", (req, res) => {
    res.render("profileintro")
})




// ==========================
//  login routes
// ==========================

app.get("/login", (req, res) => {
    console.log("yay the login page")
    res.render("login")
})

app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
        console.log(req.session.returnTo)
    req.flash("success_msg", "You have logged in")
    if (req.session.returnTo) {
        res.redirect(307, req.session.returnTo)
        delete req.session.returnTo
    } else {
        res.redirect("back")
    }

})



// logout

app.get("/logout", (req, res) => {
    req.flash("success_msg", "You've succesfully logged out")
    res.redirect("/")
    req.logOut()
    req.session.destroy()
})

passport.use(new LocalStrategy(User.authenticate())), passport.serializeUser(User.serializeUser()), passport.deserializeUser(User.deserializeUser())

app.listen(5500, () => {
    console.log('App has been served on localhost:3000')
})