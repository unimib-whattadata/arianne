import type { JsonObject } from '@/types';

import { INSTRUCTIONS, QUESTIONS } from './questions';

const risposte1 = [
  `Mai`,
  `1-5 giorni`,
  `6-12 giorni`,
  `13-15 giorni`,
  `16-22 giorni`,
  `23-27 giorni`,
  `Ogni giorno`,
];

const risposte2 = [
  `Per niente`,
  `Per niente / leggermente`,
  `Leggermente`,
  `Leggermente / moderatamente`,
  `Moderatamente`,
  `Moderatamente / notevolmente`,
  `Notevolmente`,
];

// Funzione richiamata da export_pdf.ts per generare il contenuto HTML del questionario
export function generateResponsesHTML(records: JsonObject): string {
  const response = records.response as JsonObject;
  const items = response.items as JsonObject;
  const notes = response.notes as JsonObject;

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
                    <th style="width:600;"><p>Item</p></th>
                    <th style="width:20;"><p>Risposta</p></th>
                  </tr>
                </thead>
                <tbody>`;

  // Creazione riga per ogni domanda della prima parte del questionario
  for (let i = 1; i <= 12; i++) {
    const risposta = parseInt(items[`item-` + i] as string);

    html +=
      `<tr>
                <td>` +
      i +
      `.</td>` + // #
      `<td>` +
      QUESTIONS[i - 1].text +
      `</td>` + // Item
      `<td>` +
      risposte1[risposta] +
      `</td>` + // Risposta
      `</tr>`;
  }

  // Creazione riga per ogni domanda della seconda parte del questionario
  for (let i = 13; i <= 18; i++) {
    const risposta = `<p>[Aperta] ` + (notes[`note-` + i] as string).slice(3);

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

  // Creazione riga per le domande 19-20 del questionario
  for (let i = 19; i <= 20; i++) {
    const risposta = parseInt(items[`item-` + i] as string);

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

  // Creazione riga per le domande della terza parte del questionario
  for (let i = 21; i <= 28; i++) {
    const risposta = parseInt(items[`item-` + i] as string);

    html +=
      `<tr>
                <td>` +
      i +
      `.</td>` + // #
      `<td>` +
      QUESTIONS[i - 1].text +
      `</td>` + // Item
      `<td>` +
      risposte2[risposta] +
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
  const response = records.response as JsonObject;
  const items = response.items as Record<string, string>;

  //Divisione in Items

  const R_IDS = [1, 2, 3, 4, 5];
  const PA_IDS = [7, 9, 19, 20, 21];
  const PFC_IDS = [6, 8, 10, 11, 23, 26, 27, 28];
  const PP_IDS = [8, 12, 22, 24, 25];

  // Funzione calcolo score di un gruppo
  const calculateGroupScore = (ids: number[], items: Record<string, string>) =>
    ids.reduce((sum, id) => {
      const value = items[`item-${id}`];
      return sum + (parseInt(value) || 0);
    }, 0);

  const RScore = calculateGroupScore(R_IDS, items);
  const PAScore = calculateGroupScore(PA_IDS, items);
  const PFCScore = calculateGroupScore(PFC_IDS, items);
  const PPScore = calculateGroupScore(PP_IDS, items);

  // Formula deviazione standard

  const calculateStandardDeviation = (values: number[]): number => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  };

  const filterValuesByIds = (
    response: Record<string, string>,
    ids: number[],
  ) => {
    return Object.entries(response)
      .filter(([key]) => {
        const indexNumber = parseInt(key.split('-')[1], 10);
        return ids.includes(indexNumber);
      })
      .map(([_, value]) => Number(value));
  };

  // Riduzione decimali
  const roundToTwoDecimals = (num: number) => {
    return parseFloat(num.toFixed(2));
  };

  // Calcolo Medie
  const RAvg = roundToTwoDecimals(RScore / R_IDS.length);
  const PAAvg = roundToTwoDecimals(PAScore / PA_IDS.length);
  const PFCAvg = roundToTwoDecimals(PFCScore / PFC_IDS.length);
  const PPAvg = roundToTwoDecimals(PPScore / PP_IDS.length);

  const globalAvg = roundToTwoDecimals((RAvg + PAAvg + PFCAvg + PPAvg) / 4);

  // Filtro valori per calcolo
  const RValues = filterValuesByIds(items, R_IDS);
  const PAValues = filterValuesByIds(items, PA_IDS);
  const PFCValues = filterValuesByIds(items, PFC_IDS);
  const PPValues = filterValuesByIds(items, PP_IDS);

  // Calcolo deviazione standard
  const RSD = roundToTwoDecimals(calculateStandardDeviation(RValues));
  const PASD = roundToTwoDecimals(calculateStandardDeviation(PAValues));
  const PFCSD = roundToTwoDecimals(calculateStandardDeviation(PFCValues));
  const PPSD = roundToTwoDecimals(calculateStandardDeviation(PPValues));

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
                      <th style="width:450;"><p>Scala</p></th>
                      <th style="width:150;"><p>Media</p></th>
                      <th style="width:150;"><p>Deviazione standard</p></th>
                    </tr>` +
    // Sottointestazione tabella
    `<tr class="table_subheader">
                      <th><p>Media globale</p></th>
                      <th><p>` +
    globalAvg +
    `/6</p></th>
                      <th><p>/</p></th>
                    </tr>

                  </thead>
                  <tbody>` +
    // Punteggi
    `<tr>
                      <td><p>Restrizione</p></td>
                      <td><p>` +
    RAvg +
    `</p></td>
                      <td><p>` +
    RSD +
    `</p></td>
                    </tr>

                    <tr>
                      <td><p>Preoccupazione per l'alimentazione</p></td>
                      <td><p>` +
    PAAvg +
    `</p></td>
                      <td><p>` +
    PASD +
    `</p></td>
                    </tr>

                    <tr>
                      <td><p>Preoccupazione per la forma del corpo</p></td>
                      <td><p>` +
    PFCAvg +
    `</p></td>
                      <td><p>` +
    PFCSD +
    `</p></td>
                    </tr>

                    <tr>
                      <td><p>Preoccupazione per il peso</p></td>
                      <td><p>` +
    PPAvg +
    `</p></td>
                      <td><p>` +
    PPSD +
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
  const items = response.items as JsonObject;
  const notes = response.notes as JsonObject;

  // Header CSV
  let csv = `#,Item,Risposta\n`;

  // Creazione riga per ogni domanda della prima parte del questionario
  for (let i = 1; i <= 12; i++) {
    csv +=
      i +
      `,"` + // #
      QUESTIONS[i - 1].text +
      `",` + // Item
      (items[`item-` + i] as string) +
      `\n`; // Risposta
  }

  // Creazione riga per ogni domanda della seconda parte del questionario
  for (let i = 13; i <= 18; i++) {
    const risposta = notes[`note-` + i] as string;

    csv +=
      i +
      `,"` + // #
      QUESTIONS[i - 1].text +
      `","` + // Item
      risposta.replaceAll('"', "'") +
      `"\n`; // Risposta
  }

  // Creazione riga per le domande della terza e quarta parte del questionario
  for (let i = 19; i <= 28; i++) {
    csv +=
      i +
      `,"` + // #
      QUESTIONS[i - 1].text +
      `",` + // Item
      (items[`item-` + i] as string) +
      `\n`; // Risposta
  }

  return csv;
}
