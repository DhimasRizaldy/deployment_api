require('dotenv').config();
const Sentry = require("@sentry/node");
const express = require('express');
const app = express();
const morgan = require('morgan');
const { PORT = 3000, SENTRY_DSN } = process.env;
// const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yaml');
// const fs = require('fs');


Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app })
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0
});

// // read yaml
// const file = fs.readFileSync('./api-docs-bank_system.yaml', 'utf-8');
// const swaggerDocument = YAML.parse(file);

// // url spi-docs
// app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // use cors swagger
// app.use(cors());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// middleware
app.use(morgan('dev'));
app.use(express.json());

// import authRouter
const authRouter = require('./routes/auth.routes');

app.use('/api/v1/', authRouter);

app.get('/', (req, res) => {
  console.log('name');
  return res.json({
    status: true,
    message: 'hello world',
    error: null,
    data: null
  })
})


// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// 404 error handling
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Not Found",
    data: null,
  });
});

// 500 error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: "Internal Server Error",
    data: err.message
  });
});

// running port 3000
app.listen(PORT, () => console.log(`Server ON : http://localhost:${PORT}`));