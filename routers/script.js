const express = require('express');
const app = express();
const postRoute = require('./postRoute/post.js');
const userRoute = require('./userRoute/user.js');
// const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
// const session = require('express-session');
const flash = require('connect-flash');
// const ejs = require("ejs");
app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));

app.listen(3000,()=>{
    console.log('App is listening');
})

app.use(expressSession({secret:'SecretString',resave: false,saveUninitialized:true}));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.messages = req.flash('failure');
    res.locals.messagef = req.flash('success');
    next();
});

app.get('/register',(req,res)=>{
    let {name = 'anonomys'} = req.query;
    // console.log(req.session);
    req.session.name = name;
    // console.log(req.session);
    if(name == 'anonomys'){
        req.flash('failure',"User NotRegistered Successfully!");
    }
    else{
        req.flash('success',"User Registered Successfully!");
    }
    // console.log(req.flash('success'));
    res.redirect('/registered');
});

app.get('/registered',(req,res)=>{
    let name = req.session.name;
    res.render('register.ejs',{name});
    // if(req.session.name == 'anonomys'){
    //     res.send('Registration failed');
    // }
    // else{
    //     res.send('Registered Successfully');
    // }
});

// app.get('/session',(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }
//     res.send(`You visited ${req.session.count} times!`);
// });


// Cookies
// app.use(cookieParser('mannTomar'));

// app.get('/getCookies',(req,res)=>{
//     res.cookie('name',"Mann Tomar");
//     res.cookie('phone',7078244036);
//     res.cookie('email',"manntomar46@gmail.com");
//     res.send('Cookies Added');
// });

// app.get('/getCookiesAndData',(req,res)=>{
//     res.send(`hii ${req.cookies.name}`);
// });

// app.get('/getSignedCookies',(req,res)=>{
//     res.cookie('namee',"Mann Tomar",{signed:true});
//     res.cookie('phonee',7078244036,{signed:true});
//     res.cookie('emaill',"manntomar46@gmail.com",{signed:true});
//     res.send('Cookies Added');
// });

// app.get('/getSignedCookiesAndData',(req,res)=>{
//     console.log(req.signedCookies.name);
//     console.log(req.signedCookies.namee);
//     res.send(req.signedCookies.name);
// });

app.use('/post',postRoute);
app.use('/user',userRoute);