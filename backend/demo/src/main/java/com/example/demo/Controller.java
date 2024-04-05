package com.example.demo;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class Controller {
    @PostMapping("routh")
    public String[] user(@RequestBody String equation) {
        Routh system = new RouthImp(equation);
        System.out.println(equation);
        return system.isStable() ? new String[]{"System is stable"}:  system.rootFinder();
    }
}
