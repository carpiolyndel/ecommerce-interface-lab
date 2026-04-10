package Lab6;

import java.math.BigDecimal;

// for negative or zero input
class InvalidInputException extends Exception {
    public InvalidInputException(String msg) { super(msg); }
}

// for insufficient balance
class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String msg) { super(msg); }
}

// base class for all accounts
abstract class Account {
    protected BigDecimal balance;
    
    public Account(BigDecimal initial) {
        this.balance = initial;
    }
    
    public abstract void deposit(BigDecimal amount) throws InvalidInputException;
    public abstract void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException;
    
    public BigDecimal getBalance() {
        return balance;
    }
}

// for accounts with interest
interface InterestBearing {
    BigDecimal calculateInterest();
}

// savings account - has interest
class SavingsAccount extends Account implements InterestBearing {
    private static final BigDecimal RATE = new BigDecimal("0.03"); // 3%
    
    public SavingsAccount(BigDecimal initial) {
        super(initial);
    }
    
    // add money
    @Override
    public void deposit(BigDecimal amount) throws InvalidInputException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Amount must be positive!");
        }
        balance = balance.add(amount);
        System.out.println("Deposited: $" + amount);
    }
    
    // withdraw money
    @Override
    public void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Amount must be positive!");
        }
        if (amount.compareTo(balance) > 0) {
            throw new InsufficientFundsException("Not enough money!");
        }
        balance = balance.subtract(amount);
        System.out.println("Withdrew: $" + amount);
    }
    
    // compute interest
    @Override
    public BigDecimal calculateInterest() {
        return balance.multiply(RATE);
    }
}

// checking account - can go negative
class CheckingAccount extends Account {
    private BigDecimal overdraftLimit;
    
    public CheckingAccount(BigDecimal initial, BigDecimal limit) {
        super(initial);
        this.overdraftLimit = limit;
    }
    
    // add money
    @Override
    public void deposit(BigDecimal amount) throws InvalidInputException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Amount must be positive!");
        }
        balance = balance.add(amount);
        System.out.println("Deposited: $" + amount);
    }
    
    // withdraw money - can go up to overdraft limit
    @Override
    public void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Amount must be positive!");
        }
        
        BigDecimal newBalance = balance.subtract(amount);
        BigDecimal minBalance = overdraftLimit.negate();
        
        if (newBalance.compareTo(minBalance) < 0) {
            throw new InsufficientFundsException("Overdraft limit exceeded!");
        }
        
        balance = newBalance;
        System.out.println("Withdrew: $" + amount);
    }
    
    public BigDecimal getOverdraftLimit() {
        return overdraftLimit;
    }
}

// main class
public class Exercise1 {
    public static void main(String[] args) {
        
        System.out.println("=== BANK ACCOUNT SYSTEM ===\n");
        
        // test savings account
        System.out.println("--- SAVINGS ACCOUNT ---");
        try {
            SavingsAccount save = new SavingsAccount(new BigDecimal("1000"));
            System.out.println("Balance: $" + save.getBalance());
            
            save.deposit(new BigDecimal("500"));
            System.out.println("Balance: $" + save.getBalance());
            
            save.withdraw(new BigDecimal("200"));
            System.out.println("Balance: $" + save.getBalance());
            
            System.out.println("Interest: $" + save.calculateInterest());
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        // test checking account
        System.out.println("\n--- CHECKING ACCOUNT ---");
        try {
            CheckingAccount check = new CheckingAccount(new BigDecimal("500"), new BigDecimal("500"));
            System.out.println("Balance: $" + check.getBalance());
            System.out.println("Overdraft limit: $" + check.getOverdraftLimit());
            
            check.withdraw(new BigDecimal("800"));
            System.out.println("Balance: $" + check.getBalance());
            
            check.deposit(new BigDecimal("400"));
            System.out.println("Balance: $" + check.getBalance());
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        // test exceptions
        System.out.println("\n--- EXCEPTION TESTS ---");
        SavingsAccount acc = new SavingsAccount(new BigDecimal("500"));
        
        try {
            acc.deposit(new BigDecimal("-100"));
        } catch (InvalidInputException e) {
            System.out.println("Caught: " + e.getMessage());
        }
        
        try {
            acc.withdraw(new BigDecimal("1000"));
        } catch (Exception e) {
            System.out.println("Caught: " + e.getMessage());
        }
        
        System.out.println("\n=== DONE ===");
    }
}