// Certificate PDF in the browser: loads the images, then uses the shared drawing (certificateDraw.ts).
import type { Certificate } from './elearningApi';
import { certificateFileName, drawCertificate, type CertificateImage } from './certificateDraw';

export { certificateName, certificateVerifyUrl, formatFrenchDate } from './certificateDraw';

async function imageData(url: string): Promise<CertificateImage | null> {
  try {
    const res = await fetch(url);
    if (!res.ok || !(res.headers.get('content-type') || '').startsWith('image/')) return null;
    // The hosting CDN may answer in WebP or JPEG instead of PNG: the image is redrawn
    // and re-encoded as PNG (transparency kept) so that the PDF always receives a clean PNG.
    const objectUrl = URL.createObjectURL(await res.blob());
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = objectUrl;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      return { data: canvas.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

export async function buildCertificatePdf(c: Certificate) {
  const [{ jsPDF }, QRCode, logo, signature] = await Promise.all([
    import('jspdf'),
    import('qrcode').then((m) => m.default),
    imageData('/elearning/logo-cicexf.png'),
    imageData('/elearning/signature.png?v=2')
  ]);
  return drawCertificate({ jsPDF, QRCode }, c, { logo, signature });
}

export async function downloadCertificate(c: Certificate) {
  const doc = await buildCertificatePdf(c);
  doc.save(certificateFileName(c));
}
