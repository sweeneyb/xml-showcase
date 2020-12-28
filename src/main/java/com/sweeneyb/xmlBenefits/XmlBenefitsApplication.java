package com.sweeneyb.xmlBenefits;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;
import java.io.*;

@SpringBootApplication
public class XmlBenefitsApplication implements CommandLineRunner {

	private static Logger LOG = LoggerFactory
			.getLogger(XmlBenefitsApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(XmlBenefitsApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		LOG.info("EXECUTING : command line runner");


		SchemaFactory sFactory = SchemaFactory.newInstance(
				XMLConstants.W3C_XML_SCHEMA_NS_URI);
		Schema commonSchema = sFactory.newSchema(new Source[] {
				new StreamSource(new FileReader(new File("public/common.xsd")))
		});
		Schema carrierSchema = sFactory.newSchema(new Source[] {
				new StreamSource(new FileReader(new File("public/carrier.xsd")))
		});



		StreamSource source = new StreamSource(new File("public/basicResponse.xml"));
		Validator validator = commonSchema.newValidator();
//		System.out.println(xml);
		try {
			validator.validate(source);
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		StreamSource stylesource = new StreamSource(new File("public/commonToQuestions.xslt"));

		Transformer transformer = TransformerFactory.newInstance().newTransformer(stylesource);

		StringWriter writer = new StringWriter();
		StreamResult result = new StreamResult(writer);

		transformer.transform(source, result);
		Validator carrierValidator = carrierSchema.newValidator();
		try {
			carrierValidator.validate(new StreamSource(new StringReader(writer.toString())));
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		LOG.info(writer.toString());

		LOG.info("something");
		for (int i = 0; i < args.length; ++i) {
			LOG.info("args[{}]: {}", i, args[i]);
		}
		System.exit(0);
	}

}
