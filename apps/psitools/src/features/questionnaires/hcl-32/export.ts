import type { JsonObject } from '@prisma/client/runtime/library';

import {
  INSTRUCTIONS_1,
  INSTRUCTIONS_2,
  INSTRUCTIONS_3,
  QUESTIONS,
} from './questions';

// Funzione richiamata da export_pdf.ts per generare il contenuto HTML del questionario
export function generateResponsesHTML(records: JsonObject): string {
  const response = records.response as JsonObject;
  const items = response.items as JsonObject;

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
    // Creazione riga per la prima domanda del questionario
    `<table class="risposte">
                          <thead>` +
    // Intestazione tabella prima domanda
    `<tr class="table_header">
                                <th style="width:20;"><p>#</p></th>
                                <th style="width:400;"><p>Item</p></th>
                                <th style="width:300;"><p>Risposta</p></th>
                              </tr>

                          </thead>
                          <tbody>
                            <tr>
                              <td>1.</td>
                              <td>` +
    QUESTIONS[0].text +
    `</td>
                              <td>` +
    QUESTIONS[0].options[parseInt(items[`item-1`] as string)] +
    `</td>
                            </tr>
                          </tbody>
                        </table>` +
    // Istruzioni
    `<div id="istruzioni" style="margin-top: 40;">
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
    // Intestazione prima tabella risposte
    `<tr class="table_header">
                              <th style="width:20;"><p>#</p></th>
                              <th style="width:700;"><p>Item</p></th>
                              <th style="width:100;"><p>Risposta</p></th>
                            </tr>
                          </thead>
                          <tbody>`;

  // Creazione riga per ogni domanda della prima parte del questionario
  for (let i = 2; i <= 34; i++) {
    const risposta = items[`item-` + i] == 'true' ? 'Vero' : 'Falso';

    html +=
      `<tr>
               <td>` +
      i +
      `.</td>` + // #
      `<td>` +
      QUESTIONS[i - 1].text +
      `</td>` + // Item
      `<td>` +
      risposta +
      `</td>` + // Risposta
      `</tr>`;
  }

  if (items[`item-34`] == 'false') {
    // DOMANDA 35
    html +=
      `<tr>
                <td>35.</td>
                <td>` +
      QUESTIONS[34].text +
      `</td>
                <td>` +
      (items[`item-35`] == 'true' ? 'Vero' : 'Falso') +
      `</td>
              </tr>`;

    if (items[`item-35`] == 'true') {
      // DOMANDE 36-37
      for (let i = 36; i <= 37; i++) {
        const risposta = items[`item-` + i] as string;

        html +=
          `<tr>
                    <td>` +
          i +
          `.</td>` + // #
          `<td>` +
          QUESTIONS[i - 1].text +
          `</td>` + // Item
          `<td>` +
          risposta +
          `</td>` + // Risposta
          `</tr>`;
      }

      // DOMANDA 38
      html +=
        `<tr>
                  <td>35.</td>
                  <td>` +
        QUESTIONS[37].text +
        `</td>
                  <td>` +
        QUESTIONS[37].options[parseInt(items[`item-38`] as string)] +
        `</td>
                </tr>`;

      // DOMANDE 39-40
      for (let i = 39; i <= 40; i++) {
        const risposta =
          `<p>[Aperta] ` + (items[`item-` + i] as string).slice(3);

        html +=
          `<tr>
                    <td>` +
          i +
          `.</td>` + // #
          `<td>E quanto è durato il periodo più lungo di questo tipo? [` +
          QUESTIONS[i - 1].text +
          `]</td>` + // Item
          `<td>` +
          risposta +
          `</td>` + // Risposta
          `</tr>`;
      }

      html +=
        `</tbody>
            </table>` +
        // Istruzioni
        `<div id="istruzioni" style="margin-top: 40;">
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
        // Intestazione seconda tabella risposte
        `<tr class="table_header">
                 <th style="width:20;"><p>#</p></th>
                 <th style="width:400;"><p>Item</p></th>
                 <th style="width:300;"><p>Risposta</p></th>
               </tr>
             </thead>
             <tbody>`;

      // DOMANDE 41-44
      for (let i = 41; i <= 44; i++) {
        html +=
          `<tr>
                    <td>` +
          i +
          `.</td>
                    <td>` +
          QUESTIONS[i - 1].text +
          `</td>
                    <td>` +
          QUESTIONS[i - 1].options[parseInt(items[`item-` + i] as string)] +
          `</td>
                  </tr>`;
      }

      html +=
        `</tbody>
        </table>` +
        // Istruzioni
        `<div id="istruzioni" style="margin-top: 40;">
         <p>
           <p class="bold" style="font-style: italic;">Istruzioni</p>
           : ` +
        INSTRUCTIONS_3 +
        `
         </p>
       </div>` +
        `

       <table class="risposte">
         <thead>` +
        // Intestazione terza tabella risposte
        `<tr class="table_header">
             <th style="width:20;"><p>#</p></th>
             <th style="width:700;"><p>Item</p></th>
             <th style="width:100;"><p>Risposta</p></th>
           </tr>
         </thead>
         <tbody>`;

      // DOMANDE 45-48
      for (let i = 45; i <= 48; i++) {
        const risposta = items[`item-` + i] == 'true' ? 'Vero' : 'Falso';

        html +=
          `<tr>
                     <td>` +
          i +
          `.</td>` + // #
          `<td>` +
          QUESTIONS[i - 1].text +
          `</td>` + // Item
          `<td>` +
          risposta +
          `</td>` + // Risposta
          `</tr>`;
      }
    }
  } else {
    html +=
      `</tbody>
        </table>` +
      // Istruzioni
      `<div id="istruzioni" style="margin-top: 40;">
         <p>
           <p class="bold" style="font-style: italic;">Istruzioni</p>
           : ` +
      INSTRUCTIONS_3 +
      `
         </p>
       </div>` +
      `

       <table class="risposte">
         <thead>` +
      // Intestazione seconda tabella risposte
      `<tr class="table_header">
             <th style="width:20;"><p>#</p></th>
             <th style="width:700;"><p>Item</p></th>
             <th style="width:100;"><p>Risposta</p></th>
           </tr>
         </thead>
         <tbody>`;

    // DOMANDE 45-48
    for (let i = 45; i <= 48; i++) {
      const risposta = items[`item-` + i] == 'true' ? 'Vero' : 'Falso';

      html +=
        `<tr>
                     <td>` +
        i +
        `.</td>` + // #
        `<td>` +
        QUESTIONS[i - 1].text +
        `</td>` + // Item
        `<td>` +
        risposta +
        `</td>` + // Risposta
        `</tr>`;
    }
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

  const score = Object.entries(response.items).filter(([key, record]) => {
    const questionIndex = parseInt(key.split('-')[1], 10);
    return questionIndex >= 2 && questionIndex <= 33 && record === 'true';
  }).length;

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
                      <th style="width:50%;"><p>Cut-off</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
    // Punteggi
    `<tr>
                      <td>` +
    score +
    `/32</td>
                      <td>12</td>
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
export function generateCSV(_records: JsonObject): string {
  // TODO da implementare quando HCL-32 verrà abilitato
  return '';
}
