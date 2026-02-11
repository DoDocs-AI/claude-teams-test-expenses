package com.expense.category;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import io.quarkus.security.Authenticated;
import java.util.List;

@Path("/api/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class CategoryResource {

    @Inject
    CategoryService categoryService;

    @Inject
    JsonWebToken jwt;

    @GET
    public List<CategoryResponse> getCategories() {
        Long userId = Long.parseLong(jwt.getSubject());
        return categoryService.getAllForUser(userId);
    }

    @POST
    public Response createCategory(@Valid CreateCategoryRequest request) {
        Long userId = Long.parseLong(jwt.getSubject());
        CategoryResponse response = categoryService.createCustomCategory(userId, request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }
}
