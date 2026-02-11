package com.expense.auth;

import com.expense.common.ConflictException;
import com.expense.common.ValidationException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.wildfly.security.password.PasswordFactory;
import org.wildfly.security.password.interfaces.BCryptPassword;
import org.wildfly.security.password.util.ModularCrypt;
import org.wildfly.security.password.Password;
import org.wildfly.security.password.spec.EncryptablePasswordSpec;
import org.wildfly.security.password.spec.ClearPasswordSpec;
import java.security.spec.InvalidKeySpecException;
import java.security.NoSuchAlgorithmException;

@ApplicationScoped
public class AuthService {

    @Inject
    UserRepository userRepository;

    @Inject
    JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new ConflictException("An account with this email already exists");
        }

        User user = new User();
        user.email = request.email;
        user.passwordHash = hashPassword(request.password);
        user.name = request.name;
        userRepository.persist(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new ValidationException("Invalid email or password"));

        if (!verifyPassword(request.password, user.passwordHash)) {
            throw new ValidationException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user);
    }

    private String hashPassword(String password) {
        try {
            PasswordFactory factory = PasswordFactory.getInstance(BCryptPassword.ALGORITHM_BCRYPT);
            BCryptPassword bcrypt = (BCryptPassword) factory.generatePassword(
                    new EncryptablePasswordSpec(password.toCharArray(), null));
            return ModularCrypt.encodeAsString(bcrypt);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    private boolean verifyPassword(String plainPassword, String hashedPassword) {
        try {
            PasswordFactory factory = PasswordFactory.getInstance(BCryptPassword.ALGORITHM_BCRYPT);
            Password decoded = factory.translate(ModularCrypt.decode(hashedPassword));
            return factory.verify(decoded, plainPassword.toCharArray());
        } catch (Exception e) {
            return false;
        }
    }
}
