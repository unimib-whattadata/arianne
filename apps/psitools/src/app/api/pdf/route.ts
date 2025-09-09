import type {
  AdministrationData,
  PatientData,
  TherapistData,
} from './export_pdf';
import {
  generateAdministrationHTML,
  generateAdministrationsPDF,
} from './export_pdf';

export async function POST(request: Request) {
  const input = (await request.json()) as {
    patient: PatientData;
    therapist: TherapistData;
    questionnaires: AdministrationData[];
    options: {
      notes: boolean;
      scores: boolean;
      responses: boolean;
    };
  };

  console.log('Export PDF request received: ', input);

  try {
    const HTMLs = [];

    console.log('Generating HTML for each questionnaire for:', {
      questionnaire: input.questionnaires,
    });

    for (const questionnaire of input.questionnaires) {
      const html = await generateAdministrationHTML(
        questionnaire,
        input.patient,
        input.therapist,
        input.options.notes,
        input.options.scores,
        input.options.responses,
      );

      HTMLs.push(html);
    }

    const mergedPdf = await generateAdministrationsPDF(HTMLs);

    return Response.json({
      message: 'PDF generated',
      success: true,
      status: 200,
      pdf: Array.from(mergedPdf),
    });
  } catch (e) {
    console.error(e);
    return Response.json({
      message: 'Error generating PDF',
      success: false,
      status: 500,
    });
  }
}
