<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:InsuranceCommon="http://www.InsuranceCommon.org/"
  xmlns:Carrier="http://www.carrier.com"
>
<xsl:output method="xml"/>
<xsl:template match="/InsuranceCommon:BopPolicyResponse">

  <xsl:copy-of select="Carrier:AdditionalQuestions"/>
</xsl:template>
</xsl:stylesheet>