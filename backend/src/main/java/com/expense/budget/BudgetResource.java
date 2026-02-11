package com.expense.budget;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;
import io.quarkus.security.Authenticated;
import java.time.LocalDate;

@Path("/api/budgets")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class BudgetResource {

    @Inject
    BudgetService budgetService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("/monthly")
    public BudgetResponse getMonthlyBudget(
            @QueryParam("month") Integer month,
            @QueryParam("year") Integer year) {
        Long userId = Long.parseLong(jwt.getSubject());
        if (month == null) month = LocalDate.now().getMonthValue();
        if (year == null) year = LocalDate.now().getYear();
        return budgetService.getMonthlyBudget(userId, month, year);
    }

    @PUT
    @Path("/monthly")
    public BudgetResponse setMonthlyBudget(@Valid BudgetRequest request) {
        Long userId = Long.parseLong(jwt.getSubject());
        return budgetService.setMonthlyBudget(userId, request);
    }
}
