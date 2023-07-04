const express          = require("express");
const livereload       = require("./middleware/livereload");
const helmet           = require("helmet");
const mongoose         = require("mongoose");
const log              = require("debug")("app:main");
const cors             = require("cors");
const cookieParser     = require("cookie-parser");
const deleteUnverified = require("./middleware/deleteUnverified");

// configuration ----------------------------------------------
const app = express();
const port = process.env.PORT || 5000;
// cors setup
const whitelist = ['http://localhost:3000'];
const corsOptions = {
    credentials: true,
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    }
}

// middleware -------------------------------------------------
app.use(livereload());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(helmet());
app.use(cookieParser());

// template engine --------------------------------------------
app.set("view engine", "ejs");
app.set("views", "./views/pages");

// database ---------------------------------------------------
mongoose
.connect("mongodb://root:YDQfCKl7slQ3Avew6uFrkeSR@michael.iran.liara.ir:34929/my-app?authSource=admin")
.then(log("connected to MongoDB"))
.catch(err => log("failed to connect MongoDB: " + err.message));

// routes -----------------------------------------------------
app.use("/signup", require("./routes/signup"));
// app.use("/login",  require("./routes/login"));
// app.use("/panel",  require("./routes/panel"));
//api
// app.use("/api/planttype", require("./routes/api/planttype"));

const deleteUnverified_interval = deleteUnverified(30);

// port -------------------------------------------------------
app.listen(port, () => {log(`server is listening on port ${port}...`)});