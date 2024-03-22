package com.example.demo;
import java.util.ArrayList;
import java.util.Arrays;
import org.apache.commons.math3.analysis.solvers.LaguerreSolver;
import org.apache.commons.math3.complex.Complex;

public class RouthImp implements Routh {

    double[] coeff;

    public RouthImp() {

    }

    public RouthImp(String coeff) {
        this.coeff = parseInput(coeff);
    }


    public void setEquation(String equation) {
        coeff = parseInput(equation);
    }


    public double[] getEquation() {
        return coeff;
    }

    private double[] parseInput(String equation) {
        double[] coefficients = {5, 4, 3, 2, 1};
        return coefficients;
    }


    public boolean isStable() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isStable'");
    }


    public ArrayList<Complex> rootFinder() {
        double []test = {5, 4, 3, 2, 1};
        // Create a solver
        LaguerreSolver solver = new LaguerreSolver();
        // Find the roots
        ArrayList<Complex> roots = new ArrayList<>(Arrays.asList(solver.solveAllComplex(test, 0))); // Finds all complex roots
        for (int i = 0; i < roots.size() ; i++) {
            if(roots.get(i).getReal() < 0) roots.remove(i--); // Remove the LHS roots
        }
        return roots;
    }

}
