package com.stockwise.backend.user;

import com.stockwise.backend.common.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_activity_logs")
public class UserActivityLog extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private StockUser user;

    @Column(nullable = false, length = 255)
    private String action;

    @Column(name = "activity_time", nullable = false)
    private LocalDateTime activityTime;

    public StockUser getUser() {
        return user;
    }

    public void setUser(StockUser user) {
        this.user = user;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public LocalDateTime getActivityTime() {
        return activityTime;
    }

    public void setActivityTime(LocalDateTime activityTime) {
        this.activityTime = activityTime;
    }
}
