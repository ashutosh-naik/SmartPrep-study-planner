package com.smartprep.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.smartprep.model.Result;
import com.smartprep.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final ResultRepository resultRepository;

    public byte[] generateCertificate(UUID resultId, String email) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));

        if (!result.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("SmartPrep: Study Smarter, Score Higher")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(24)
                .setBold());

        document.add(new Paragraph("CERTIFICATE OF ACHIEVEMENT")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(20)
                .setMarginTop(30));

        document.add(new Paragraph("This is to certify that")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(14)
                .setMarginTop(20));

        document.add(new Paragraph(result.getUser().getName())
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(22)
                .setBold());

        document.add(new Paragraph("has successfully completed the mock test:")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(14)
                .setMarginTop(20));

        document.add(new Paragraph(result.getTest().getTitle())
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(18)
                .setBold());

        document.add(new Paragraph("with a score of " + result.getScore() + "%")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(16)
                .setMarginTop(10));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
        String date = result.getCompletedAt().format(formatter);

        document.add(new Paragraph("Date of Completion: " + date)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(12)
                .setMarginTop(40));

        document.close();
        return baos.toByteArray();
    }
}
