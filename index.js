var x = require('libxmljs')
const fs = require('fs')

var express = require('express');
var app = express();
var port = 3000;

app.use(express.static('public'))

app.set('view engine', 'pug');

app.get('/', function(req, res){
    res.render('index');
});

app.get('/license/:number', async function (req, res) {
    try {
        const license = await getLicnese(req.params.number)
        res.setHeader('content-type', 'text/xml');
        res.send(license)
    }
    catch (err) {
        res.status(404)
        res.send(err)
    }
})

function getLicnese(number) {
    return new Promise( (resolve, reject) => {
        if(number == "5555") {
            try {
                fs.readFile('public/license.xml', 'utf-8', (err, data) => { 
                    if (err) throw err; 
                    console.log(data); 
                    resolve(data)
                })
            }
            catch (error) {
                console.log(error)
                reject(error)
            }
        } else {
            reject ("License not found.")
        }
    })
}

app.get('/quote/:sic', function (req, res) {
    getQuoteForSic(req.params.sic)
    .then(result => {
        res.setHeader('content-type', 'text/xml');
        res.send(result)
    })
    .catch(error => { 
        res.status(404)
        res.send(error)
    })
})

function getQuoteForSic(sic) {
    return new Promise((resolve, reject) => {
        if(sic == "07839901") {
            try {
                fs.readFile('public/basicResponse.xml', 'utf-8', (err, data) => { 
                    if (err) throw err; 
                    console.log(data); 
                    resolve(data)
                })
            }
            catch (error) {
                console.log(error)
                reject(error)
            }
            
         } else {
            reject("We can't insure that SIC code");
         }
       
    });
  }



app.listen(port, () => console.log(`App listening on port ${port}`))