package com.expense.common;

import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

public class ExceptionMappers {

    @ServerExceptionMapper
    public Response mapNotFoundException(NotFoundException e) {
        return Response.status(Response.Status.NOT_FOUND)
                .entity(new ErrorResponse("NOT_FOUND", e.getMessage()))
                .build();
    }

    @ServerExceptionMapper
    public Response mapValidationException(ValidationException e) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("VALIDATION_ERROR", e.getMessage()))
                .build();
    }

    @ServerExceptionMapper
    public Response mapConflictException(ConflictException e) {
        return Response.status(Response.Status.CONFLICT)
                .entity(new ErrorResponse("CONFLICT", e.getMessage()))
                .build();
    }
}
