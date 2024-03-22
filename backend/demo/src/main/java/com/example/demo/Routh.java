package com.example.demo;

import java.util.ArrayList;
import org.apache.commons.math3.complex.Complex;


public interface Routh {
    void setEquation(String equation);
    double[] getEquation();
    boolean isStable();
    ArrayList<Complex> rootFinder();
}

