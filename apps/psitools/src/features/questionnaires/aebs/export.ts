import type { JsonObject } from '@prisma/client/runtime/library';

import { INSTRUCTIONS, QUESTIONS } from './questions';

const risposte1 = [ `Mai/Quasi mai`,
                    `Qualche volta`,
                    `Metà delle volte`,
                    `Il più delle volte`,
                    `Quasi sempre/Sempre`];
                
const risposte2 = [ `Fortemente in disaccordo`,
                    `In disaccordo`,
                    `Né in accordo, né in disaccordo`,
                    `In accordo`,
                    `Fortemente in accordo`];

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
                            <th style="width:210;"><p>Risposta</p></th>
                          </tr>
                        </thead>
                        <tbody>`;

  // Creazione riga per ogni domanda della prima parte del questionario
  for(let i = 1; i <= 9; i++)
  {
    let risposta = parseInt(response[`item-`+i] as string);

    if(QUESTIONS[i-1].reverse)
    {
      risposta = 6 - risposta;
    }

    html +=  `<tr>
                <td>` + (i) + (QUESTIONS[i-1].reverse ? `. (R)` : `.`) + `</td>` +  // #
               `<td>` + QUESTIONS[i-1].text + `</td>` +                             // Item
               `<td>` + risposte1[risposta-1] + `</td>` +                           // Risposta
             `</tr>`;
  }

  // Creazione riga per ogni domanda della seconda parte del questionario
  for(let i = 10; i <= 15; i++)
  {
    let risposta = parseInt(response[`item-`+i] as string);

    if(QUESTIONS[i-1].reverse)
    {
      risposta = 6 - risposta;
    }

    html +=  `<tr>
                <td>` + (i) + (QUESTIONS[i-1].reverse ? `. (R)` : `.`) + `</td>` +  // #
               `<td>` + QUESTIONS[i-1].text + `</td>` +                             // Item
               `<td>` + risposte2[risposta-1] + `</td>` +                           // Risposta
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
  const scoreJSON = records.score as JsonObject;

  const appetiteDrive = scoreJSON.appetiteDrive as number;
  const lowDietaryControl = scoreJSON.lowDietaryControl as number;

  const score = appetiteDrive + lowDietaryControl;

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
                      <th style="width:800;" colspan="2"><p>Punteggio</p></th>
                      <th style="width:200;"><p>Appetite Drive</p></th>
                      <th style="width:200;"><p>Low Dietary Control</p></th>
                    </tr>` +
  
                    // Sottointestazione tabella
                   `<tr class="table_subheader">
                      <th style="width:25%;"><p>Valore</p></th>
                      <th style="width:25%;"><p>Cut-off</p></th>
                      <th style="width:25%;"><p>Valore</p></th>
                      <th style="width:25%;"><p>Valore</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
  
                    // Punteggi
                   `<tr>
                      <td>` + score + `/75</td>
                      <td>38</td>
                      <td>` + appetiteDrive + `</td>
                      <td>` + lowDietaryControl + `</td>
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

  // Creazione riga per ogni domanda della prima parte del questionario
  for(let i = 1; i <= 9; i++)
  {
    csv +=  (i) + (QUESTIONS[i-1].reverse ? ` (R)` : ``) + `,"` + // #
            QUESTIONS[i-1].text + `",` +                          // Item
            (response[`item-`+i] as string) + `\n`;               // Risposta
  }

  // Creazione riga per ogni domanda della seconda parte del questionario
  for(let i = 10; i <= 15; i++)
  {
    csv +=  (i) + (QUESTIONS[i-1].reverse ? ` (R)` : ``) + `,"` + // #
            QUESTIONS[i-1].text + `",` +                          // Item
            (response[`item-`+i] as string) + `\n`;               // Risposta
  }
  
  return csv;
}