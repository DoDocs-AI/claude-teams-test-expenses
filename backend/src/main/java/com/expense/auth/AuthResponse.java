package com.expense.auth;

public class AuthResponse {
    public String token;
    public UserInfo user;

    public AuthResponse() {}

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = new UserInfo(user);
    }

    public static class UserInfo {
        public Long id;
        public String email;
        public String name;

        public UserInfo() {}

        public UserInfo(User user) {
            this.id = user.id;
            this.email = user.email;
            this.name = user.name;
        }
    }
}
