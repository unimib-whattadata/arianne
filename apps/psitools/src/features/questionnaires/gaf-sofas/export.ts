import type { JsonObject } from '@prisma/client/runtime/library';

import { INSTRUCTIONS, QUESTIONS } from './questions';

// Funzione richiamata da export_pdf.ts per generare il contenuto HTML del questionario
export function generateResponsesHTML(records: JsonObject): string
{
  const response = records.response as JsonObject;
  const value = response.value as number[];

  const html = `
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
                  </div>` + 

               // Risultato
               `<p><b>Valore selezionato:</b> ` + value[0] + `</p>
                <p><b>Descrizione:</b> ` + QUESTIONS[10-Math.ceil(value[0]/10)].text + `</p>
              
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
  const value = response.value as number[];

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
                      <td>` + value[0] + `/100</td>
                      <td>10</td>
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
  const value = response.value as number[];
  
  // Stringa CSV
  const csv = `Valore, Descrizione\n` + value[0] + `,"` +
             QUESTIONS[10-Math.ceil(value[0]/10)].text + `"\n`;
  
  return csv;
}