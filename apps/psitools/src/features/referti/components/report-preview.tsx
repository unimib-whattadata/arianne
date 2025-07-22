'use client';

import { usePatient } from '@/hooks/use-patient';
import { useTherapist } from '@/hooks/use-therapist';

interface BuilderFormData {
  titleField?: string;
  date: Date;
  time: string;
  sections: { title?: string; description?: string }[];
  titles: { content?: string }[];
  paragraphs: { content?: string }[];
  attachments: { id?: string; name?: string; date?: string; type?: string }[];
  theme?: {
    font?: string;
    titleSize?: string;
    paragraphSize?: string;
    primaryColor?: string;
  };
}

interface ReportPreviewProps {
  formData: BuilderFormData;
}

export function ReportPreview({ formData }: ReportPreviewProps) {
  const { user: therapist, userInfo } = useTherapist();
  const { patient } = usePatient();

  const getReportTheme = () => {
    const defaultTheme = {
      font: 'poppins',
      titleSize: '14',
      paragraphSize: '12',
      primaryColor: '#000000',
    };

    if (formData.theme) {
      return {
        font: formData.theme.font || defaultTheme.font,
        titleSize: formData.theme.titleSize || defaultTheme.titleSize,
        paragraphSize:
          formData.theme.paragraphSize || defaultTheme.paragraphSize,
        primaryColor: formData.theme.primaryColor || defaultTheme.primaryColor,
      };
    }
    return defaultTheme;
  };

  const realAttachmentsCount = formData.attachments.filter(
    (attachment) => attachment.id && attachment.id.trim() !== '',
  ).length;

  const generatePreviewHTML = () => {
    const _theme = getReportTheme();
    const therapistName = therapist?.user?.name || 'Dott. Nome Cognome';
    const therapistPhone = userInfo?.phone || 'N/A';
    const therapistEmail = therapist?.user?.email || 'N/A';
    const patientName = patient?.user?.name || 'Paziente Demo';
    const patientBirth = patient?.medicalRecord?.birthDate
      ? typeof patient.medicalRecord.birthDate === 'string'
        ? patient.medicalRecord.birthDate
        : patient.medicalRecord.birthDate.toLocaleDateString('it-IT')
      : '01/01/1990';
    const patientGender = patient?.medicalRecord?.gender || 'M';
    const patientId = patient?.id || 'DEMO001';

    return `
      <div style="font-family: Arial, sans-serif; font-size: 5px; line-height: 1.1; color: #000;">
        <!-- Header -->
        <div style="border-bottom: 0.5px solid #ccc; padding-bottom: 1px; margin-bottom: 1px;">
          <div style="font-weight: bold; font-size: 5px; color: #000;">${therapistName}</div>
          <div style="font-size: 4px; color: #666;">Tel: ${therapistPhone}</div>
          <div style="font-size: 4px; color: #666;">Email: ${therapistEmail}</div>
        </div>

        <!-- Patient Box -->
        <div style="border: 0.5px solid #000; padding: 1px; margin-bottom: 1px; background: #f9f9f9;">
          <div style="display: flex; justify-content: space-between;">
            <div style="flex: 1;">
              <div style="font-weight: bold; font-size: 5px; color: #000;">${patientName}</div>
              <div style="font-size: 4px;">Data nascita: ${patientBirth}</div>
              <div style="font-size: 4px;">ID: ${patientId}</div>
            </div>
            <div style="flex: 1;">
              <div style="font-size: 4px;">Sesso: ${patientGender}</div>
              <div style="font-weight: bold; font-size: 5px; color: #000;">REFERTO</div>
              <div style="font-size: 4px;">Data: ${formData.date.toLocaleDateString('it-IT')}</div>
              <div style="font-size: 4px;">Ora: ${formData.time}</div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div style="margin-bottom: 1px;">
          <div style="font-weight: bold; font-size: 5px; border-bottom: 0.5px solid #ccc; padding-bottom: 0.5px; margin-bottom: 1px; color: #000;">${formData.titleField || 'Referto'}</div>

          ${
            formData.sections && formData.sections.length > 0
              ? formData.sections
                  .slice(0, 2)
                  .map(
                    (section) => `
                    ${section.title ? `<div style="font-weight: bold; font-size: 4px; margin-bottom: 0.5px; color: #000;">${section.title}</div>` : ''}
                    ${section.description ? `<div style="font-size: 4px; margin-bottom: 1px; line-height: 1.2;">${section.description.substring(0, 80)}${section.description.length > 80 ? '...' : ''}</div>` : ''}
                  `,
                  )
                  .join('')
              : ''
          }

          ${
            formData.titles && formData.titles.length > 0
              ? formData.titles
                  .slice(0, 2)
                  .map((title) =>
                    title.content
                      ? `<div style="font-weight: bold; font-size: 4px; margin-bottom: 0.5px; color: #000;">${title.content}</div>`
                      : '',
                  )
                  .join('')
              : ''
          }

          ${
            formData.paragraphs && formData.paragraphs.length > 0
              ? formData.paragraphs
                  .slice(0, 2)
                  .map((paragraph) =>
                    paragraph.content
                      ? `<div style="font-size: 4px; margin-bottom: 1px; line-height: 1.2;">${paragraph.content.substring(0, 100)}${paragraph.content.length > 100 ? '...' : ''}</div>`
                      : '',
                  )
                  .join('')
              : ''
          }

          ${
            formData.attachments && formData.attachments.length > 0
              ? `
                <div style="border-top: 0.5px solid #ccc; padding-top: 1px; margin-top: 1px;">
                  <div style="font-weight: bold; font-size: 4px; margin-bottom: 0.5px; color: #000;">Allegati (${realAttachmentsCount} con dati reali)</div>
                  ${formData.attachments
                    .slice(0, 3)
                    .map((attachment) => {
                      if (!attachment.name) return '';
                      const hasRealData =
                        attachment.id && attachment.id.trim() !== '';
                      return `
                        <div style="background: ${hasRealData ? '#e8f5e8' : '#fff3cd'}; padding: 1px; margin-bottom: 1px; font-size: 3px; border-radius: 1px; border: 0.5px solid #ccc;">
                          <div style="font-weight: bold; font-size: 4px; color: #000; margin-bottom: 0.5px;">${attachment.name}</div>
                          <div style="font-size: 3px; color: #666; margin-bottom: 0.5px;">Tipo: ${attachment.type || 'N/A'} | Data: ${attachment.date || 'N/A'}</div>
                          <div style="font-size: 3px; color: ${hasRealData ? '#006600' : '#856404'};">
                            ${hasRealData ? '✓ Dati reali disponibili' : '⚠ Nessun dato collegato'}
                          </div>
                        </div>
                      `;
                    })
                    .join('')}
                  ${formData.attachments.length > 3 ? `<div style="font-size: 3px; color: #666;">+${formData.attachments.length - 3} altri allegati</div>` : ''}
                </div>
              `
              : ''
          }
        </div>

        <!-- Footer -->
        <div style="border-top: 0.5px solid #ccc; padding-top: 0.5px; margin-top: 1px; font-size: 3px; color: #666; display: flex; justify-content: space-between;">
          <span>Clicca l'icona Eye per vedere il PDF completo con dati reali</span>
          <span>Anteprima</span>
        </div>
      </div>
    `;
  };

  return (
    <div className="relative h-48 w-full overflow-hidden bg-white p-4">
      <div className="h-full w-full overflow-hidden border border-primary bg-white p-1">
        <div
          className="h-full w-full overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: generatePreviewHTML(),
          }}
        />
      </div>
    </div>
  );
}
