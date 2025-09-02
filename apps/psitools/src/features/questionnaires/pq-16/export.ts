import type { JsonObject } from '@/types';

import { INSTRUCTIONS, QUESTIONS } from './questions';

const risposte = [`Nessuno`, `Lieve`, `Moderato`, `Grave`];

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
                      <th style="width:500;"><p>Item</p></th>
                      <th style="width:50;"><p>Risposta</p></th>
                      <th style="width:80;"><p>Livello</p></th>
                    </tr>
                  </thead>
                  <tbody>`;

  // Creazione riga per ogni domanda del questionario
  for (let i = 1; i <= 16; i++) {
    const item = response[`item-` + i];
    const risposta = item.value === `true`;

    html +=
      `<tr>
                <td>` +
      i +
      `.</td>` + // #
      `<td>` +
      QUESTIONS[i - 1].text +
      `</td>` + // Item
      `<td>` +
      (risposta ? `Vero` : `Falso`) +
      `</td>` + // Risposta
      `<td>` +
      (risposta ? risposte[parseInt(item.score as string)] : `/`) +
      `</td>` + // Livello
      `</tr>`;
  }

  // Chiusura tabella e div
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
  const response = records.response as JsonObject;

  const expressedSymptoms = Object.entries(response).filter(
    ([, record]) => (record as JsonObject)?.value === 'true',
  );

  const expressedSymptomsCount = expressedSymptoms.length;

  const expressedSymptomsScore = expressedSymptoms
    .map(([, record]) => parseInt((record as JsonObject)?.score as string) || 0)
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
                      <th style="width:400;" colspan="2"><p>Sintomi espressi</p></th>
                      <th style="width:400;" colspan="2"><p>Distress</p></th>
                    </tr>` +
    // Sottointestazione tabella
    `<tr class="table_subheader">
                      <th style="width:25%;"><p>Valore</p></th>
                      <th style="width:25%;"><p>Cut-off</p></th>
                      <th style="width:25%;"><p>Valore</p></th>
                      <th style="width:25%;"><p>Cut-off</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
    // Punteggi
    `<tr>
                      <td>` +
    expressedSymptomsCount +
    `/16</td>
                      <td>6</td>
                      <td>` +
    expressedSymptomsScore +
    `/48</td>
                      <td>8</td>
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
  let csv = `#,Item,Risposta,Livello\n`;

  // Creazione riga per ogni domanda del questionario
  for (let i = 1; i <= 16; i++) {
    const item = response[`item-` + i];
    const risposta = item.value === `true`;

    csv +=
      i +
      `,"` + // #
      QUESTIONS[i - 1].text +
      `",` + // Item
      (risposta ? `Vero` : `Falso`) +
      `,` + // Risposta
      (risposta ? (item.score as string) : `/`) +
      `\n`; // Livello
  }

  return csv;
}
