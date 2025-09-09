import type { JsonObject } from '@/types';

import { QUESTIONS } from './questions';

// Funzione richiamata da export_pdf.ts per generare il contenuto HTML del questionario
export function generateResponsesHTML(records: JsonObject): string {
  const response = records.response as JsonObject;

  let html =
    `
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
                        <p>La dicitura (R) nel numero della domanda indica che il punteggio per tale domanda è invertito.</p>
                      </div>` +
    `


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

  // Creazione riga per ogni domanda del questionario
  for (let i = 1; i <= 14; i++) {
    let risposta = parseInt(response[`item-` + i] as string);

    if (QUESTIONS[i - 1].reverse) {
      risposta = 3 - risposta;
    }

    html +=
      `<tr>
                <td>` +
      i +
      (QUESTIONS[i - 1].reverse ? '. (R)' : '.') +
      `</td>` + // #
      `<td>` +
      QUESTIONS[i - 1].text +
      `</td>` + // Item
      `<td>` +
      QUESTIONS[i - 1].options[risposta] +
      `</td>` + // Risposta
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
export function generateScoresHTML(records: JsonObject): string {
  const scoreJSON = records.score as JsonObject;

  const anxiety = scoreJSON.anxiety as number;
  const depression = scoreJSON.depression as number;
  const score = anxiety + depression;

  const html =
    `
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
                      <th style="width:400;" colspan="3"><p>Distress generale</p></th>
                      <th style="width:150;"><p>Ansia</p></th>
                      <th style="width:150;"><p>Depressione</p></th>
                    </tr>` +
    // Sottointestazione tabella
    `<tr class="table_subheader">
                      <th style="width:134;"><p>Valore</p></th>
                      <th style="width:133;"><p>Cut-off</p></th>
                      <th style="width:133;"><p>livello</p></th>
                      <th style="width:150;"><p>Valore</p></th>
                      <th style="width:150;"><p>Valore</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
    // Punteggi
    `<tr>
                      <td>` +
    score +
    `/42</td>
                      <td>` +
    16 +
    `</td>
                      <td>` +
    (score < 16 ? `Lieve` : score < 22 ? `Moderata` : `Grave`) +
    `</td>
                      <td>` +
    anxiety +
    `/21</td>
                      <td>` +
    depression +
    `/21</td>
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
export function generateCSV(records: JsonObject): string {
  const response = records.response as JsonObject;

  // Header CSV
  let csv = `#,Item,Risposta\n`;

  // Creazione riga per ogni domanda del questionario
  for (let i = 1; i <= 14; i++) {
    csv +=
      i +
      (QUESTIONS[i - 1].reverse ? ` (R)` : ``) +
      `,"` + // #
      QUESTIONS[i - 1].text +
      `",` + // Item
      (response[`item-` + i] as string) +
      `\n`; // Risposta
  }

  return csv;
}
