import type { JsonObject } from '@prisma/client/runtime/library';

import { INSTRUCTIONS_1, INSTRUCTIONS_2, QUESTIONS } from './questions';
import { SYMPTOMS } from './symptoms';

const risposte1 = { "sì" : "Sì",
                    "no" : "No",
                    "uncertain" : "?" }

const risposte2 = { "nessuno" : "Nessun cambiamento o peggioramento",
                    "leggermente" : "Leggermente peggiorato",
                    "chiaramente" : "Chiaramente peggiorato" }

// Funzione richiamata da export_pdf.ts per generare il contenuto HTML del questionario
export function generateResponsesHTML(records: JsonObject): string
{
  const response = records.response as JsonObject;
  const items = response.items as JsonObject;
  const post = response.post as JsonObject;

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
                  : ` + INSTRUCTIONS_1 + INSTRUCTIONS_2 + `
                </p>
              </div>` + `
                    
              <table class="risposte">
                <thead>` +

                  // Intestazione tabella risposte
                  `<tr class="table_header">
                    <th style="width:20;"><p>#</p></th>
                    <th style="width:300;"><p>Item</p></th>
                    <th style="width:100;"><p>Risposta</p></th>
                    <th style="width:300;"><p>Note</p></th>
                  </tr>
                </thead>
                <tbody>`;

  
  // Creazione riga per ogni domanda della prima parte del questionario
  for(let i = 1; i <= 17; i++)
  {
      const item = items[`item-` + i] as JsonObject;

      html +=  `<tr>
                  <td>` + (i) + `.</td>` +                                                                  // #
                 `<td>` + QUESTIONS[i-1].text + `</td>` +                                                   // Item
                 `<td>` + risposte1[item.value as keyof typeof risposte1] + `</td>` +                       // Risposta
                 `<td>` + ((item.note) ? `<p>[Aperta] ` + (item.note as string).slice(3) : ` `) + `</td>` + // Note
               `</tr>`;
  }

  // Aggiunta delle domande della seconda parte del questionario e chiusura tabella
  html +=      `<tr>
                  <td>18.</td>
                  <td>Quale problema ti disturba particolarmente?</td>
                  <td rowspan=2>` + (SYMPTOMS[parseInt(post[`post-question-symptom`] as string)-1] as string) + `</td>
                  <td>` + (post[`post-question-1`] as string) + `</td>
                </tr>
                
                <tr>
                  <td>19.</td>
                  <td>Questo problema è peggiorato negli ultimi sei mesi?</td>
                  <td>` + risposte2[post[`post-question-2`] as keyof typeof risposte2] + `</td>
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

// Funzione richiamata da export_pdf.ts per generare il contenuto HTML dei risultati
export function generateScoresHTML(records: JsonObject): string
{
  const response = records.response as JsonObject;
  const items = response.items as JsonObject;

  const score = Object.values(items)
    .map((item) => (item as JsonObject).value)
    .reduce((acc, item, index) => {
      const multiplier = () => {
        if (index <= 12) return 1;
        if (index >= 13 && index <= 14) return 2;
        return 3;
      };

      switch (item) {
        case 'sì':
          return acc as number + 2 * multiplier();
        case 'no':
          return acc;
        case 'uncertain':
          return acc as number  + 1 * multiplier();
        default:
          return acc;
      }
    }, 0) as number;

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
                      <th style="width:800;" colspan="2"><p>Sintomi espressi</p></th>
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
                      <td>` + score + `/46</td>
                      <td>6</td>
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
  const items = response.items as JsonObject;
  const post = response.post as JsonObject;
  
  // Header CSV
  let csv = `#,Item,Risposta,Note\n`

  // Creazione riga per ogni domanda della prima parte del questionario
  for(let i = 1; i <= 17; i++)
  {
      const item = items[`item-` + i] as JsonObject;

      csv +=  (i) + `,` +                                                                         // #
              QUESTIONS[i-1].text + `,` +                                                         // Item
              risposte1[item.value as keyof typeof risposte1] + `,` +                             // Risposta
              ((item.note) ? `"`+ (item.note as string).replaceAll('"',"'") + `"`  : ` `) + `\n`; // Note
  }

  // Aggiunta delle domande della seconda parte del questionario
  csv += `18,Quale problema ti disturba particolarmente?,` +
          SYMPTOMS[parseInt(post[`post-question-symptom`] as string)-1] + `,"` +
          (post[`post-question-1`] as string).replaceAll('"',"'") + `"\n` +
            
         `19,Questo problema è peggiorato negli ultimi sei mesi?,` + 
          SYMPTOMS[parseInt(post[`post-question-symptom`] as string)-1] + `,"` +
          risposte2[post[`post-question-2`] as keyof typeof risposte2] + `"\n`;

  return csv;
}