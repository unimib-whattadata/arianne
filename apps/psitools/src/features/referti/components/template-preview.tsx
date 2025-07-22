'use client';

import { useTherapist } from '@/hooks/use-therapist';

interface DatabaseTemplateContent {
  date?: Date | string;
  time?: string;
  sections?: { title?: string; description?: string }[];
  titles?: { content?: string }[];
  paragraphs?: { content?: string }[];
  attachments?: { name?: string; date?: string; type?: string }[];
  theme?: {
    font?: string;
    titleSize?: string;
    paragraphSize?: string;
    primaryColor?: string;
  };
}

interface Template {
  id: string;
  title: string;
  content: unknown;
  createdAt: Date;
  updatedAt: Date;
}

interface TemplatePreviewProps {
  template: Template;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const { user: therapist, userInfo } = useTherapist();

  const getTemplateTheme = () => {
    const defaultTheme = {
      font: 'poppins',
      titleSize: '14',
      paragraphSize: '12',
      primaryColor: '#000000',
    };

    if (template.content && typeof template.content === 'object') {
      const content = template.content as DatabaseTemplateContent;
      if (content.theme) {
        return {
          font: content.theme.font || defaultTheme.font,
          titleSize: content.theme.titleSize || defaultTheme.titleSize,
          paragraphSize:
            content.theme.paragraphSize || defaultTheme.paragraphSize,
          primaryColor: content.theme.primaryColor || defaultTheme.primaryColor,
        };
      }
    }
    return defaultTheme;
  };

  const generateAttachmentTables = (
    attachment: { name?: string; type?: string },
    theme: { primaryColor: string },
  ) => {
    if (attachment.type === 'Somministrazioni') {
      return `
        <div style="margin-top: 1px;">
          <div style="font-weight: bold; font-size: 3.5px; margin-bottom: 0.5px; color: #000;">Risposte Somministrazione</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 3px; margin-bottom: 1px;">
            <thead>
              <tr style="background: ${theme.primaryColor}; color: white;">
                <th style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Domanda</th>
                <th style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Risposta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">1. Come ti senti oggi?</td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Bene</td>
              </tr>
              <tr>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">2. Livello di stress (1-10)</td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">7</td>
              </tr>
              <tr>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">3. Ore di sonno</td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">6</td>
              </tr>
            </tbody>
          </table>
          <div style="font-weight: bold; font-size: 3.5px; margin-bottom: 0.5px; color: #000;">Punteggi</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 3px;">
            <thead>
              <tr style="background: ${theme.primaryColor}; color: white;">
                <th style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Scala</th>
                <th style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Punteggio</th>
                <th style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Interpretazione</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Ansia</td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">15/21</td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Moderata</td>
              </tr>
              <tr>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Depressione</td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">8/21</td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Lieve</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    if (attachment.type === 'Diari') {
      return `
        <div style="margin-top: 1px;">
          <div style="font-weight: bold; font-size: 3.5px; margin-bottom: 0.5px; color: #000;">Contenuto Diario</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 3px;">
            <thead>
              <tr style="background: ${theme.primaryColor}; color: white;">
                <th style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Campo</th>
                <th style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Valore</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;"><strong>Momento del Giorno</strong></td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Mattina</td>
              </tr>
              <tr>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;"><strong>Emozione</strong></td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Ansia</td>
              </tr>
              <tr>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;"><strong>Intensità</strong></td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">7/10</td>
              </tr>
              <tr>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;"><strong>Contesto</strong></td>
                <td style="border: 0.5px solid #000; padding: 0.5px; font-size: 3px;">Lavoro</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    if (attachment.type === 'Note') {
      return `
        <div style="margin-top: 1px;">
          <div style="font-weight: bold; font-size: 3.5px; margin-bottom: 0.5px; color: #000;">${attachment.name}</div>
          <div style="font-size: 3px; color: #666; margin-bottom: 0.5px;">Data di creazione: ${new Date().toLocaleDateString('it-IT')}</div>
          <div style="background-color: #F9FAFB; border-left: 2px solid ${theme.primaryColor}; padding: 1px; font-size: 3px;">
            Questa è una nota di esempio che mostra come apparirebbe il contenuto di una nota nell'export del referto...
          </div>
        </div>
      `;
    }

    return '';
  };

  const generatePreviewHTML = () => {
    if (!template.content || typeof template.content !== 'object') {
      return 'Template vuoto';
    }

    const content = template.content as DatabaseTemplateContent;
    const theme = getTemplateTheme();
    const therapistName = therapist?.user?.name || 'Dott. Nome Cognome';
    const therapistPhone = userInfo?.phone || 'N/A';
    const therapistEmail = therapist?.user?.email || 'N/A';

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
              <div style="font-weight: bold; font-size: 5px; color: #000;">Paziente Demo</div>
              <div style="font-size: 4px;">Data nascita: 01/01/1990</div>
              <div style="font-size: 4px;">ID: DEMO001</div>
            </div>
            <div style="flex: 1;">
              <div style="font-size: 4px;">Sesso: M</div>
              <div style="font-weight: bold; font-size: 5px; color: #000;">REFERTO</div>
              <div style="font-size: 4px;">Data: ${new Date().toLocaleDateString('it-IT')}</div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div style="margin-bottom: 1px;">
          <div style="font-weight: bold; font-size: 5px; border-bottom: 0.5px solid #ccc; padding-bottom: 0.5px; margin-bottom: 1px; color: #000;">${template.title}</div>

          ${
            content.sections && content.sections.length > 0
              ? content.sections
                  .slice(0, 1)
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
            content.titles && content.titles.length > 0
              ? content.titles
                  .slice(0, 1)
                  .map((title) =>
                    title.content
                      ? `<div style="font-weight: bold; font-size: 4px; margin-bottom: 0.5px; color: #000;">${title.content}</div>`
                      : '',
                  )
                  .join('')
              : ''
          }

          ${
            content.paragraphs && content.paragraphs.length > 0
              ? content.paragraphs
                  .slice(0, 1)
                  .map((paragraph) =>
                    paragraph.content
                      ? `<div style="font-size: 4px; margin-bottom: 1px; line-height: 1.2;">${paragraph.content.substring(0, 100)}${paragraph.content.length > 100 ? '...' : ''}</div>`
                      : '',
                  )
                  .join('')
              : ''
          }

          ${
            content.attachments && content.attachments.length > 0
              ? `
                <div style="border-top: 0.5px solid #ccc; padding-top: 1px; margin-top: 1px;">
                  <div style="font-weight: bold; font-size: 4px; margin-bottom: 0.5px; color: #000;">Allegati</div>
                  ${content.attachments
                    .slice(0, 2)
                    .map((attachment) => {
                      if (!attachment.name) return '';
                      return `
                        <div style="background: #e3f2fd; padding: 1px; margin-bottom: 1px; font-size: 3px; border-radius: 1px; border: 0.5px solid #ccc;">
                          <div style="font-weight: bold; font-size: 4px; color: #000; margin-bottom: 0.5px;">${attachment.name}</div>
                          <div style="font-size: 3px; color: #666; margin-bottom: 0.5px;">Tipo: ${attachment.type || 'N/A'} | Data: ${attachment.date || 'N/A'}</div>
                          ${generateAttachmentTables(attachment, theme)}
                        </div>
                      `;
                    })
                    .join('')}
                  ${content.attachments.length > 2 ? `<div style="font-size: 3px; color: #666;">+${content.attachments.length - 2} altri allegati</div>` : ''}
                </div>
              `
              : ''
          }
        </div>

        <!-- Footer -->
        <div style="border-top: 0.5px solid #ccc; padding-top: 0.5px; margin-top: 1px; font-size: 3px; color: #666; display: flex; justify-content: space-between;">
          <span>Data esportazione: ${new Date().toLocaleDateString('it-IT')}</span>
          <span>Pagina 1 di 1</span>
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
