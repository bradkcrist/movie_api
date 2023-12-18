const express = require('express');
morgan = require('morgan');
(fs = require('fs')), (path = require('path'));

const app = express();

app.get('/myMovie_APi', (req, res) => {
  res.send('My Top 10 Movies!');
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.use(express.static('public'));

const bodyParser = require('body-parser'),
  methodOverride = require('method-override');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Code broke!');
});

app.listen(8080);
console.log('Your app is running on Port 8080.');
