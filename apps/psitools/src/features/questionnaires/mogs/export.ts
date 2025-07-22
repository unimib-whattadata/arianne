import type { JsonObject } from '@prisma/client/runtime/library';

import { INSTRUCTIONS, QUESTIONS } from './questions';

const risposte =  [ `Per nulla`,
                    `Poco`,
                    `Abbastanza`,
                    `Molto`,
                    `Moltissimo`];

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
                      </p>
                    </div>` + `
                          
                    <table class="risposte">
                      <thead>` +
      
                        // Intestazione tabella risposte
                       `<tr class="table_header">
                          <th style="width:20;"><p>#</p></th>
                          <th style="width:600;"><p>Item</p></th>
                          <th style="width:100;"><p>Risposta</p></th>
                        </tr>
                      </thead>
                      <tbody>`;

  // Creazione riga per ogni domanda del questionario
  for(let i = 1; i <= 17; i++)
  {
    const risposta = parseInt(response[`item-`+i] as string);

    html +=  `<tr>
                <td>` + (i) + `.</td>` +                  // #
               `<td>` + QUESTIONS[i-1].text + `</td>` +   // Item
               `<td>` + risposte[risposta-1] + `</td>` +  // Risposta
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

  const EMP = scoreJSON.EMP as number;
  const MNV = scoreJSON.MNV as number;
  const HARM = scoreJSON.HARM as number;
  const MODI = scoreJSON.MODI as number;

  const score = EMP + MNV + HARM + MODI;

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
                      <th style="width:250;"><p>Valore</p></th>
                      <th style="width:250;"><p>Punteggio minimo</p></th>
                    </tr>` +
  
                    // Sottointestazione tabella
                   `<tr class="table_subheader">
                      <th><p>Scala globale</p></th>
                      <th><p>` + score + `/65</p></th>
                      <th><p>17</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
  
                    // Punteggi
                   `<tr>
                      <td><p>MNV</p></td>
                      <td><p>` + MNV + `/30</p></td>
                      <td><p>6</p></td>
                    </tr>

                    <tr>
                      <td><p>Empathy</p></td>
                      <td><p>` + EMP + `/25</p></td>
                      <td><p>5</p></td>
                    </tr>

                    <tr>
                      <td><p>MODI</p></td>
                      <td><p>` + MODI + `/15</p></td>
                      <td><p>3</p></td>
                    </tr>

                    <tr>
                      <td><p>Harm</p></td>
                      <td><p>` + HARM + `/15</p></td>
                      <td><p>3</p></td>
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
  for(let i = 1; i <= 17; i++)
  {
    csv +=  (i) + `,"` +                            // #
            QUESTIONS[i-1].text + `",` +            // Item
            (response[`item-`+i] as string) + `\n`; // Risposta
  }
  
  return csv;
}