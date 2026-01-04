import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RFQItem, RFQData } from '../types';

const COMPANY_NAME = 'Moja Firma d.o.o.';
const COMPANY_ADDRESS = 'Adresa firme, Grad';
const COMPANY_EMAIL = 'info@mojafirma.rs';
const COMPANY_PHONE = '+381 11 123-4567';

export const generateRFQPDF = (rfqData: RFQData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  doc.setFont('helvetica');

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ZAHTEV ZA PONUDU', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const today = new Date();
  const dateString = today.toLocaleDateString('sr-RS', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const companyInfoWidth = (pageWidth - 2 * margin) / 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('NARUCULAC:', margin, yPosition);
  yPosition += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(COMPANY_NAME, margin, yPosition);
  yPosition += 3;
  doc.text(COMPANY_ADDRESS, margin, yPosition);
  yPosition += 3;
  doc.text(`Email: ${COMPANY_EMAIL}`, margin, yPosition);
  yPosition += 3;
  doc.text(`Tel: ${COMPANY_PHONE}`, margin, yPosition);

  const supplierXStart = margin + companyInfoWidth + 10;
  let supplierY = yPosition - 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DOBAVLJAC:', supplierXStart, supplierY);
  supplierY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(rfqData.supplierName, supplierXStart, supplierY);
  supplierY += 3;
  doc.text(rfqData.supplierAddress, supplierXStart, supplierY);
  supplierY += 3;
  doc.text(`Email: ${rfqData.supplierEmail}`, supplierXStart, supplierY);
  supplierY += 3;
  doc.text(`Datum: ${dateString}`, supplierXStart, supplierY);

  yPosition += 15;

  const tableData = rfqData.items.map((item, index) => [
    String(index + 1),
    item.name,
    item.unit,
    String(item.quantity),
    `${item.unitPrice.toFixed(2)} RSD`,
    `${(item.quantity * item.unitPrice).toFixed(2)} RSD`,
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['R. br', 'Naziv Artikla', 'Jedinica', 'Kolicina', 'Cena po kom', 'Ukupno']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
      valign: 'middle',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'left', cellWidth: 60 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 18 },
      4: { halign: 'right', cellWidth: 28 },
      5: { halign: 'right', cellWidth: 28 },
    },
    margin: { left: margin, right: margin },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  const totalValue = rfqData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`UKUPNA VREDNOST: ${totalValue.toFixed(2)} RSD`, pageWidth - margin, finalY, { align: 'right' });

  const signatureY = finalY + 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Potpis ovlascenog lica: ____________________________', margin, signatureY);
  doc.text('Datum: ____________________________', margin, signatureY + 8);

  return doc;
};

export const downloadRFQPDF = (rfqData: RFQData) => {
  const doc = generateRFQPDF(rfqData);
  const filename = `Zahtev_za_ponudu_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
