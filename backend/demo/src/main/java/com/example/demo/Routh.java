package com.example.demo;

public interface Routh {
    void setEquation(String equation);
    double[] getEquation();
    boolean isStable();
    String rootFinder();
}

