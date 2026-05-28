const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;


const dayjs = require("dayjs");
require("dayjs/locale/es");
dayjs.locale("es");      

const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: "clave para sesiones",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,            
        maxAge: 1000 * 60 * 30     
    }
}));

app.use((req, res, next) => {

    const ms = 10000; 
    const timer = setTimeout(() => {
        if (!res.headersSent){
            console.warn("Tiempo de espera agotado");
            res.status(408).send("Tiempo de espera agotado");
        }
    }, ms);

    res.once("finish", () => clearTimeout(timer));
    res.once("close", () => clearTimeout(timer));

    next();
});


function requiereAuth(req, res, next) {
    if (req.session.user) return next();
    res.redirect("/login");
}

app.get('/login', (req, res) => {

  res.render('login', { error: null }); 
});



app.post("/login", (req, res) => {
    const { usuario, password } = req.body;

    if (usuario && password === "1234") {
        req.session.user = { nombre: usuario };
        return res.redirect("/sesiones");
    }

 res.status(401).render("login", { error: "Usuario o contraseña incorrectos" });
});





app.post("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");
    });
});

app.get('/form', (req, res) => {
    res.render("form", {
        nombre: "",
        email: "",
        edad: "",
        ciudad: "",
        intereses: [],
        errores: [] 
    });
});


app.post("/form", (req, res) => {
    const { nombre, email, edad, ciudad } = req.body;
    let intereses = req.body.intereses || [];

    if (!Array.isArray(intereses)) {
        intereses = [intereses];
    }

    let errores = [];

    if (!nombre || nombre.trim().length < 2) {
        errores.push("El nombre tiene que tener mínimo 2 caracteres.");
    }

    if (!ciudad) {
        errores.push("La ciudad no puede quedar vacía.");
    }

    if (errores.length) {
        return res
            .status(400)
            .render("form", { nombre, email, edad, ciudad, intereses, errores });
    }

    res.render("resultado", {
        nombre,
        email,
        edad: edad || null,
        ciudad,
        intereses
    });
});

const sesiones = [
  { id: 1, nombre: "Sesión meditación", precio: 50 },
  { id: 2, nombre: "Sesión conexion con tu alma", precio: 70 },
  { id: 3, nombre: "Sesión manifestación", precio: 30 },
];

app.get("/sesiones", (req, res) => {
  const user = req.session.user  || { nombre: "Invitado" };
  const carrito = req.session.carrito || [];
  res.render("sesiones", { sesiones, user, carrito });
});

app.post("/carrito/agregar", (req, res) => {
  const { id, nombre, precio, cantidad } = req.body;
  if(!req.session.carrito) req.session.carrito = [];
  req.session.carrito.push({ id, nombre, precio: Number(precio), cantidad: Number(cantidad) });
  res.redirect("/sesiones");
});

app.post("/checkout", requiereAuth, (req, res) => {
  req.session.carrito = [];
  res.send(`
    <html>
      <head>
          <title>Reserva Completada | Sueños Valenti</title>
          <link rel="stylesheet" href="/styles.css">
      </head>
      <body class="oscuro center-screen">
        <div class="stars"></div>
        <div class="glass-card" style="text-align: center;">
            <h2>¡Reserva Confirmada! ✨</h2>
            <p>Tus sesiones han sido reservadas con éxito. Nos pondremos en contacto contigo pronto.</p>
            <a href="/sesiones" class="btn mt-2">Volver a las sesiones</a>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en: http://localhost:${PORT}`);
});