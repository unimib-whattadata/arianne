import type { JsonObject } from '@/types';

import { INSTRUCTIONS, QUESTIONS } from './questions';

const risposte = [
  `Non mi è mai accaduto`,
  `Mi è capitato qualche volta`,
  `Mi è capitato con una certa frequenza`,
  `Mi è capitato spesso`,
];

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
                          <th style="width:210;"><p>Risposta</p></th>
                        </tr>
                      </thead>
                      <tbody>`;

  // Creazione riga per ogni domanda del questionario
  for (let i = 1; i <= 21; i++) {
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
      risposte[risposta] +
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

  const stress = scoreJSON.stress as number;
  const anxiety = scoreJSON.anxiety as number;
  const depression = scoreJSON.depression as number;

  const score = stress + anxiety + depression;

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
                      <th style="width:200;"><p>Scala</p></th>
                      <th style="width:200;"><p>Punteggio</p></th>
                      <th style="width:200;"><p>Cut-off</p></th>
                      <th style="width:200;"><p>Livello</p></th>
                    </tr>` +
    // Sottointestazione tabella
    `<tr class="table_subheader">
                      <th><p>Distress generale</p></th>
                      <th><p>` +
    score +
    `/126</p></th>
                      <th><p>/</p></th>
                      <th><p>/</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
    // Punteggi
    `<tr>
                      <td><p>Depressione</p></td>
                      <td><p>` +
    depression +
    `/42</p></td>
                      <td><p>14</p></td>
                      <td><p>` +
    (depression < 10
      ? `Normale`
      : depression < 14
        ? `Lieve`
        : depression < 21
          ? `Moderata`
          : depression < 28
            ? `Grave`
            : `Molto grave`) +
    `</p></td>
                    </tr>

                    <tr>
                      <td><p>Ansia</p></td>
                      <td><p>` +
    anxiety +
    `/42</p></td>
                      <td><p>10</p></td>
                      <td><p>` +
    (anxiety < 8
      ? `Normale`
      : anxiety < 10
        ? `Lieve`
        : anxiety < 15
          ? `Moderata`
          : anxiety < 20
            ? `Grave`
            : `Molto grave`) +
    `</p></td>
                    </tr>

                    <tr>
                      <td><p>Stress</p></td>
                      <td><p>` +
    stress +
    `/42</p></td>
                      <td><p>19</p></td>
                      <td><p>` +
    (stress < 15
      ? `Normale`
      : stress < 19
        ? `Lieve`
        : stress < 26
          ? `Moderata`
          : stress < 34
            ? `Grave`
            : `Molto grave`) +
    `</p></td>
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
  for (let i = 1; i <= 21; i++) {
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
