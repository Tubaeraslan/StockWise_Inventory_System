package com.stockwise.backend.user;

import com.stockwise.backend.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return toResponse(getEntity(id));
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        userRepository.findByUsernameIgnoreCase(request.username()).ifPresent(existing -> {
            throw new IllegalArgumentException("Username already exists: " + request.username());
        });

        StockUser user = new StockUser();
        applyRequest(user, request);
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        StockUser user = getEntity(id);
        userRepository.findByUsernameIgnoreCase(request.username()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new IllegalArgumentException("Username already exists: " + request.username());
            }
        });

        applyRequest(user, request);
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        StockUser user = getEntity(id);
        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public StockUser getEntity(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }


    private void applyRequest(StockUser user, UserRequest request) {
        user.setUsername(request.username().trim());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPermission(request.permission());
    }

    private UserResponse toResponse(StockUser user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getPermission());
    }
}
