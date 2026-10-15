import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import confetti from "canvas-confetti";

/**
 * Export student portfolio to a high-res, multi-page or single-page A4 PDF
 * @param {HTMLElement} portfolioElement - The container element to capture
 * @param {object} profileData - Profile details for headers and filename
 */
export async function exportPortfolioPDF(portfolioElement, profileData = {}) {
  try {
    const studentName = profileData.name || "Student";
    const fileName = `${studentName.replace(/[^a-zA-Z0-9_-]/g, "_")}_Portfolio.pdf`;

    if (!portfolioElement) {
      throw new Error("Portfolio element not found");
    }

    // Capture crisp raster snapshot
    const dataUrl = await toPng(portfolioElement, {
      quality: 0.98,
      pixelRatio: 2,
      skipFonts: false,
      backgroundColor: "#f8fafc",
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = (img.height * contentWidth) / img.width;

    let heightLeft = contentHeight;
    let position = margin;
    let page = 1;

    // Render multi-page if height exceeds A4 page height
    pdf.addImage(dataUrl, "PNG", margin, position, contentWidth, contentHeight, undefined, "FAST");
    heightLeft -= (pdfHeight - margin * 2);

    while (heightLeft > 0) {
      position = heightLeft - contentHeight + margin;
      pdf.addPage();
      pdf.addImage(dataUrl, "PNG", margin, position, contentWidth, contentHeight, undefined, "FAST");
      heightLeft -= (pdfHeight - margin * 2);
      page++;
    }

    pdf.save(fileName);

    // Confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#2563eb", "#7c3aed", "#10b981", "#f59e0b"],
      });
    } catch (e) {
      // ignore
    }

    return true;
  } catch (error) {
    console.error("Failed to export Portfolio PDF:", error);
    throw error;
  }
}

/**
 * Generate QR code data URL for public portfolio link
 */
export async function generatePortfolioQR(url) {
  try {
    return await QRCode.toDataURL(url, {
      width: 256,
      margin: 1,
      color: {
        dark: "#1e293b",
        light: "#ffffff",
      },
    });
  } catch (e) {
    return null;
  }
}
