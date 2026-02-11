package com.expense.expense;

import com.expense.common.PaginatedResponse;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import io.quarkus.security.Authenticated;
import java.time.LocalDate;

@Path("/api/expenses")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class ExpenseResource {

    @Inject
    ExpenseService expenseService;

    @Inject
    JsonWebToken jwt;

    @GET
    public PaginatedResponse<ExpenseResponse> getExpenses(
            @QueryParam("category") Long categoryId,
            @QueryParam("startDate") LocalDate startDate,
            @QueryParam("endDate") LocalDate endDate,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        Long userId = Long.parseLong(jwt.getSubject());
        if (size > 100) size = 100;
        return expenseService.getExpenses(userId, categoryId, startDate, endDate, page, size);
    }

    @POST
    public Response createExpense(@Valid CreateExpenseRequest request) {
        Long userId = Long.parseLong(jwt.getSubject());
        ExpenseResponse response = expenseService.createExpense(userId, request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @GET
    @Path("/{id}")
    public ExpenseResponse getExpense(@PathParam("id") Long id) {
        Long userId = Long.parseLong(jwt.getSubject());
        return expenseService.getExpense(userId, id);
    }

    @PUT
    @Path("/{id}")
    public ExpenseResponse updateExpense(@PathParam("id") Long id, @Valid CreateExpenseRequest request) {
        Long userId = Long.parseLong(jwt.getSubject());
        return expenseService.updateExpense(userId, id, request);
    }

    @DELETE
    @Path("/{id}")
    public Response deleteExpense(@PathParam("id") Long id) {
        Long userId = Long.parseLong(jwt.getSubject());
        expenseService.deleteExpense(userId, id);
        return Response.noContent().build();
    }
}
