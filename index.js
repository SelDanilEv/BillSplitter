const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
const passport = require("passport");
const fs = require("fs");
const localStrategy = require("passport-local").Strategy;
const RoomRouter = require("./routers/RoomRouter.js");
const UserRouter = require("./routers/UserRouter.js");
const RequestRouter = require("./routers/RequestRouter.js");
const homeRouter = require("./routers/HomeRouter.js");
const sequelize = require("./db_connection.js");
const userRepository = require("./repository/UserRepository");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({secret: "supersecret"}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/view'));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use("/", homeRouter);

app.use(function (req, res, next) {
    if (req.user
        || (req.url === "/connect" && req.method === 'POST')) {
        req.currentUser = req.user;
        next();
    } else res.redirect("/");
});

app.use("/user", UserRouter);
app.use("/room", RoomRouter);
app.use("/request", RequestRouter);


passport.use(
    new localStrategy(async (username, password, done) => {
        await userRepository.RegisterUser(username, password);
        if (await userRepository.VerifyPassword(username, password))
            return done(null, await userRepository.GetUser(username));
        return done(null, false, {message: "Wrong username or password"});
    })
);

app.post("/connect",
    passport.authenticate("local"),
    function (req, res, next) {
        let view = fs.readFileSync('./view/views/ConnectRoom.html', "utf8");
        res.send(view);
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Соединение с базой данных установлено');
        Do();
    })
    .catch(err => {
        console.log('Ошибка при соединении с базой данных', err.message);
    });


app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

app.listen(3000, () => {
    console.log('Listening on http://localhost:3000`');
});


const USERControl = require('./repository/RoomRepository');


async function Do() {
    // let x = !!(await USERControl.GetAllUsersByRoom('Room1')).find(x => x =="Defendewr");

}


