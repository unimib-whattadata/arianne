import type { JsonObject } from '@prisma/client/runtime/library';
import PDFMerger from 'pdf-merger-js/browser';
import puppeteer from 'puppeteer';

import { poppins_bold_base64 } from './poppins_bold_base64';
import { poppins_regular_base64 } from './poppins_regular_base64';

export interface AdministrationData {
  type: string;
  response: JsonObject;
  T: string;
  data: string;
  notes: string;
  mode: string;
}

export interface PatientData {
  name: string;
  dateOfBirth: string;
  Gender: string;
  ID: string;
}

export interface TherapistData {
  name: string;
  email: string;
  phone: string;
}

interface QuestionnaireModule {
  generateResponsesHTML: (records: JsonObject) => string;
  generateScoresHTML: (records: JsonObject, sex?: string) => string;
}

// Funzione per generare il file PDF dalla stringa HTML tramite libreria puppeteer
export async function generateAdministrationsPDF(
  HTMLs: string[],
): Promise<Uint8Array<ArrayBufferLike>> {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  let page = await browser.newPage();
  await page.emulateMediaType('screen');
  const merger = new PDFMerger();
  let timedOut;

  for (const html of HTMLs) {
    do {
      try {
        console.log('- newpage');
        page = await browser.newPage();

        console.log('- emulate media');
        await page.emulateMediaType('print');

        console.log('- setContent');
        await page.setContent(html, { timeout: 2000 });

        console.log('- pdf');
        const pdf = await page.pdf({
          format: 'A4',
          printBackground: true,
          timeout: 2000,
        });

        console.log('- add');
        await merger.add(pdf);

        timedOut = false;
        console.log('Added one administration');
      } catch (e) {
        timedOut = true;
        console.log('--- timeout, retrying PDF creation');
        console.error(e);
      }
    } while (timedOut);
  }

  await browser.close();

  const mergedPdf = await merger.saveAsBuffer();

  console.log('PDF generated successfully');
  return mergedPdf;
}

// funzione per generare la stringa HTML contenente l'export di un singolo questionario
export async function generateAdministrationHTML(
  administration: AdministrationData,
  patient: PatientData,
  therapist: TherapistData,
  showNotes = true,
  showScores = true,
  showResponses = true,
): Promise<string> {
  let html =
    `
    <html>
      <head>

        <title>Export questionari ` +
    patient.name +
    `</title>

        <style>
          @font-face
          {
            font-family: "poppins_regular";
            src: url(data:font/truetype;charset=utf-8;base64,` +
    poppins_regular_base64 +
    `) format("truetype");
          }

          @font-face
          {
            font-family: "poppins_bold";
            src: url(data:font/truetype;charset=utf-8;base64,` +
    poppins_bold_base64 +
    `) format("truetype");
          }

          @page
          {
            margin-bottom: 40;

            @bottom-right
            {
              color: var(--Text-Default, #001E45);
              font-family: 'poppins_regular';
              font-size: 11;
              margin-right: 20;
              content: counter(page) ' di ' counter(pages);
            }

            @bottom-center
            {
              color: var(--Text-Default, #001E45);
              font-family: 'poppins_regular';
              font-size: 11;
              content: 'Data e ora di esportazione: ` +
    new Date().toLocaleString('it') +
    `';
            }
          }

          #header
          {
            position: fixed;
            top: 14;
            margin-left:11;
            margin-right:11;
            width: 750px;
            height: 100px;
            font-size: 11px;
          }

          #header p
          {
            margin:0;
          }

          .bold
          {
            font-family: 'poppins_bold';
          }

          .inline
          {
            display: inline-block;
          }

          .dati_dottore
          {
            width:30%;
            display: inline-block;
          }

          #dati_somministrazione
          {
            width: 100%;
            height: 72px;
            border: 1px solid #003B8A;
            margin-top:33;
            padding-bottom: 5;
          }

          #dati_somministrazione div
          {
            display:inline-block;
          }


          #administration, #note, #scores
          {
            font-size: 14;
            margin-left: 11;
            margin-right: 11;
          }

          #scores
          {
            break-before: avoid;
          }

          #note
          {
            margin-top:0;
          }

          #page_content
          {
            padding-top:200;
            box-decoration-break: clone;
          }

          .section_title
          {
            font-family: "poppins_bold";
            font-size: 14;
            margin-top: 15;
          }

          .table_header
          {
            font-family: "poppins_bold";
            background: #99B7DE;
          }

          .table_header p
          {
            font-size: 12;
          }

          .table_subheader
          {
            font-family: "poppins_bold";
            background: #CCDBEF;
          }

          .table_subheader p
          {
            font-size: 12;
          }

          #istruzioni
          {
            font-size: 11;
            margin-bottom: 10;
          }

          #istruzioni p
          {
            display:inline-block;
            margin:0;
          }

          body
          {
            margin-top:0;
            color: var(--Text-Default, #001E45);
            font-family: "poppins_regular";
            font-weight: 500;
          }

          .risposte, .risposte th, .risposte td, .risultati, .risultati th, .risultati td
          {
            font-size: 14;
            border: 1px solid #003B8A;
            border-collapse: collapse;
            text-align:left;
            padding: 5 10 5;
            vertical-align: center;
          }

          .risposte tr td
          {
            break-inside: avoid;
          }
        </style>

      </head>

      <body>

        <div id="header">



          <div class="dati_dottore">
            <p class="bold">Dott. ` +
    therapist.name +
    `</p>
            <p>Tel ` +
    therapist.phone +
    `</p>
            <p>Email ` +
    therapist.email +
    `</p>
            <p>&nbsp;</p>
          </div>



          <div style="margin-left:7;" class="dati_dottore">
            <p class="bold">Azienda Ospedaliera/Studio</p>
            <p>Dipartimento, Ambulatorio</p>
            <p>Indirizzo</p>
            <p>CAP Città</p>
          </div>



          <div id="dati_somministrazione">

            <div style="margin:11;">
              <p class="bold" style="font-size:14;">` +
    patient.name +
    `</p>
              <p class="inline bold">Data di nascita</p>
              <p class="inline">: ` +
    (patient.dateOfBirth ?? '') +
    `</p><br>
              <p class="inline bold">ID Paziente</p>
              <p class="inline">: ` +
    patient.ID +
    `</p>
            </div>

            <div style="margin-left:17;">
              <p class="inline bold">Sesso</p>
              <p class="inline">: ` +
    (patient.Gender ?? '') +
    `</p><br>
              <p>&nbsp;<p>
            </div>

            <div style="margin-left:90;">
              <p class="bold" style="font-size:14;">` +
    administration.type.toUpperCase() +
    `</p>
              <p class="inline bold">Data di somministrazione</p>
              <p class="inline">: ` +
    administration.data +
    `</p><br>
              <p class="inline bold">Modalità</p>
              <p class="inline">: ` +
    administration.mode +
    `</p>
            </div>

            <div style="margin-left:25;">
              <p class="bold">T` +
    administration.T +
    `</p>
              <p>&nbsp;<p>
            </div>


          </div>

        </div>

        <div id="page_content">` +
    (showNotes
      ? `
            <div id="note">
              <table>
                <thead>
                  <tr>
                    <th style="text-align: left;">
                      <p class="section_title">Note</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                        <p>` +
        administration.notes +
        `</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>`
      : ``);

  if (showScores) {
    // Generazione tabella punteggi
    const administrationTypeModule = (await import(
      'src/features/questionnaires/' + administration.type + '/export.ts'
    )) as QuestionnaireModule;

    html += administrationTypeModule.generateScoresHTML(
      administration.response,
      patient.Gender,
    );
  }

  if (showResponses) {
    // Generazione tabella con le risposte
    const administrationTypeModule = (await import(
      'src/features/questionnaires/' + administration.type + '/export.ts'
    )) as QuestionnaireModule;

    html += administrationTypeModule.generateResponsesHTML(
      administration.response,
    );
  }

  html += `
        </div>
      </body>
    </html>`;

  return html;
}
