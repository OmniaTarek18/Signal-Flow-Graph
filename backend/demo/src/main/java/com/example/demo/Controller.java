package com.example.demo;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class Controller {
    @GetMapping("routh")
    public String user(@RequestBody String equation) {
        Routh system = new RouthImp(equation);
        System.out.println(equation);
        return system.isStable() ? "System is stable" :  system.rootFinder();
    }
}
