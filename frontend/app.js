const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { createSessionMiddleware, attachSessionLocals } = require('./middleware/sessionManager');
const { attachI18n, setLanguage } = require('./middleware/i18n');

const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(createSessionMiddleware());
app.use(attachSessionLocals);
app.use(attachI18n);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/set-language/:lang', setLanguage);

app.use('/', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
