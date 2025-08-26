


export default function TermsAndConditions() {
  return (
    <div className="min-h-screen w-[90%] mx-auto bg-white">
      <header className="border-b">
        <div className="mx-auto  px-4 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-primary">General Terms and Conditions of Supply</h1>
        </div>
      </header>

      <main className="mx-auto  px-4 py-8">
        {/* Quick nav */}
        {/* <nav className="mb-8 rounded-xl border bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-primary">Sections</h2>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3 text-sm">
            {Array.from({ length: 20 }).map((_, i) => (
              <li key={i}>
                <a className="hover:underline" href={`#s${i + 1}`}>
                  {i + 1}. {[
                    "Introduction",
                    "Prohibition of transfer and sub-contracting",
                    "Order confirmation",
                    "Confidentiality and Intellectual Property",
                    "Deliveries",
                    "Packing and identification of the products",
                    "WattMatrix equipment and material sent for processing",
                    "Management of modifications to products, goods and services",
                    "Warranty",
                    "Supplier responsibility",
                    "Express termination clause",
                    "Inspection visits",
                    "Prices",
                    "Payment and invoicing",
                    "Applicable law and Jurisdiction",
                    "Validity",
                    "Prohibition of the advertising, use or reproduction of the WattMatrix brand",
                    "Health and Safety of workers involved in the production process",
                    "ISO 9001, REACH, CLP and ROHS Regulations",
                    "Environmental protection",
                  ][i]}
                </a>
              </li>
            ))}
          </ol>
        </nav> */}

        {/* 1 */}
        <section id="s1" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">1. Introduction</h2>
          <p className="mt-3 text-gray-800">
            These General Terms and Conditions of Supply (hereinafter referred to as “GTS”) are applicable to all Supplies (e.g. purchase contracts, contracting of goods and/or services, etc.) provided to WattMatrix S.p.A. (hereinafter referred to as “WattMatrix”) save for exceptions specifically agreed in writing, and govern relationships between WattMatrix and its Suppliers, forming part of the order that WattMatrix sends to the Supplier, and lead to the non-application of the general terms and conditions of the Supplier. Therefore, any clauses inserted by the Supplier in their confirmations, invoices and correspondence, whether in contrary or additional to the present GTS, are to be considered as non-applicable unless otherwise expressly and exceptionally accepted in writing by WattMatrix.
          </p>
          <p className="mt-3 text-gray-800">
            These GTS have been announced and fully accepted following publication of the same on the WattMatrix corporate website (https://www.wattmatrix.io/, section Download), from where they can be freely accessed and consulted. Specific wording in reference to these GTS is to be found at the foot of each Purchase Order sent by WattMatrix, and acceptance of the same by compliant Suppliers is required at the end of the registration procedure for the WattMatrix Supplier Portal.
          </p>
        </section>

        {/* 2 */}
        <section id="s2" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">2. Prohibition of transfer and sub-contracting</h2>
          <p className="mt-3 text-gray-800">
            The Supplier cannot in any case or even partially transfer to third parties the rights deriving from supply relationships. The Supplier is always obliged to inform WattMatrix and to obtain prior written authorisation in the event that it intends to sub-contract the supply of goods or services. Any authorisation obtained for the sub-contracting of supply does not exempt the Supplier from its contractual obligations and responsibilities. The Supplier will answer in full for the work and personnel of sub-contractors as well as their own. WattMatrix will remain completely removed from said relationship.
          </p>
        </section>

        {/* 3 */}
        <section id="s3" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">3. Order confirmation</h2>
          <p className="mt-3 text-gray-800">
            Any Suppliers receiving an order for the supply of products/services is obliged to send an Order Confirmation via email as acceptance within three working days from the date of receipt of the same.
          </p>
        </section>

        {/* 4 */}
        <section id="s4" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">4. Confidentiality and Intellectual Property</h2>
          <p className="mt-3 text-gray-800">
            Technical and technological information as well as any samples sent to the Supplier, and the relative intellectual property, remain the exclusive property of WattMatrix, which reserves the right to request the return of the same at any moment. The Supplier is forbidden from reproducing or copying said information or property and to not distribute or reveal the content to third parties, and in general is obliged to maintain the utmost confidentiality regarding all the information to which it becomes aware of in relation to the supply relationship.
          </p>
          <p className="mt-3 text-gray-800">
            The Supplier assumes responsibility for ensuring that all its employees, collaborators and suppliers in turn maintain the utmost confidentiality regarding the aforementioned documentation. The Supplier recognises as illicit and illegitimate the fabrication and sale of products constructed on the basis of equipment, machinery, drawings, models or samples belonging to WattMatrix either for purposes of production or spare parts of any kind, or for any other purpose, if carried out beyond the confines of the supply activities set out in this contract.
          </p>
        </section>

        {/* 5 */}
        <section id="s5" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">5. Deliveries</h2>
          <p className="mt-3 text-gray-800">
            The delivery of the products, goods or services relative to the agreed supply must be carried out in compliance with the indications in the order or confirmed in the Order Confirmation. The Supply undertakes in any case to do all that is necessary in order to promptly fulfil the entire delivery schedule.
          </p>
          <p className="mt-3 text-gray-800">
            In the event of possible delays, the Supplier must always promptly inform the WattMatrix Procurement Department in writing, indicating the products subject to delay, the relative causes and the new forecast date of delivery. In certain cases, WattMatrix reserves the right to apply a penalty to the Supplier in accordance with other specific agreements between the parties.
          </p>
        </section>

        {/* 6 */}
        <section id="s6" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">6. Packing and identification of the products</h2>
          <p className="mt-3 text-gray-800">
            In the absence of particular instructions in the contractual documentation, the conditions regarding protection and packing must be such that the products or goods to be supplied are not subject to damage during transportation and can be stored without deterioration, in normal warehouse conditions, for a period of at least 12 months.
          </p>
          <p className="mt-3 text-gray-800">
            When specifically provided for, the Supplier undertakes to deliver the products with suitable identification via dedicated labelling containing the product code as well as the production batch number.
          </p>
        </section>

        {/* 7 */}
        <section id="s7" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">7. WattMatrix equipment and material sent for processing</h2>
          <p className="mt-3 text-gray-800">
            Any equipment or other goods that WattMatrix loans to the Supplier for use remain the exclusive property of WattMatrix. The Supplier takes responsibility for any loss or destruction of, or damage to, the same. The Supplier undertakes:
          </p>
          <ul className="mt-3 ml-6 list-disc text-gray-800">
            <li>to keep and maintain them in perfect working condition;</li>
            <li>not to carry out any modifications that are not agreed with WattMatrix;</li>
            <li>to use them exclusively for the fulfilment of orders from WattMatrix;</li>
            <li>not to transfer them to third parties for any reason.</li>
          </ul>
          <p className="mt-3 text-gray-800">
            In the event of a breach of this obligation, WattMatrix will have the right to ask the Supplier for payment of damages suffered for a sum no lower than the value of the equipment tampered with or modified. WattMatrix’s ownership of said equipment does not exonerate the Supplier from the responsibility to obtain a product/service in line with the drawings and technical specifications provided.
          </p>
          <p className="mt-3 text-gray-800">
            The Supplier is, in any case, obliged to communicate any anomalies detected regarding the equipment and goods supplied.
          </p>
        </section>

        {/* 8 */}
        <section id="s8" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">8. Management of modifications to products, goods and services</h2>
          <p className="mt-3 text-gray-800">
            On specific request from WattMatrix, the Supplier undertakes to make modifications, including partial modifications, to the characteristics of the product, good or service, while maintaining the original date of delivery. Any variations in cost or date of delivery caused by the modification introduced must be communicated to and agreed with WattMatrix’s Procurement Department.
          </p>
        </section>

        {/* 9 */}
        <section id="s9" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">9. Warranty</h2>
          <p className="mt-3 text-gray-800">
            The Supplier warrants that the products, goods or services supplied are compliant with the documentation and/or technical specifications provided by WattMatrix, and free of all apparent and/or non-apparent nonconformities, faults and defects. Said warranty will have a duration of 24 months from the date of delivery or provision of service. In the event that the product, good or service proves to be defective either before or after its use and/or introduction onto the market during the period of validity of the warranty, WattMatrix may, after having provided the Supplier with prior notice, request the repair and/or substitution of the product or good in question. Substitutions or repairs under warranty must be carried out at no cost whatsoever.
          </p>
        </section>

        {/* 10 */}
        <section id="s10" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">10. Supplier responsibility</h2>
          <p className="mt-3 text-gray-800">
            In accepting these GTS, the Supplier assumes full responsibility for the fulfilment of the supply and for any damaged deriving from defects in products, goods or services. The Supplier is responsible for nonconformities, non-apparent faults in the product, good or service supplied, whether present at the moment of delivery or emerging at a later date within the warranty period.
          </p>
        </section>

        {/* 11 */}
        <section id="s11" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">11. Express termination clause</h2>
          <p className="mt-3 text-gray-800">
            All contractual relationships between WattMatrix and the Supplier may be legally terminated pursuant to article 1456 of the Civil Code with written notice of 6 months declaring the intent to apply this express termination clause in the event of repeated delays in delivery and/or noncompliance with the agreed level of quality.
          </p>
          <p className="mt-3 text-gray-800">
            Any contractual relationship between the parties is to be considered automatically terminated, pursuant to article 1353 of the Civil Code in the event of the institution of proceedings for bankruptcy, liquidation (including extra-judicial liquidation), agreements with creditors, court receivership, administration or any other procedure that nullifies the solvency or reliability of the Supplier. Said termination clause is intended as in the interests of WattMatrix, which has the right to waive the clause within 15 days of applicability by providing written notice to the Supplier.
          </p>
        </section>

        {/* 12 */}
        <section id="s12" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">12. Inspection visits</h2>
          <p className="mt-3 text-gray-800">
            The Supplier undertakes to allow WattMatrix personnel access to its plants at any moment during working hours on suitable notice in order to carry out inspection visits. These visits are in order to assess the technical/organisational and production capabilities of the Supplier in respect of the orders and obligations assumed.
          </p>
          <p className="mt-3 text-gray-800">
            The Supplier must be willing to provide WattMatrix personnel technical and technological documentation defining the production process (e.g. reliability of equipment, verifications carried out, monitoring programmes, quality levels, corrective actions applied, etc.) with the exception of that concerning industrial secrets and know-how.
          </p>
        </section>

        {/* 13 */}
        <section id="s13" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">13. Prices</h2>
          <p className="mt-3 text-gray-800">
            The prices indicated in the order or on price lists are fixed and have a standard validity of one year. Automatic variations based on successive increases in costs are therefore excluded, unless otherwise agreed between the parties.
          </p>
        </section>

        {/* 14 */}
        <section id="s14" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">14. Payment and invoicing</h2>
          <p className="mt-3 text-gray-800">
            In return for the products and goods delivered and/or services provided by the Supplier in compliance with the Contract, WattMatrix will pay the Supplier the purchase price indicated in the Contract on condition that the relative invoice complies with the requirements set out by WattMatrix. The price is inclusive of all taxes and duties (other than VAT or equivalent) and all costs relating to production, manufacturing, warehousing and packing (including the restitution of all returnable packing) for any goods or services. WattMatrix will pay the invoice in accordance with the payment terms and conditions agreed with the Supplier.
          </p>
        </section>

        {/* 15 */}
        <section id="s15" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">15. Applicable law and Jurisdiction</h2>
          <p className="mt-3 text-gray-800">
            These Terms and Conditions of Supply are governed by Italian law. Any disputes regarding the execution, interpretation, validity, termination and cessation of this contract and supply relationships existing between the parties will be the competence of the Bergamo court.
          </p>
        </section>

        {/* 16 */}
        <section id="s16" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">16. Validity</h2>
          <p className="mt-3 text-gray-800">
            These GTS will be applicable as of the date of publication on the WattMatrix website (4th of November 2020) and will be valid for a period of 5 (five) years. These GTS will in any case be considered as accepted following the fulfilment of WattMatrix purchase orders issued after the publication of these Terms and Conditions of Supply as well as a consequence of registration on the WattMatrix Supplier Portal. Special clauses agreed with the Supplier in partial modification and/or integration to the General Terms and Conditions in this contract must be confirmed in writing and signed by both parties in order to be considered valid.
          </p>
        </section>

        {/* 17 */}
        <section id="s17" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">17. Prohibition of the advertising, use or reproduction of the WattMatrix brand</h2>
          <p className="mt-3 text-gray-800">
            The Supplier must ask for prior express written permission from WattMatrix for any advertising or commercial information that makes reference to commercial relationships with WattMatrix.
          </p>
          <p className="mt-3 text-gray-800">
            The same written authorisation is required for any use, publication or reproduction of the WattMatrix brand.
          </p>
        </section>

        {/* 18 */}
        <section id="s18" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">18. Health and Safety of workers involved in the production process</h2>
          <p className="mt-3 text-gray-800">
            The Supplier undertakes to manage its production processes in full respect of mandatory regulations regarding protection of the environment (e.g. Italian Legislative Decree 152 of 2006 and successive modifications and integrations) and the protection of worker health and safety (e.g. Italian Legislative Decree 81 of 2008 and successive modifications and integrations).
          </p>
        </section>

        {/* 19 */}
        <section id="s19" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">19. ISO 9001, REACH, CLP and ROHS Regulations</h2>
          <p className="mt-3 text-gray-800">
            The Supplier declares under its own responsibility and in full awareness of legal consequences and obligations that the goods supplied are produced in compliance with Regulation UNI EN ISO 9001, Regulation (EU) n. 1907/2006 (REACH), Regulation (EU) n. 2172/2008 (CLP) and directive 2011/65/EU (ROHS), as well as their successive modifications and integrations.
          </p>
        </section>

        {/* 20 */}
        <section id="s20" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-primary">20. Environmental protection</h2>
          <p className="mt-3 text-gray-800">
            WattMatrix assumes responsibility for providing the Supplier with appropriate advance warning in the event that the latter is provided with loaned machinery that emits airborne chemical substances. The Supplier is responsible for the correct conveyance of said emissions in compliance with legal limitations (Italian Legislative Decree n. 152/2006 and successive modifications and integrations).
          </p>
          <p className="mt-3 text-gray-800">
            The Supplier is also responsible for the recovery or disposal of all waste resulting from the processing carried out by the machinery. In this case, WattMatrix will provide the Supplier with adequate information regarding the type of waste that may be generated by the relative processes, in order to allow for it to be correctly recovered or disposed of.
          </p>
        </section>

        <footer className="mt-12 border-t pt-6 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} WattMatrix S.p.A. — These Terms are provided for implementation on a website page. This is not legal advice.
          </p>
        </footer>
      </main>
    </div>
  );
}
