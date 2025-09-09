import type { JsonObject } from '@/types';

import { INSTRUCTIONS_1, INSTRUCTIONS_2, QUESTIONS } from './questions';

const risposte = [
  `Completamente falso`,
  `Prevalentemente falso`,
  `Prevalentemente vero`,
  `Completamente vero`,
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
    INSTRUCTIONS_1 +
    `
                        </p>
                      </div>` +
    `

                      <table class="risposte">
                        <thead>` +
    // Intestazione tabella risposte
    `<tr class="table_header">
                            <th style="width:20;"><p>#</p></th>
                            <th style="width:550;"><p>Item</p></th>
                            <th style="width:180;"><p>Risposta</p></th>
                          </tr>
                        </thead>
                        <tbody>`;

  // Creazione riga per ogni domanda della prima parte del questionario
  for (let i = 1; i <= 13; i++) {
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
      risposte[risposta - 1] +
      `</td>` + // Risposta
      `</tr>`;
  }

  html +=
    ` </tbody>
          </table>` +
    // Istruzioni
    `<div id="istruzioni" style="margin-top:40;">
             <p>
               <p class="bold" style="font-style: italic;">Istruzioni</p>
               : ` +
    INSTRUCTIONS_2 +
    `
             </p>
           </div>` +
    `

           <table class="risposte">
             <thead>` +
    // Intestazione tabella risposte
    `<tr class="table_header">
                 <th style="width:20;"><p>#</p></th>
                 <th style="width:700;"><p>Item</p></th>
                 <th style="width:100;"><p>Risposta</p></th>
               </tr>
             </thead>
             <tbody>`;

  // Creazione riga per ogni domanda della seconda parte del questionario
  for (let i = 14; i <= 18; i++) {
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
      QUESTIONS[i - 1].options[risposta - 1] +
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

  const CR = scoreJSON.CR as number;
  const EE = scoreJSON.EE as number;
  const UE = scoreJSON.UE as number;

  const score = CR + EE + UE;

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
                      <th style="width:400;"><p>Scala</p></th>
                      <th style="width:400;"><p>Punteggio</p></th>
                    </tr>` +
    // Sottointestazione tabella
    `<tr class="table_subheader">
                      <th><p>Scala globale</p></th>
                      <th><p>` +
    score +
    `/76</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
    // Punteggi
    `<tr>
                      <td><p>Uncontrolled eating</p></td>
                      <td><p>` +
    UE +
    `/36</p></td>
                    </tr>

                    <tr>
                      <td><p>Cognitive restraint</p></td>
                      <td><p>` +
    CR +
    `/28</p></td>
                    </tr>

                    <tr>
                      <td><p>Emotional eating</p></td>
                      <td><p>` +
    EE +
    `/12</p></td>
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
  for (let i = 1; i <= 18; i++) {
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
