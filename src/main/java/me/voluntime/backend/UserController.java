package me.voluntime.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    public class User {
        public String userName;
        public String fullName;
        private String email;
        public String zipCode;
        public String organization;
        public boolean verified;
        public String bio;

        public User() {
            this.userName = "poop_butt";
            this.fullName = "Poop Butt";
            this.email = "";
            this.zipCode = "";
            this.organization = "";
            this.verified = false;
            this.bio = "My bio";
        }
    }

    @RequestMapping("")
    public User getUser() {
        return new User();
    }
}
