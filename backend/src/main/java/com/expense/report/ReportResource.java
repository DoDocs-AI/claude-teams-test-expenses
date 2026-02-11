package com.expense.report;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;
import io.quarkus.security.Authenticated;
import java.time.LocalDate;
import java.util.List;

@Path("/api/reports")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class ReportResource {

    @Inject
    ReportService reportService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("/summary")
    public MonthlySummaryResponse getSummary(
            @QueryParam("month") Integer month,
            @QueryParam("year") Integer year) {
        Long userId = Long.parseLong(jwt.getSubject());
        if (month == null) month = LocalDate.now().getMonthValue();
        if (year == null) year = LocalDate.now().getYear();
        return reportService.getMonthlySummary(userId, month, year);
    }

    @GET
    @Path("/by-category")
    public List<CategoryBreakdownResponse> getByCategory(
            @QueryParam("month") Integer month,
            @QueryParam("year") Integer year) {
        Long userId = Long.parseLong(jwt.getSubject());
        if (month == null) month = LocalDate.now().getMonthValue();
        if (year == null) year = LocalDate.now().getYear();
        return reportService.getSpendingByCategory(userId, month, year);
    }

    @GET
    @Path("/monthly-trend")
    public List<MonthlyTrendResponse> getMonthlyTrend(
            @QueryParam("year") Integer year) {
        Long userId = Long.parseLong(jwt.getSubject());
        if (year == null) year = LocalDate.now().getYear();
        return reportService.getMonthlyTrend(userId, year);
    }
}
