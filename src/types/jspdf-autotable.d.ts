import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: any;
  }
}
