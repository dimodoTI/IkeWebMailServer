const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SG_KEY);

/* -------------------------------------------------------------------------- */
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.get("/no-cors", (req, res) => {
  console.info("GET /no-cors");
  res.json({
    text: "You should not see this via a CORS request.",
  });
});

/* -------------------------------------------------------------------------- */

app.head("/simple-cors", cors(), (req, res) => {
  console.info("HEAD /simple-cors");
  res.sendStatus(204);
});
app.get("/simple-cors", cors(), (req, res) => {
  console.info("GET /simple-cors");
  res.json({
    text: "Simple CORS requests are working. [GET]",
  });
});
var corsOptions = {
  origin: "http://www.ikeargentina.com.ar",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.options("/ike-mail", cors(corsOptions));
//cors(corsOptions)
app.post("/ike-mail", cors(corsOptions), (req, res) => {
  console.info("POST /ike-mail");

  //info@ikeasistencia.com
  const msg = {
    to: "formularioweb@ikeasistencia.com.ar",
    from: "Ikewebargentina@gmail.com",
    subject: "Consulta de: " + req.body.nombre,
    html: "<p>" +
      req.body.comentario +
      "</p>" +
      "<p></p>" +
      "<p><strong>Telefono:" +
      req.body.telefono +
      "</strong></p><p><strong>E-Mail:" +
      req.body.email +
      "</strong></p>",
  };
  sgMail.send(msg);

  res.json({
    text: "Simple CORS requests are working. [POST]",
  });
});

/* -------------------------------------------------------------------------- */

app.options("/complex-cors", cors());
app.delete("/complex-cors", cors(), (req, res) => {
  console.info("DELETE /complex-cors");
  res.json({
    text: "Complex CORS requests are working. [DELETE]",
  });
});

/* -------------------------------------------------------------------------- */

const issue2options = {
  origin: true,
  methods: ["POST"],
  credentials: true,
  maxAge: 3600,
};
app.options("/issue-2", cors(issue2options));
app.post("/issue-2", cors(issue2options), (req, res) => {
  console.info("POST /issue-2");
  res.json({
    text: "Issue #2 is fixed.",
  });
});

/* -------------------------------------------------------------------------- */

if (!module.parent) {
  const port = process.env.PORT || 3001;

  app.listen(port, () => {
    console.log("Express server listening on port " + port + ".");
  });
}