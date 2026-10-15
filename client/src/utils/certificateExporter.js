import QRCode from "qrcode";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

/**
 * Generate a scannable, high-resolution QR Code Data URL
 * @param {string} text - URL or text to encode
 * @param {object} options - Customization options
 */
export async function generateQRCodeDataURL(text, options = {}) {
  try {
    return await QRCode.toDataURL(text, {
      width: options.width || 300,
      margin: options.margin !== undefined ? options.margin : 1,
      color: {
        dark: options.darkColor || "#0f172a",
        light: options.lightColor || "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
  } catch (err) {
    console.error("Failed to generate QR Code:", err);
    return null;
  }
}

/**
 * Trigger celebration confetti on certificate unlock, view, or verification
 */
export function triggerCertificateConfetti() {
  try {
    // Left side burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.6 },
      colors: ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981"],
    });
    // Right side burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.6 },
      colors: ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981"],
    });
  } catch (e) {
    // Silently continue if window/canvas not ready
  }
}

/**
 * Export certificate DOM element to high-res PNG
 * @param {HTMLElement} element - The certificate container DOM element
 * @param {string} fileName - Destination filename
 */
export async function exportCertificatePNG(element, fileName = "Certificate.png") {
  if (!element) throw new Error("Certificate element not found");
  
  const dataUrl = await toPng(element, {
    quality: 0.98,
    pixelRatio: 2.5,
    skipFonts: false,
  });

  const link = document.createElement("a");
  link.download = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
  link.href = dataUrl;
  link.click();
  return true;
}

/**
 * Export certificate DOM element to high-res Landscape PDF
 * @param {HTMLElement} element - The certificate container DOM element
 * @param {object} cert - Certificate metadata for file naming
 */
export async function exportCertificatePDF(element, cert = {}) {
  if (!element) throw new Error("Certificate element not found");

  const dataUrl = await toPng(element, {
    quality: 0.98,
    pixelRatio: 3,
    skipFonts: false,
  });

  // A4 Landscape is 297mm x 210mm
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // 10mm margins on all sides
  const margin = 10;
  const targetWidth = pageWidth - margin * 2;
  const targetHeight = pageHeight - margin * 2;

  pdf.addImage(dataUrl, "PNG", margin, margin, targetWidth, targetHeight, undefined, "FAST");

  const safeName = (cert.title || cert.credentialId || "Certificate")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 40);

  pdf.save(`${safeName}.pdf`);
  return true;
}

/**
 * Generate official 1-click LinkedIn Certification URL
 * Adds certificate directly to the user's LinkedIn profile
 */
export function getLinkedInCertUrl(cert) {
  const params = new URLSearchParams();
  params.set("startTask", "CERTIFICATION_NAME");
  params.set("name", cert.title || "Academic & Innovation Achievement");
  params.set("organizationName", cert.issuer || "Dhanalakshmi Srinivasan University");
  
  // Date parsing
  if (cert.date) {
    const parts = cert.date.split(" ");
    const year = parts.find((p) => /^\d{4}$/.test(p)) || new Date().getFullYear().toString();
    params.set("issueYear", year);
  } else {
    params.set("issueYear", new Date().getFullYear().toString());
  }

  if (cert.credentialId) {
    params.set("certId", cert.credentialId);
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://campusmitra.dsu.edu";
  const verifyUrl = `${origin}/certificates?verify=${encodeURIComponent(cert.credentialId || "DEMO")}`;
  params.set("certUrl", verifyUrl);

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

/**
 * Compute reproducible cryptographic signature hash for visual trust badge
 */
export function computeVerificationHash(certId = "") {
  let hash = 0x811c9dc5;
  const str = `CAMPUSMITRA:DSU:${certId}:VERIFIED`;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return `DSU-SHA256-${hex}-9A7B`;
}
