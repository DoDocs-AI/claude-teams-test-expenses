package com.expense.category;

import com.expense.auth.User;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
public class Category extends PanacheEntity {

    @Column(nullable = false, length = 50)
    public String name;

    @Column(length = 50)
    public String icon;

    @Column(name = "is_default", nullable = false)
    public boolean isDefault = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    public User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
