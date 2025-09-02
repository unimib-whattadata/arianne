import type { JsonObject } from '@/types';

import { QUESTIONS } from './cbave-questions';

const risposte = [`Per nulla`, `Poco`, `Abbastanza`, `Molto`, `Moltissimo`];

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
    QUESTIONS[0].instruction +
    `
                  </p>
                </div>` +
    `

                <table class="risposte">
                  <thead>` +
    // Intestazione tabella risposte
    `<tr class="table_header">
                      <th style="width:20;"><p>#</p></th>
                      <th style="width:600;"><p>Item</p></th>
                      <th style="width:20;"><p>Risposta</p></th>
                    </tr>
                  </thead>
                  <tbody>`;

  // Creazione riga per ogni domanda della prima parte del questionario
  for (let i = 1; i <= 40; i++) {
    html +=
      `<tr>
                <td>` +
      i +
      `.</td>` + // #
      `<td>` +
      QUESTIONS[0].questions[i - 1].text +
      `</td>` + // Item
      `<td>` +
      risposte[parseInt(response[`item-` + i] as string)] +
      `</td>` + // Risposta
      `</tr>`;
  }

  // Creazione riga per ogni domanda della seconda parte del questionario
  for (let i = 41; i <= 66; i++) {
    html +=
      `<tr>
                <td>` +
      i +
      `.</td>` + // #
      `<td>Mi sono sentito ` +
      QUESTIONS[1].questions[i - 41].text +
      `</td>` + // Item
      `<td>` +
      risposte[parseInt(response[`item-` + i] as string)] +
      `</td>` + // Risposta
      `</tr>`;
  }

  // Creazione riga per ogni domanda della terza parte del questionario
  for (let i = 67; i <= 80; i++) {
    html +=
      `<tr>
                <td>` +
      i +
      `.</td>` + // #
      `<td>Ho avuto ` +
      QUESTIONS[2].questions[i - 67].text +
      `</td>` + // Item
      `<td>` +
      risposte[parseInt(response[`item-` + i] as string)] +
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
  const scores = records.scores as JsonObject;

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
                      <th style="width:800;" colspan="5"><p>Punteggio</p></th>
                    </tr>` +
    // Sottointestazione tabella
    `<tr class="table_subheader">
                      <th style="width:20%;"><p>Ansia</p></th>
                      <th style="width:20%;"><p>Benessere</p></th>
                      <th style="width:20%;"><p>Cambiamento</p></th>
                      <th style="width:20%;"><p>Depressione</p></th>
                      <th style="width:20%;"><p>Disagio</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
    // Punteggi
    `<tr>
                      <td>` +
    (scores.ansia as string) +
    `</td>
                      <td>` +
    (scores.benessere as string) +
    `</td>
                      <td>` +
    (scores.cambiamento as string) +
    `</td>
                      <td>` +
    (scores.depressione as string) +
    `</td>
                      <td>` +
    (scores.disagio as string) +
    `</td>
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

  // Creazione riga per ogni domanda della prima parte del questionario
  for (let i = 1; i <= 40; i++) {
    csv +=
      i +
      `,"` + // #
      QUESTIONS[0].questions[i - 1].text +
      `",` + // Item
      (response[`item-` + i] as string) +
      `\n`; // Risposta
  }

  // Creazione riga per ogni domanda della seconda parte del questionario
  for (let i = 41; i <= 66; i++) {
    csv +=
      i +
      `,` + // #
      `"Mi sono sentito ` +
      QUESTIONS[1].questions[i - 41].text +
      `",` + // Item
      (response[`item-` + i] as string) +
      `\n`; // Risposta
  }

  // Creazione riga per ogni domanda della terza parte del questionario
  for (let i = 67; i <= 80; i++) {
    csv +=
      i +
      `,` + // #
      `"Ho avuto ` +
      QUESTIONS[2].questions[i - 67].text +
      `",` + // Item
      (response[`item-` + i] as string) +
      `\n`; // Risposta
  }

  return csv;
}
