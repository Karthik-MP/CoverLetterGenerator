const PDFDocument = require("pdfkit");
const fs = require("fs");
const printer = require("pdf-to-printer");
function generatePDF(personal, coverLetter, fileName) {
  console.log("Writing to PDF");
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 30 });
    const stream = fs.createWriteStream(fileName);

    doc.pipe(stream);

    // Reduce font size to fit everything on one page
    const smallFontSize = 12;
    const normalFontSize = 12;

    // Adding personal information
    doc
      .fontSize(normalFontSize)
      .text(`${personal.name}`, {
        continued: true,
        align: "left",
        link: `http://${personal.website}`,
        continued: false,
      })
      .fillColor("black");

    doc
      .fontSize(smallFontSize)
      .text(`${personal.address}`, { align: "left" })
      .text(`${personal.city}, ${personal.state} ${personal.zip}`, {
        align: "left",
      })
      .text(`Ph: ${personal.phone}`, { align: "left" })
      .text(`Email: ${personal.email}`, { align: "left" })
      .text(`LinkedIn: ${personal.linkedIn}`, { align: "left" });

    // Add a line break
    doc.moveDown(1);

    // Adding the cover letter (adjust font size for space)
    doc
      .fontSize(smallFontSize)
      .text(coverLetter, { align: "left", continued: false });

    // Add a line break before signature
    doc.moveDown(1);

    // Adding signature at the bottom
    doc.fontSize(normalFontSize).text("Sincerely,", { align: "left" });
    doc.text(`${personal.name}`, { align: "left" });

    doc.end();

    stream.on("finish", () => {
      console.log("PDF generated, now sending to printer...");
      // After the PDF is created, send it to the printer
      printer
        .print(fileName)
        .then(() => {
          console.log("Printed successfully");
          resolve(fileName);
        })
        .catch((err) => {
          console.error("Printing failed: ", err);
          reject(err);
        });
    });
    stream.on("error", reject);
  });
}

module.exports = generatePDF;
