import type { JsonObject } from '@prisma/client/runtime/library';

import { INSTRUCTIONS, QUESTIONS } from './questions';

const risposte =  [ `Mai`,
                    `Alcuni giorni`,
                    `Per più della metà dei giorni`,
                    `Quasi ogni giorno`];

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
                            <th style="width:500;"><p>Item</p></th>
                            <th style="width:210;"><p>Risposta</p></th>
                          </tr>
                        </thead>
                        <tbody>`;

  // Creazione riga per ogni domanda del questionario
  for(let i = 1; i <= 9; i++)
  {
    const risposta = parseInt(response[`item-`+i] as string);

    html +=  `<tr>
                <td>` + (i) + `.</td>` +                // #
               `<td>` + QUESTIONS[i-1].text + `</td>` + // Item
               `<td>` + risposte[risposta] + `</td>` +  // Risposta
             `</tr>`;
  }

  // Creazione riga per la domanda 10 del questionario
  html +=        `<tr>
                    <td>10.</td>` +                                                                     // #
                  `<td>` + QUESTIONS[9].text + `</td>` +                                                // Item
                  `<td>` + QUESTIONS[9].options[parseInt(response[`item-10`] as string)-1] + `</td>` +  // Risposta
                `</tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`;

  return html;
}

export function generateScoresHTML(records: JsonObject): string
{
  const response = records.response as Record<string, string>;
  const score = parseInt(
    Object.entries(response)
      .slice(0, 9)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  const getScoreMessage = (score: number, item9Score: number): string => {
    let level = '';
    if (score <= 5) {
      level = 'assente';
    } else if (score > 5 && score <= 10) {
      level = 'lieve';
    } else if (score > 10 && score <= 15) {
      level = 'moderata';
    } else if (score > 15 && score <= 20) {
      level = 'maggiore';
    } else if (score > 20) {
      level = 'grave';
    }

    const withOrWithout =
      score > 5
        ? item9Score > 0
          ? ' con pensieri suicidari'
          : ' senza pensieri suicidari'
        : '';

    return `Depressione ${level}${withOrWithout ? ` ${withOrWithout}` : ''}`;
  };



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
                      <th style="width:800;" colspan="3"><p>Punteggio</p></th>
                    </tr>` +
  
                    // Sottointestazione tabella
                   `<tr class="table_subheader">
                      <th style="width:25%;"><p>Valore</p></th>
                      <th style="width:25%;"><p>Cut-off</p></th>
                      <th style="width:50%;"><p>Livello</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
  
                    // Punteggi
                   `<tr>
                      <td>` + score + `/27</td>
                      <td>10</td>
                      <td>` + getScoreMessage(score, parseInt(response['item-9'])) + `</td>
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
  for(let i = 1; i <= 10; i++)
  {
    csv +=  (i) + `,"` +                            // #
            QUESTIONS[i-1].text + `",` +            // Item
            (response[`item-`+i] as string) + `\n`; // Risposta
  }
  
  return csv;
}