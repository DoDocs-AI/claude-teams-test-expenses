package com.expense.budget;

import com.expense.auth.User;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "month", "year"}))
public class Budget extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @Column(nullable = false)
    public int month;

    @Column(nullable = false)
    public int year;

    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal amount;

    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
