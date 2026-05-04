package com.stockwise.backend.user;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

// User activity log servisini ekle
import com.stockwise.backend.user.UserActivityLogService;

@RestController
@RequestMapping("/api/auth")

public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserActivityLogService userActivityLogService;

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, UserActivityLogService userActivityLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userActivityLogService = userActivityLogService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        var userOpt = userRepository.findByUsernameIgnoreCase(username);
        if (userOpt.filter(user -> passwordEncoder.matches(password, user.getPassword())).isPresent()) {
            var user = userOpt.get();
            userActivityLogService.log(user.getId(), "LOGIN");
            return ResponseEntity.ok(new UserResponse(user.getId(), user.getUsername(), user.getPermission()));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Kullanıcı adı veya şifre hatalı"));
        }
    }
}
