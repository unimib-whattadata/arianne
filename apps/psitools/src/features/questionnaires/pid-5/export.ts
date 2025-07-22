import type { JsonObject } from '@prisma/client/runtime/library';

import { INSTRUCTIONS, QUESTIONS } from './questions';
import DOMAIN_MAP from './settings';

const risposte =  [ `Sempre o spesso falso`,
                    `Talvolta o abbastanza falso`,
                    `Talvolta o abbastanza vero`,
                    `Sempre o spesso vero` ];

// Funzione richiamata da export_pdf.ts per generare il contenuto HTML del questionario
export function generateResponsesHTML(records: JsonObject): string
{
  const response = records.response as JsonObject;

  let html = `
          <div id="administration">
            <table>
              <thead>
                <tr>
                  <th style="text-align: left;">` +
      
                    // Titolo sezione ("Risposte")
                   `<p class="section_title">Risposte</p>
      
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>` +
      
                    // Istruzioni
                   `<div id="istruzioni">
                      <p>
                        <p class="bold" style="font-style: italic;">Istruzioni</p>
                        : ` + INSTRUCTIONS + `
                        <p>La dicitura (R) nel numero della domanda indica che il punteggio per tale domanda è invertito.</p>
                      </p>
                    </div>` + `
                          
                    <table class="risposte">
                      <thead>` +
      
                        // Intestazione tabella risposte
                       `<tr class="table_header">
                          <th style="width:55;"><p>#</p></th>
                          <th style="width:470;"><p>Item</p></th>
                          <th style="width:240;"><p>Risposta</p></th>
                        </tr>
                      </thead>
                      <tbody>`;

  // Creazione riga per ogni domanda del questionario
  for(let i = 1; i <= 220; i++)
  {
    let risposta = parseInt(response[`item-`+i] as string);

    if(QUESTIONS[i-1].reverse)
    {
      risposta = 3 - risposta; 
    }

    html +=  `<tr>
                <td>` + (i) + (QUESTIONS[i-1].reverse ? `. (R)` : `.`) + `</td>` +  // #
               `<td>` + QUESTIONS[i-1].text + `</td>` +                             // Item
               `<td>` + risposte[risposta] + `</td>` +                              // Risposta
             `</tr>`;
  }

  // Chiusure tabelle e div
  html += `
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`;

  return html;
}

// Funzione richiamata da export_pdf.ts per generare il contenuto HTML dei risultati
export function generateScoresHTML(records: JsonObject): string
{
  const response = records.response as JsonObject;

  const specialDomains =
  [
    { key:'affettivita', name:'Affettività negativa'},
    { key:'distacco', name:'Distacco'},
    { key:'antagonismo', name:'Antagonismo'},
    { key:'disinibizione', name:'Disinibizione'},
    { key:'psicoticismo', name:'Psicoticismo'},
    { key:'altro', name:'Altro'}
  ]

  let html = `

      <div id="scores">
        <table>
          <thead>
            <tr>
              <th style="text-align: left;">` +
  
                // Titolo sezione ("Risultati")
                `<p class="section_title">Risultati</p>
  
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <table class="risultati">
                  <thead>` +
  
                    // Intestazione tabella
                   `<tr class="table_header">
                      <th style="width:350;"><p>Dominio</p></th>
                      <th style="width:200;"><p>Media</p></th>
                      <th style="width:200;"><p>Punteggio grezzo</p></th>
                    </tr>

                  </thead>
                  <tbody>`;

  // PER OGNI DOMINIO SPECIALE
  for (const specialDomain of specialDomains)
  {
    const domainsResults = [] as { label: string, scoresSum: number, questionsCount: number }[];

    // PER OGNI SINGOLO DOMINIO
    DOMAIN_MAP[specialDomain.key].forEach((domain) =>
    {
      let scoresSum = 0;

      // PER OGNI DOMANDA DEL SINGOLO DOMINIO
      for (const id of domain.id)
      {
        scoresSum += parseInt(response[`item-`+id] as string);
      }

      domainsResults.push({
        label: domain.label,
        scoresSum: scoresSum,
        questionsCount: domain.id.length,
      })
    });

    const totalScore = domainsResults.reduce((acc, domain) => acc + domain.scoresSum, 0);
    const totalQuestionsCount = domainsResults.reduce((acc, domain) => acc + domain.questionsCount, 0);
    const totalAverage = totalScore / totalQuestionsCount;
    const totalAverageRounded = parseFloat(totalAverage.toFixed(2));

    html +=  `<tr class="table_subheader">
                <th style="width:345;"><p>` + specialDomain.name + ` (totale)</p></th>
                <th style="width:200;"><p>` + totalAverageRounded + `</p></th>
                <th style="width:200;"><p>` + totalScore + `</p></th>
              </tr>`;

    for (const domain of domainsResults)
    {
      const media = domain.scoresSum / domain.questionsCount;
      const mediaArrotondata = parseFloat(media.toFixed(2));

      html +=  `<tr>
                  <td><p>` + domain.label + `</p></td>
                  <td><p>` + mediaArrotondata + `</p></td>
                  <td><p>` + domain.scoresSum + `</p></td>
                </tr>`;
    }
  }
  
  html += `
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>`;

  return html;
}

// Funzione richiamata da export_csv.ts per generare il contenuto CSV del questionario
export function generateCSV(records: JsonObject): string
{
  const response = records.response as JsonObject;

  // Header CSV
  let csv =  `#,Item,Risposta\n`;

  // Creazione riga per ogni domanda del questionario
  for(let i = 1; i <= 220; i++)
  {
    csv +=  (i) + (QUESTIONS[i-1].reverse ? ` (R)` : ``) + `,"` + // #
            QUESTIONS[i-1].text + `",` +                          // Item
            (response[`item-`+i] as string) + `\n`;               // Risposta
  }
  
  return csv;
}