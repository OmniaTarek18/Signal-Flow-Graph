package com.example.demo;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.regex.*;

import org.apache.commons.math3.analysis.solvers.LaguerreSolver;
import org.apache.commons.math3.complex.Complex;

public class RouthImp implements Routh {

    double[] coeff;

    public RouthImp() {

    }

    public RouthImp(String coeff) {
        parseInput(coeff);
    }


    public void setEquation(String equation) {
        parseInput(equation);
    }


    public double[] getEquation() {
        return coeff;
    }

    private void parseInput(String equation) {

        ArrayList<Double> coeff = new ArrayList<>();
        equation = equation.replaceAll(" ", "");
        System.out.println(equation);

        // Define a pattern to match terms in the equation
        Pattern termPattern = Pattern.compile("([-+]?\\d*)x\\^?(\\d+)?");

        // Create a matcher for the equation
        Matcher matcher = termPattern.matcher(equation);

        int end = 0;
        // Iterate over the terms and extract coefficients
        while (matcher.find()) {
            end = matcher.end();
            String coefficientString = matcher.group(1); // Coefficient part of the term
            String exponentString = matcher.group(2); // Exponent part of the term (optional)

            // If coefficient part is empty, it means it's 1
            double coefficient = (coefficientString.isEmpty()) ? 1 : Double.parseDouble(coefficientString);

            // If exponent part is empty, it means it's 1
            int exponent = (exponentString != null) ? Integer.parseInt(exponentString) : 1;
            
            if(coeff.size() <= exponent){
                for(int i = coeff.size(); i <= exponent; i++) coeff.add(0.0);
            }

            coeff.set(exponent, coefficient);
            System.out.println(coeff);
        }
        if(coeff.size() == 0)coeff.add(0.0);
        coeff.set(0, Double.parseDouble(equation.substring(end)));
        System.out.println(coeff);
        
        this.coeff = new double[coeff.size()];
        for(int i = 0; i < coeff.size(); i++) {
            this.coeff[i] = coeff.get(i);
        }
    }


    public boolean isStable() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isStable'");
    }


    public ArrayList<Complex> rootFinder() {
        // Create a solver
        LaguerreSolver solver = new LaguerreSolver();
        // Find the roots
        ArrayList<Complex> roots = new ArrayList<>(Arrays.asList(solver.solveAllComplex(coeff, 0))); // Finds all complex roots
        for (int i = 0; i < roots.size() ; i++) {
            if(roots.get(i).getReal() < 0) roots.remove(i--); // Remove the LHS roots
        }
        return roots;
    }

}
