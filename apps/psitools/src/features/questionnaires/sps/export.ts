import type { JsonObject } from '@prisma/client/runtime/library';

import { INSTRUCTIONS, QUESTIONS } from './questions';

const risposte =  [ `Per nulla`,
                    `Un poco`,
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
  for(let i = 1; i <= 20; i++)
  {
    const risposta = parseInt(response[`item-`+i] as string);

    html +=  `<tr>
                <td>` + (i) + `.</td>` +                // #
               `<td>` + QUESTIONS[i-1] + `</td>` +      // Item
               `<td>` + risposte[risposta] + `</td>` +  // Risposta
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
export function generateScoresHTML(records: JsonObject, sex: string): string
{
  const response = records.response as Record<string, string>;

  const score = parseInt(
    Object.entries(response).reduce((acc, [_, value]) => [
      acc[0],
      `${parseInt(acc[1]) + parseInt(value)}`,
    ])[1],
  );

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
                      <td>` + score + `/80</td>
                      <td>` + (sex === `M` ? `22` : `26`) + `</td>
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
  for(let i = 1; i <= 20; i++)
  {
    csv +=  (i) + `,"` +                            // #
            QUESTIONS[i-1] + `",` +                 // Item
            (response[`item-`+i] as string) + `\n`; // Risposta
  }
  
  return csv;
}