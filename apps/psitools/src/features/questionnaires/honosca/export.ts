import type { JsonObject } from '@/types';

import { INSTRUCTIONS, QUESTIONS } from './questions';

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
              <p>
                <p class="bold" style="font-style: italic;">Istruzioni</p>
                : ` +
    INSTRUCTIONS +
    `
              </p>
            </div>` +
    `

            <table class="risposte">
              <thead>` +
    // Intestazione tabella risposte
    `<tr class="table_header">
                  <th style="width:20;"><p>#</p></th>
                  <th style="width:250;"><p>Item</p></th>
                  <th style="width:450;"><p>Risposta</p></th>
                </tr>
              </thead>
              <tbody>`;

  // Creazione riga per ogni domanda del questionario
  for (let i = 1; i <= 15; i++) {
    const risposta = parseInt(response[`item-` + i] as string);

    html +=
      `<tr>
                <td>` +
      i +
      `.</td>` + // #
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
  const response = records.response as Record<string, string>;

  const score = Object.entries(response)
    .map(([, record]) => parseInt(record) || 0)
    .reduce((acc, score) => acc + score, 0);

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
                      <th style="width:800;" colspan="2"><p>Punteggio</p></th>
                    </tr>` +
    // Sottointestazione tabella
    `<tr class="table_subheader">
                      <th style="width:50%;"><p>Valore</p></th>
                      <th style="width:50%;"><p>Valore massimo</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
    // Punteggi
    `<tr>
                      <td>` +
    score +
    `</td>
                      <td>60</td>
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
  for (let i = 1; i <= 15; i++) {
    csv +=
      i +
      `,"` + // #
      QUESTIONS[i - 1].text +
      `",` + // Item
      (response[`item-` + i] as string) +
      `\n`; // Risposta
  }

  return csv;
}
