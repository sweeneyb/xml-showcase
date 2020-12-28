var express = require('express');
var app = express();
var port = 3000;

app.use(express.static('public'))

app.set('view engine', 'pug');

app.get('/', function(req, res){
    res.render('index');
});

app.listen(port, () => console.log(`App listening on port ${port}`))