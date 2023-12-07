const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const handlebars = require('express-handlebars');
const route = require('./routes')
const db = require('./config/db')
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const morgan = require('morgan')
var cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({ extended: true ,limit: '50mb'}));
app.use(bodyParser.json({ limit: '50mb' }));
const striptags = require('striptags');
//template
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => a + b,
    truncateDescription: function (description) {
      if (description.length > 0) {
        return striptags(description.substring(0, 150) + '...');
      }
      return description;
    },
    truncateDescriptionSearch: function (description) {
      if (description.length > 0) {
        return striptags(description.substring(0, 500) + '...');
      }
      return description;
    },
  }
}));

//cookies
app.use(cookieParser())

//change method
app.use(methodOverride('_method'))

app.use(express.urlencoded({
  extended: true, limit: '50mb'
}))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources\\views'));

//morgan console log
app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'))
route(app)
db.connect();
app.listen(port, () => {
  console.log(`Example app listening on port  http://localhost:${port}`)
})