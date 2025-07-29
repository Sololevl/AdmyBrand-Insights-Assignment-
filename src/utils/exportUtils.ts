import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId: string, filename: string = 'dashboard-report') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Add metadata
    pdf.setProperties({
      title: 'ADmyBRAND Insights Dashboard Report',
      subject: 'Analytics Dashboard Export',
      author: 'ADmyBRAND Insights',
      creator: 'ADmyBRAND Analytics Platform'
    });

    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

export const exportChartToPDF = async (chartId: string, title: string) => {
  return exportToPDF(chartId, `${title.toLowerCase().replace(/\s+/g, '-')}-chart`);
};

export const exportTableToPDF = async () => {
  return exportToPDF('data-table', 'campaign-performance-table');
};

export const exportFullDashboardToPDF = async () => {
  return exportToPDF('dashboard-content', 'admybrand-insights-dashboard');
};