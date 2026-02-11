package com.expense.auth;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
public class JwtService {

    public String generateToken(User user) {
        Set<String> groups = new HashSet<>();
        groups.add("User");

        return Jwt.issuer("expense-tracker")
                .subject(user.id.toString())
                .claim("email", user.email)
                .claim("name", user.name)
                .groups(groups)
                .expiresIn(Duration.ofHours(24))
                .sign();
    }
}
