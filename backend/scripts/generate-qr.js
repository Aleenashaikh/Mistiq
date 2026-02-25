/**
 * QR Code Generator for Mistiq Discount Campaign
 * 
 * Run with: node backend/scripts/generate-qr.js
 * 
 * This generates a QR code that gives visitors a 10% discount
 * when they scan it and visit the website.
 */

import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✏️  Change this to your live website URL before printing/sharing the QR code
const WEBSITE_URL = 'https://www.mistiq-perfumeries.com';
const QR_URL = `${WEBSITE_URL}/?ref=qr`;

const outputPath = path.join(__dirname, 'qr-discount.png');

const options = {
    errorCorrectionLevel: 'H',   // High error correction for printed QR codes
    type: 'png',
    width: 400,
    margin: 2,
    color: {
        dark: '#1a1a1a',            // Dark module colour
        light: '#FFFFFF',           // Light module colour (background)
    },
};

console.log(`\n🎯  Generating QR Code for: ${QR_URL}`);

QRCode.toFile(outputPath, QR_URL, options, (err) => {
    if (err) {
        console.error('❌  Failed to generate QR code:', err);
        process.exit(1);
    }

    console.log(`✅  QR code saved to: ${outputPath}`);
    console.log('\n📋  Instructions:');
    console.log('    1. Open qr-discount.png and print or share it.');
    console.log('    2. When customers scan it, they land on your site with ?ref=qr');
    console.log('    3. The site automatically applies a 10% discount at checkout.');
    console.log(`\n🔗  Full URL encoded in QR: ${QR_URL}\n`);
});
