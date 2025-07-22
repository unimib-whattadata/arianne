import type { JsonObject } from '@prisma/client/runtime/library';

import { INSTRUCTIONS, QUESTIONS } from './questions';

const risposte =  [ `Per nulla`,
                    `Solo occasionalmente`,
                    `Ogni tanto`,
                    `Spesso`,
                    `Molto spesso o sempre`];

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
                          <th style="width:45;"><p>#</p></th>
                          <th style="width:500;"><p>Item</p></th>
                          <th style="width:150;"><p>Risposta</p></th>
                        </tr>
                      </thead>
                      <tbody>`;

  // Creazione riga per ogni domanda del questionario
  for(let i = 1; i <= 34; i++)
  {
    let risposta = parseInt(response[`item-`+i] as string);

    if(QUESTIONS[i-1].reverse)
    {
      risposta = 4 - risposta; 
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
export function generateScoresHTML(records: JsonObject, sex: string): string
{
  const scoreJSON = records.score as JsonObject;


  // parseFloat(media.toFixed(2))

  const riskScore = scoreJSON.riskScore as number;
  const symptomsScore = scoreJSON.symptomsScore as number;
  const operationScore = scoreJSON.operationScore as number;
  const subjectiveScore = scoreJSON.subjectiveScore as number;

  //Punteggio  Totale
  const totalResponsesScore =
    symptomsScore * 12 +
    subjectiveScore * 4 +
    operationScore * 12 +
    riskScore * 6;

  //Punteggio  di non rischio
  const nonRiskScore =
    (totalResponsesScore - riskScore * 6) / 28;

  //Punteggio Medio
  const avgScore = totalResponsesScore / 34;

  
  const html = `
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
                      <th style="width:250;"><p>Scala</p></th>
                      <th style="width:250;"><p>Punteggio</p></th>
                      <th style="width:250;"><p>Cut-off</p></th>
                    </tr>` +
  
                    // Sottointestazione tabella
                   `<tr class="table_subheader">
                      <th><p>Media totale</p></th>
                      <th><p>` + parseFloat(avgScore.toFixed(2)) + `/4</p></th>
                      <th><p>` + (sex === `M` ? `1.09` : `1.2`) + `</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
  
                    // Punteggi
                   `<tr>
                      <td><p>Benessere soggettivo</p></td>
                      <td><p>` + parseFloat(subjectiveScore.toFixed(2)) + `/4</p></td>
                      <td><p>` + (sex === `M` ? `1.4` : `1.84`) + `</p></td>
                    </tr>

                    <tr>
                      <td><p>Funzionamento</p></td>
                      <td><p>` + parseFloat(operationScore.toFixed(2)) + `/4</p></td>
                      <td><p>` + (sex === `M` ? `1.29` : `1.3`) + `</p></td>
                    </tr>

                    <tr>
                      <td><p>Sintomi</p></td>
                      <td><p>` + parseFloat(symptomsScore.toFixed(2)) + `/4</p></td>
                      <td><p>` + (sex === `M` ? `1.3` : `1.43`) + `</p></td>
                    </tr>

                    <tr>
                      <td><p>Rischio</p></td>
                      <td><p>` + parseFloat(riskScore.toFixed(2)) + `/4</p></td>
                      <td><p>` + (sex === `M` ? `0.25` : `0.22`) + `</p></td>
                    </tr>

                    <tr>
                      <td><p>Non rischio</p></td>
                      <td><p>` + parseFloat(nonRiskScore.toFixed(2)) + `/4</p></td>
                      <td><p>` + (sex === `M` ? `1.27` : `1.42`) + `</p></td>
                    </tr>

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
  for(let i = 1; i <= 34; i++)
  {
    csv +=  (i) + (QUESTIONS[i-1].reverse ? ` (R)` : ``) + `,"` +   // #
            QUESTIONS[i-1].text + `",` +                            // Item
            (response[`item-`+i] as string) + `\n`;                 // Risposta
  }
  
  return csv;
}