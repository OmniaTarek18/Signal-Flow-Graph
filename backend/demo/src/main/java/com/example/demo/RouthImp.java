package com.example.demo;

import java.util.ArrayList;
import java.util.Arrays;

import org.apache.commons.math3.analysis.polynomials.PolynomialFunction;
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

    // Function to parse the input to double array, aka coeff
    private void parseInput(String equation) {

        equation = equation.replaceAll(" |\\[|\\]", "");
        String []tmp = equation.split(","); 
        this.coeff = new double[tmp.length];

        for(int i = 0; i < coeff.length; i++){
            this.coeff[i] = Double.parseDouble(tmp[i]);
        }
    }

    public boolean isStable() {
        double [][]routhTable = init_routh_table(); // Initializing  routh table
        if(routhTable[0][0] * routhTable[1][0] < 0) return false;
        int rows = coeff.length;
        int cols = routhTable[0].length;

        // Apply RH 
        for(int i = 0; i < rows - 2; i++){
            for(int j = 1; j < cols; j++){
                routhTable[i+2][j - 1] = (routhTable[i + 1][0] * routhTable[i][j] - routhTable[i][0] * routhTable[i + 1][j]) / routhTable[i+1][0];
            }
            if(isZeroRow(routhTable[i+2])) fixRow(i+2, routhTable); // Handling zero row case
            if(routhTable[i+2][0] == 0) routhTable[i+2][0] = Double.MIN_VALUE; // Handling division by zero case
            else if(routhTable[i+1][0] * routhTable[i+2][0] < 0){
                for(int k = 0; k < rows; k++){
                    for(int j = 0; j < cols; j++){
                        System.out.print(routhTable[k][j]+ " ");
                    }
                    System.out.println();
                }
                return false; }// Checking the sign
        }
        for(int i = 0; i < rows; i++){
            for(int j = 0; j < cols; j++){
                System.out.print(routhTable[i][j]+ " ");
            }
            System.out.println();
        }
        return true;
    }

    private boolean isZeroRow(double[] row) {
        for(double num : row) if(num != 0) return false;
        return true;
    }

    private void fixRow(int row, double[][] routhTable) {
        int pow = routhTable.length - row;
        for(int i = 0; i < routhTable[0].length; i++){
            routhTable[row][i] = routhTable[row - 1][i] * pow;
            pow -= 2;
        }
    }

    private double[][]  init_routh_table() {
        // Get number of cols
        int rows = coeff.length;
        int cols = 0;
        int tmp = rows - 1;
        while(tmp >= 0){
            tmp -= 2;
            cols ++;
        }
        double[][] routhTable = new double[rows][cols];

        // Set the first two rows
        int firstRowCol = 0, secRowCol = 0;
        for(int i = coeff.length - 1; i > -1; i--){
            if(firstRowCol == secRowCol) routhTable[0][firstRowCol++] = coeff[i];
            else routhTable[1][secRowCol++] = coeff[i];
        }

        return routhTable;
    }

    public String rootFinder() {
        PolynomialFunction poly = new PolynomialFunction(coeff);
        System.out.println(poly);
        // Create a solver
        LaguerreSolver solver = new LaguerreSolver();
        // Find the roots
        ArrayList<Complex> roots = new ArrayList<>(Arrays.asList(solver.solveAllComplex(coeff, 0))); // Finds all complex roots
                                                                                                      
        for (int i = 0; i < roots.size(); i++) {
            if (roots.get(i).getReal() < 0)
                roots.remove(i--); // Remove the LHS roots
        }
        return parseOutput(roots);
    }

    private String parseOutput(ArrayList<Complex> roots) {
        StringBuilder str = new StringBuilder();
        str.append("System is unstable\n");
        str.append("Number of roots in the RHS: ");
        str.append(roots.size());
        for(Complex root: roots){
            str.append("\n");
            str.append("Real part: ");
            str.append(String.format("%.4g", root.getReal()));
            str.append("\t");
            str.append("Imaginary part: ");
            str.append(String.format("%.4g", root.getImaginary()));
        }
        return str.toString();
    }

}
