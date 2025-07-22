import type { JsonObject } from '@prisma/client/runtime/library';

import { INSTRUCTIONS, QUESTIONS } from './questions';

const risposte =  [ `Per nulla d'accordo`,
                    `Un poco d'accordo`,
                    `Abbastanza d'accordo`,
                    `Molto d'accordo`,
                    `Completamente d'accordo` ];

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
                      <th style="width:200;"><p>Risposta</p></th>
                    </tr>
                  </thead>
                  <tbody>`;

  // Creazione riga per ogni domanda del questionario
  for(let i = 1; i <= 16; i++)
  {
    let risposta = parseInt(response[`item-`+i] as string);

    if(QUESTIONS[i-1].reverse)
    {
      risposta = 6 - risposta;
    }

    html += `<tr>
               <td>` + (i) + (QUESTIONS[i-1].reverse ? ". (R)" : ".") +`</td>` +  // #
              `<td>` + QUESTIONS[i-1].text + `</td>` +                            // Item
              `<td>` + risposte[risposta-1] + `</td>` +                           // Risposta
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
  const score = records.score as number;

  let mean, ds;
  if(sex === 'M')
  {
    mean = 27.7;
    ds = 10.6;
  }
  else
  {
    mean = 34.4;
    ds = 11.3;
  }
  
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
                      <th style="width:800;" colspan="4"><p>Punteggio</p></th>
                    </tr>` +
  
                    // Sottointestazione tabella
                   `<tr class="table_subheader">
                      <th style="width:25%;"><p>Valore</p></th>
                      <th style="width:25%;"><p>Media</p></th>
                      <th style="width:25%;"><p>Deviazione standard</p></th>
                      <th style="width:25%;"><p>Livello</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
  
                    // Punteggi
                   `<tr>
                      <td>` + score + `/80</td>
                      <td>` + mean + `</td>
                      <td>` + ds + `</td>
                      <td>` + (score < (mean-ds) ? `Minore della norma` : (score > (mean+ds) ? `Maggiore della norma` : `Nella norma`)) + `</td>
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
  for(let i = 1; i <= 16; i++)
  {
    csv +=  (i) + (QUESTIONS[i-1].reverse ? " (R)" : "") + `,"` + // #
            QUESTIONS[i-1].text + `",` +                          // Item
            (response[`item-`+i] as string) + `\n`;               // Risposta
  }
  
  return csv;
}