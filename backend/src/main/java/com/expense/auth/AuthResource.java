package com.expense.auth;

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

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService authService;

    @Inject
    JsonWebToken jwt;

    @Inject
    UserRepository userRepository;

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @POST
    @Path("/login")
    public Response login(@Valid LoginRequest request) {
        AuthResponse response = authService.login(request);
        return Response.ok(response).build();
    }

    @GET
    @Path("/me")
    @Authenticated
    public Response me() {
        Long userId = Long.parseLong(jwt.getSubject());
        User user = userRepository.findById(userId);
        if (user == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        return Response.ok(new AuthResponse.UserInfo(user)).build();
    }
}
