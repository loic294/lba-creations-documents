import React from "react"
import { RichText } from 'prismic-reactjs'
import Layout from "../components/layout"
import SEO from "../components/seo"

import s from "./document.module.scss"
 
const Page = props => {
  const doc = props.data.prismic.document;
  if(!doc) return null;

  let aTotal = 0;
  let hTotal = 0;

  doc.services.forEach(service => {
    aTotal += service.hours * service.rate
    hTotal += service.hours
  })

  
  return (
    <>
      <Layout>
        <SEO title={`Soumission - ${RichText.asText(doc.client.name)}`} />
        <header className={s.header}>
          <div className={s.container}>
            <nav className={s.nav}>
              <div>
                <a href="https://lbacreations.com" className={s.siteName}>LBA Créations</a>
              </div>
            </nav>
            <h1>{doc.type == "soumission" ? "Soumission" : "Facture"}</h1>
          </div>
        </header>
        <section>
          <div className={s.container}>
            <div className={s.document}>
              <b>Description</b>
              <p>{RichText.render(doc.desc)}</p>

              <div className={s.split}>
                <div className={s.w50}>
                  <p>
                    <b>Client</b> <br/>
                    {RichText.asText(doc.client.name)} <br/>
                    <i>{RichText.asText(doc.client.address)} <br/>
                    {RichText.asText(doc.client.city)} {RichText.asText(doc.client.province)} <br/>
                    {RichText.asText(doc.client.country)} {RichText.asText(doc.client.postalCode)} </i>
                  </p>
                </div>
                <div className={s.w50}>
                  <p>
                    <b>Développeur</b> <br/>
                    Loïc Bellemare-Alford <br/>
                    <i>369 Prince Albert <br/>
                    Westmount Québec <br/>
                    Canada H3Z 2N9 </i>
                  </p>
                </div>
              </div>

              <b>Services</b>

              <div className={s.tasks}>
                <div className={`${s.split} ${s.head}`}>
                  <div className={s.desc1}>Description</div>
                  <div className={s.hours}>Heures</div>
                  <div className={s.rate}>Taux</div>
                  <div className={s.total}>Total</div>
                </div>
                {doc.services.map((service, i) => (<div className={`${s.split} ${s.row}`} key={i}>
                  <div className={s.desc1}><small>{RichText.render(service.desc1)}</small></div>
                  <div className={s.hours}>{service.hide_rate === "false" ? `${service.hours}h` : '-'}</div>
                  <div className={s.rate}>{service.rate}$</div>
                  <div className={s.total}>{service.hours * service.rate}$</div>
                </div>))}

                {doc.precedentPayment && <>
                  <div className={`${s.split} ${s.totals}`}>
                    <div className={s.desc1}>Total</div>
                    <div className={s.hours}></div>
                    <div className={s.rate}></div>
                    <div className={s.total}>{aTotal}$</div>
                  </div>
                  <div className={`${s.split} ${s.totals}`}>
                    <div className={s.desc1}>Paiement(s) précédent(s)</div>
                    <div className={s.hours}></div>
                    <div className={s.rate}></div>
                    <div className={s.total}>{doc.precedentPayment}$</div>
                  </div>
                </>}

                {doc.type === "facture" && <>
                  <div className={`${s.split} ${s.totals}`}>
                    <div className={s.desc1}>Premier paiement</div>
                    <div className={s.hours}></div>
                    <div className={s.rate}>{doc.pourcentage}%</div>
                    <div className={s.total}>{Math.round(aTotal * (doc.pourcentage / 100))}$</div>
                  </div>
                  <div className={`${s.split} ${s.totals}`}>
                    <div className={s.desc1}>Deuxième paiement</div>
                    <div className={s.hours}></div>
                    <div className={s.rate}>{100-doc.pourcentage}%</div>
                    <div className={s.total}>{aTotal - Math.round(aTotal * (doc.pourcentage / 100))}$</div>
                  </div>
                </>}
                <div className={`${s.split} ${s.totals}`}>
                  <div className={s.desc1}>Total à payer</div>
                  <div className={s.hours}></div>
                  <div className={s.rate}></div>
                  <div className={s.total}>{aTotal - (doc.precedentPayment || 0)}$</div>
                </div>
              </div>

              <b>Conditions de paiements</b>
              <small>{RichText.render(doc.paymentTerms)}</small>

              {doc.type === "soumission" && <>
                <b>Conditions du contrat</b>
                <small>{RichText.render(doc.terms)}</small>
              </>}
              

            </div>
          </div>
        </section>
      </Layout>
     
    </>
    
  );
}
 
export const query = graphql`
  query PageQuery($uid: String!) {
    prismic {
      document(uid: $uid, lang: "fr-ca") {
        documentNumber
        desc
        type
        paymentTerms
        terms
        pourcentage
        precedentPayment
        services {
          desc1
          hours
          rate
          hide_rate
        }
        client {
          _linkType
          __typename
          ... on PRISMIC_Client {
            name
            address
            city
            country
            postalCode
            province
            phone_number
          }
        }
        _meta {
          uid
          lastPublicationDate
          tags
          id
          lang
        }
      }
    }
  }
`

export default Page;