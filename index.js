var libxmljs = require('libxmljs')
const fs = require('fs')
const fetch = require('node-fetch');

var express = require('express');
var app = express();
var port = 3000;

app.use(express.static('public'))

// This mimics a state-run service that response with license XMLs

// curl -i http://localhost:3000/license/5555
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
                    // console.log(data); 
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

async function getLicense(number) {
    try {
        var response = await fetch("http://localhost:3000/license/"+number)
        var file = await response.text()
        return file  
    } catch (error) {
        throw error
    }
}

const nameToLicenseNumberService = { 
    data : {
        "A Growth Business" : "5555"
    },
    getByName: function (name) {
        return this.data[name]
    }
}


//This starts the section that mimics an insurance carrier delivering proof of insurance and a license

// curl -i "http://localhost:3000/insurer/getProofOfInsurance/A%20Growth%20Business"
app.get('/insurer/getProofOfInsurance/:businessName', function (req, res) {
    console.log(req.params.businessName)
    fs.readFile('public/basicResponse.xml', 'utf-8', async (err, data) => { 
        if (err) throw err; 
        const baseDoc = libxmljs.parseXmlString(data)

        // setting to true to simulate that we've actually issued the insurance
        var gchild = baseDoc.find("//InsuranceCommon:bound", {InsuranceCommon:"http://www.InsuranceCommon.org/"})
        gchild[0].text("true")

        const licenseNumber = nameToLicenseNumberService.getByName(req.params.businessName)
        const licenseDoc = await getLicense(licenseNumber)
        const licenseDocXml = libxmljs.parseXmlString(licenseDoc)
        baseDoc.root().addChild(licenseDocXml.root())
        console.log(baseDoc.toString())

        res.setHeader('content-type', 'text/xml');
        res.send(baseDoc.toString())    
    })
    
})

// This emulates an insurance quote for a specific business type.

// curl -i "http://localhost:3000/quote/07839901"
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

// Given a type of business, return a quote.  In this case, we're also returning
// some follow up questions that would help give a better price. 

// The questions aren't necessarily something the insurance xml standards body would
// know about.
function getQuoteForSic(sic) {
    return new Promise((resolve, reject) => {
        if(sic == "07839901") {
            try {
                // usually another system would generate this, but we're going to take a template
                fs.readFile('public/basicResponse.xml', 'utf-8', (err, data) => { 
                    if (err) throw err; 
                    console.log(data); 
                    const licenseDocXml = libxmljs.parseXmlString(data)

                    // Add carrier-specific items
                    const root = licenseDocXml.root()
                    var q1 = root.node("Carrier:AdditionalQuestions")
                    q1.defineNamespace("Carrier", "http://www.carrier.com")
                    q1.node("Carrier:Question").text("What is your license identifier?")
                    var q2 = root.node("Carrier:AdditionalQuestions")
                    q2.defineNamespace("Carrier", "http://www.carrier.com")
                    q2.node("Carrier:Question").text("In which state are you licensed?")
                    resolve(licenseDocXml.toString())
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