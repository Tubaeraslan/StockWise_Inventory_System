package com.stockwise.backend.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class UserActivityLogService {
    private final UserActivityLogRepository logRepository;
    private final UserRepository userRepository;

    public UserActivityLogService(UserActivityLogRepository logRepository, UserRepository userRepository) {
        this.logRepository = logRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void log(Long userId, String action) {
        StockUser user = userRepository.findById(userId).orElse(null);
        if (user == null) return;
        UserActivityLog log = new UserActivityLog();
        log.setUser(user);
        log.setAction(action);
        log.setActivityTime(LocalDateTime.now());
        logRepository.save(log);
    }
}
