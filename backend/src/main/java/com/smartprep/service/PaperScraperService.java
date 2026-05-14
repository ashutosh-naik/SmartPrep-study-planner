package com.smartprep.service;

import com.smartprep.model.Paper;
import com.smartprep.repository.PaperRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaperScraperService {

    private final PaperRepository paperRepository;
    private static final String BASE_URL = "http://collegecirculars.unipune.ac.in/sites/examdocs/";

    public void scrapeSPPU(String courseName, int year) {
        log.info("🚀 SCRAPER START: Course={}, Year={}", courseName, year);
        
        List<String> sessionUrls = getSessionUrlsForYear(year);
        List<String> patterns = getPatternsForCourse(courseName);

        for (String sessionUrl : sessionUrls) {
            for (String pattern : patterns) {
                String fullUrl = BASE_URL + sessionUrl + "/" + pattern;
                
                log.info("🔍 Testing URL: {}", fullUrl);
                
                if (validateUrl(fullUrl)) {
                    log.info("✅ VALID URL FOUND: {}", fullUrl);
                    String sessionName = sessionUrl.replace("%20", " ").replace("  ", " ");
                    savePaper("SPPU", courseName, sessionName, year, fullUrl);
                }
            }
        }
    }

    private List<String> getSessionUrlsForYear(int year) {
        List<String> urls = new ArrayList<>();
        switch (year) {
            case 2025:
                urls.add("APRIL%20%202025");
                break;
            case 2024:
                urls.add("November%20%202024");
                urls.add("April2024");
                break;
            case 2023:
                urls.add("OCTOBER%20%202023");
                urls.add("APRIL%20%202023");
                break;
            case 2022:
                urls.add("OCT%20%202022");
                urls.add("APRIL2022");
                break;
        }
        return urls;
    }

    private List<String> getPatternsForCourse(String course) {
        List<String> patterns = new ArrayList<>();
        if ("MCA".equalsIgnoreCase(course)) {
            patterns.add("M.C.A%20(%202024%20_PATTERN%20).pdf");
            patterns.add("M.C.A%20(%202024%20PATTERN%20).pdf");
            patterns.add("M.C.A%20(%202020_PATTERN%20).pdf");
            patterns.add("M.C.A%20(%202020%20PATTERN%20).pdf");
            patterns.add("M.C.A%20(%202019%20PATTERN%20).pdf");
            patterns.add("M.C.A%20%202019%20PATTERN.pdf");
            patterns.add("M.C.A%20(%20MANAGEMENT%20)%202019%20PATTERN.pdf");
            patterns.add("MCA%20(%20MANAGEMENT%20)%202020%20PATTERN.pdf");
            patterns.add("MCA%20(%20MANAGEMENT%20)%202019%20PATTERN.pdf");
        } else if ("MBA".equalsIgnoreCase(course)) {
            patterns.add("M.B.A%20(%202024%20PATTERN%20).pdf");
            patterns.add("M.B.A%20(%202019%20PATTERN%20).pdf");
            patterns.add("M.B.A%20(%202019%20REVISED%20PATTERN%20).pdf");
            patterns.add("M.B.A%20(%202019%20Revised%20%20Pattern%20).pdf");
            patterns.add("M.B.A%20(2019%20Revised%20Pattern).pdf");
            patterns.add("M.B.A%20(%202021%20PATTERN%20).pdf");
            patterns.add("M.B.A%20(%202016%20PATTERN%20).pdf");
            patterns.add("M.B.A%20(%20I.T%20)%202024%20PATTERN.pdf");
            patterns.add("M.B.A.%20(I.T.)%202024%20PATTERN.pdf");
            patterns.add("M.B.A%20(%20I.T%20)%202020%20PATTERN.pdf");
            patterns.add("M.B.A%20(%20I.T%20)%20%202020%20PATTERN.pdf");
            patterns.add("M.B.A.%20(I.T.)%202020%20PATTERN.pdf");
            patterns.add("M.B.A.%20(HRD)%202024%20PATTERN.pdf");
            patterns.add("M.B.A.%20(HRD)%202020%20PATTERN.pdf");
            patterns.add("M.B.A%20(H.R.D%20)%202020%20PATTERN.pdf");
            patterns.add("M.B.A.(HRD)%202020%20PATTERN.pdf");
        }
        return patterns;
    }

    private boolean validateUrl(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET"); // Changed to GET as some servers block HEAD
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            connection.setConnectTimeout(8000);
            connection.setReadTimeout(8000);
            
            int responseCode = connection.getResponseCode();
            connection.disconnect();
            return (responseCode == 200);
        } catch (Exception e) {
            log.error("❌ Validation error for {}: {}", urlString, e.getMessage());
            return false;
        }
    }

    private void savePaper(String uni, String course, String session, int year, String url) {
        if (paperRepository.findByPdfUrl(url).isEmpty()) {
            Paper paper = Paper.builder()
                    .university(uni)
                    .course(course)
                    .session(session)
                    .year(year)
                    .pdfUrl(url)
                    .sourceUrl(BASE_URL)
                    .fileExistsStatus(true)
                    .fetchedAt(LocalDateTime.now())
                    .build();
            paperRepository.save(paper);
            log.info("💾 SAVED TO DATABASE: {} - {} - {}", uni, course, session);
        }
    }
}
