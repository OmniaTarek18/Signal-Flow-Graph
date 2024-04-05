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
        parseInput(coeff);
    }

    public void setEquation(String equation) {
        parseInput(equation);
    }

    public double[] getEquation() {
        return coeff;
    }

    // Parse the input to double array(coeff)
    private void parseInput(String equation) {
        equation = equation.replaceAll(" |\\[|\\]", "");
        String[] tmp = equation.split(",");
        ArrayList<Double> handleZeros = new ArrayList<>();
        // When entering {1,-1, 0, 0} it should be {1,-1}, As the rootfinder builtin fn
        // enters infinity loop at {1,-1, 0, 0}
        for (int i = 0; i < tmp.length; i++) {
            handleZeros.add(Double.parseDouble(tmp[i]));
        }
        for (int i = tmp.length - 1; i >= 0; i--) {
            if (handleZeros.get(i) != 0)
                break;
            handleZeros.remove(i);
        }
        this.coeff = new double[handleZeros.size()];
        for (int i = 0; i < this.coeff.length; i++) {
            this.coeff[i] = handleZeros.get(i);
        }
    }

    // Check stability
    public boolean isStable() {
        double[][] routhTable = init_routh_table(); // Initializing routh table
        if (routhTable[0][0] * routhTable[1][0] < 0)
            return false; // Checking the sign
        if (routhTable[1][0] == 0)
            routhTable[1][0] = Double.MIN_VALUE; // Handling division by zero case
        int rows = coeff.length;
        int cols = routhTable[0].length;

        // Apply Routh-Hurwitz criterion
        for (int i = 0; i < rows - 2; i++) {
            for (int j = 1; j < cols; j++) {
                routhTable[i + 2][j- 1] = (routhTable[i + 1][0] * routhTable[i][j] - routhTable[i][0] * routhTable[i + 1][j]) / routhTable[i + 1][0];
            }
            if (isZeroRow(routhTable[i + 2]))
                fixRow(i + 2, routhTable); // Handling zero row case
            if (routhTable[i + 2][0] == 0)
                routhTable[i + 2][0] = Double.MIN_VALUE; // Handling division by zero case
            else if (routhTable[i + 1][0] * routhTable[i + 2][0] < 0)
                return false; // Checking the sign
        }
        return true;
    }

    // It is used in isStable, to check if it is a zero row (special case2)
    private boolean isZeroRow(double[] row) {
        for (double num : row)
            if (num != 0)
                return false;
        return true;
    }

    /*  It is used in isStable, to fix the zero row case
     *  Description : get the derivative of the auxiliary polynomial, and replace the row with it  
     */

    private void fixRow(int row, double[][] routhTable) {
        int pow = routhTable.length - row;
        for (int i = 0; i < routhTable[0].length; i++) {
            routhTable[row][i] = routhTable[row - 1][i] * pow;
            pow -= 2;
        }
    }
   
    // It is used in isStable, fill the first two rows with the coeff before starting 
    private double[][] init_routh_table() {
        int rows = coeff.length;
        int cols = (rows - 1) / 2 + 1; // Get number of cols
        double[][] routhTable = new double[rows][cols];
        // Set the first two rows
        int firstRowCol = 0, secRowCol = 0;
        for (int i = coeff.length - 1; i > -1; i--) {
            if (firstRowCol == secRowCol)
                routhTable[0][firstRowCol++] = coeff[i];
            else
                routhTable[1][secRowCol++] = coeff[i];
        }
        return routhTable;
    }

    // Finds the roots in the RHS
    public String[] rootFinder() {
        // Create a solver
        LaguerreSolver solver = new LaguerreSolver();
        // Find the roots
        ArrayList<Complex> roots = new ArrayList<>(Arrays.asList(solver.solveAllComplex(coeff, 0))); 
        for (int i = 0; i < roots.size(); i++) {
            if (roots.get(i).getReal() < 0)
                roots.remove(i--); // Remove the LHS roots
        }
        return parseOutput(roots);
    }

    // Print o/p
    private String[] parseOutput(ArrayList<Complex> roots) {
        StringBuilder str = new StringBuilder();
        str.append("System is unstable,");
        str.append("Number of roots in the RHS: ");
        str.append(roots.size());
        for (Complex root : roots) {
            str.append(",");
            str.append("Real part: ");
            str.append(String.format("%.4g", root.getReal()));
            str.append("\t");
            str.append("Imaginary part: ");
            str.append(String.format("%.4g", root.getImaginary()));
        }
        return str.toString().split(",");
    }
}
