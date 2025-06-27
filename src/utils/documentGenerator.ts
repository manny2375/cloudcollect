import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export interface DebtorData {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  account_number: string;
  original_balance: number;
  current_balance: number;
  status: string;
  creditor_name?: string;
  phones?: Array<{ type: string; number: string; is_primary: boolean }>;
  payments?: Array<{ amount: number; payment_date: string; method: string; status: string }>;
  notes?: Array<{ content: string; created_at: string; created_by: string }>;
}

export const generateDemandLetter = async (debtor: DebtorData, companyInfo?: any) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: companyInfo?.name || 'CloudCollect',
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: companyInfo?.address || '123 Business Ave',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `${companyInfo?.city || 'Chicago'}, ${companyInfo?.state || 'IL'} ${companyInfo?.zip || '60601'}`,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: companyInfo?.phone || '(555) 123-4567',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),

          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 },
          }),

          // Debtor Address
          new Paragraph({
            children: [
              new TextRun({
                text: `${debtor.first_name} ${debtor.last_name}`,
                bold: true,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: debtor.address || '',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `${debtor.city || ''}, ${debtor.state || ''} ${debtor.zip || ''}`,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Subject
          new Paragraph({
            children: [
              new TextRun({
                text: `RE: Account Number ${debtor.account_number}`,
                bold: true,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Salutation
          new Paragraph({
            children: [
              new TextRun({
                text: `Dear ${debtor.first_name} ${debtor.last_name}:`,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Body
          new Paragraph({
            children: [
              new TextRun({
                text: `This letter is to inform you that your account with ${debtor.creditor_name || 'the original creditor'} in the amount of $${debtor.current_balance.toFixed(2)} is seriously past due.`,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Unless you contact our office within thirty (30) days after receiving this notice to dispute the validity of this debt or any portion thereof, this office will assume this debt is valid.',
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'If you notify this office in writing within thirty (30) days from receiving this notice that you dispute the validity of this debt or any portion thereof, this office will obtain verification of the debt or obtain a copy of a judgment and mail you a copy of such judgment or verification.',
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'If you request of this office in writing within thirty (30) days after receiving this notice this office will provide you with the name and address of the original creditor, if different from the current creditor.',
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Please contact our office immediately to resolve this matter.',
              }),
            ],
            spacing: { after: 400 },
          }),

          // Closing
          new Paragraph({
            children: [
              new TextRun({
                text: 'Sincerely,',
              }),
            ],
            spacing: { after: 600 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: companyInfo?.name || 'CloudCollect',
                bold: true,
              }),
            ],
          }),

          // Disclaimer
          new Paragraph({
            children: [
              new TextRun({
                text: 'This communication is from a debt collector and is an attempt to collect a debt. Any information obtained will be used for that purpose.',
                italics: true,
                size: 20,
              }),
            ],
            spacing: { before: 600 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Demand_Letter_${debtor.account_number}_${new Date().toISOString().split('T')[0]}.docx`);
};

export const generateAccountStatement = async (debtor: DebtorData, companyInfo?: any) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: 'ACCOUNT STATEMENT',
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Company Info
          new Paragraph({
            children: [
              new TextRun({
                text: companyInfo?.name || 'CloudCollect',
                bold: true,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `${companyInfo?.address || '123 Business Ave'}, ${companyInfo?.city || 'Chicago'}, ${companyInfo?.state || 'IL'} ${companyInfo?.zip || '60601'}`,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),

          // Account Information
          new Paragraph({
            children: [
              new TextRun({
                text: 'ACCOUNT INFORMATION',
                bold: true,
                underline: {},
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Account Number: ${debtor.account_number}`,
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Debtor: ${debtor.first_name} ${debtor.last_name}`,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Original Creditor: ${debtor.creditor_name || 'N/A'}`,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Original Balance: $${debtor.original_balance.toFixed(2)}`,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Current Balance: $${debtor.current_balance.toFixed(2)}`,
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Status: ${debtor.status.toUpperCase()}`,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Contact Information
          new Paragraph({
            children: [
              new TextRun({
                text: 'CONTACT INFORMATION',
                bold: true,
                underline: {},
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Address: ${debtor.address || 'N/A'}`,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `City, State ZIP: ${debtor.city || ''}, ${debtor.state || ''} ${debtor.zip || ''}`,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Email: ${debtor.email || 'N/A'}`,
              }),
            ],
          }),

          // Phone Numbers
          ...(debtor.phones || []).map(phone => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `Phone (${phone.type}): ${phone.number}${phone.is_primary ? ' (Primary)' : ''}`,
                }),
              ],
            })
          ),

          // Payment History
          new Paragraph({
            children: [
              new TextRun({
                text: 'PAYMENT HISTORY',
                bold: true,
                underline: {},
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          ...(debtor.payments && debtor.payments.length > 0 
            ? debtor.payments.map(payment => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${new Date(payment.payment_date).toLocaleDateString()} - $${payment.amount.toFixed(2)} (${payment.method.toUpperCase()}) - ${payment.status.toUpperCase()}`,
                    }),
                  ],
                })
              )
            : [new Paragraph({
                children: [
                  new TextRun({
                    text: 'No payments recorded',
                    italics: true,
                  }),
                ],
              })]
          ),

          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: `Statement generated on ${new Date().toLocaleDateString()}`,
                italics: true,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Account_Statement_${debtor.account_number}_${new Date().toISOString().split('T')[0]}.docx`);
};

export const generatePaymentAgreement = async (debtor: DebtorData, paymentPlan: any, companyInfo?: any) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: 'PAYMENT AGREEMENT',
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),

          // Parties
          new Paragraph({
            children: [
              new TextRun({
                text: `This Payment Agreement ("Agreement") is entered into on ${new Date().toLocaleDateString()} between ${companyInfo?.name || 'CloudCollect'} ("Company") and ${debtor.first_name} ${debtor.last_name} ("Debtor").`,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Account Information
          new Paragraph({
            children: [
              new TextRun({
                text: 'ACCOUNT INFORMATION',
                bold: true,
                underline: {},
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Account Number: ${debtor.account_number}`,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Total Amount Owed: $${debtor.current_balance.toFixed(2)}`,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Payment Terms
          new Paragraph({
            children: [
              new TextRun({
                text: 'PAYMENT TERMS',
                bold: true,
                underline: {},
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `The Debtor agrees to pay the total amount of $${debtor.current_balance.toFixed(2)} according to the following schedule:`,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Payment schedule would be added here based on paymentPlan parameter

          // Terms and Conditions
          new Paragraph({
            children: [
              new TextRun({
                text: 'TERMS AND CONDITIONS',
                bold: true,
                underline: {},
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '1. All payments must be received by the due date specified.',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '2. Failure to make payments as agreed may result in acceleration of the entire balance.',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '3. This agreement does not waive any rights of the Company to collect the debt.',
              }),
            ],
            spacing: { after: 400 },
          }),

          // Signatures
          new Paragraph({
            children: [
              new TextRun({
                text: 'SIGNATURES',
                bold: true,
                underline: {},
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Debtor: _________________________ Date: _________',
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `${debtor.first_name} ${debtor.last_name}`,
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Company Representative: _________________________ Date: _________',
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: companyInfo?.name || 'CloudCollect',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Payment_Agreement_${debtor.account_number}_${new Date().toISOString().split('T')[0]}.docx`);
};