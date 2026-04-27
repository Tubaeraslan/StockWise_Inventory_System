
package com.stockwise.backend.analysis;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;


@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping("/sales-ranking")
    public List<SalesRankingResponse> getSalesRanking(@RequestParam int year, @RequestParam int month) {
        return analysisService.getSalesRanking(year, month);
    }

    @GetMapping("/overview")
    public AnalysisResponse getOverview() {
        return analysisService.getOverview();
    }
}
