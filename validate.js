const fs = require('fs')
var x = require('libxmljs')
var SaxonJS = require('saxon-js')

try {
  const xml = fs.readFileSync('public/basicResponse.xml', 'utf8')
  const xsd1 = fs.readFileSync('public/common.xsd', 'utf8')
  const xsd2 = fs.readFileSync('public/carrier.xsd', 'utf8')

  var xsdDoc1 = x.parseXmlString(xsd1);
  var xsdDoc2 = x.parseXmlString(xsd2)
  var xmlDoc = x.parseXmlString(xml);

  var result = xmlDoc.validate(xsdDoc1, xsdDoc2);
  console.log("result:", result);

} catch (err) {
  console.error(err)
}

SaxonJS.transform({
    stylesheetFileName: "public/commonToQuestion.sef.json",
    sourceFileName: "public/basicResponse-afterInjection.xml",
    destination: "serialized"
}, "async")
.then (output => {
    console.log(output.principalResult)
})
.catch(error => {
    console.log(error)
})

SaxonJS.getResource({
    file: "public/basicResponse-afterInjection.xml",
    type: "xml"
}).then(doc => {
    const result = SaxonJS.XPath.evaluate("//Question/text()", doc, { xpathDefaultNamespace : 'http://www.carrier.com' });
    for( i= 0; i< result.length; i++ ) {
    
        console.log("Additional question from the carrier: ", result[i].data.trim())
    }
    
    // const output = SaxonJS.serialize(result, {method: "xml", indent: true});
    // console.log(output);
})
.catch(error => {
    console.log(error)
})