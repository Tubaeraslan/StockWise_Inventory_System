package com.stockwise.backend.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        if (userRepository.findByUsernameIgnoreCase(username)
                .filter(user -> passwordEncoder.matches(password, user.getPassword())).isPresent()) {
            var user = userRepository.findByUsernameIgnoreCase(username).get();
            return ResponseEntity.ok(new UserResponse(user.getId(), user.getUsername(), user.getPermission()));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Kullanıcı adı veya şifre hatalı"));
        }
    }
}
