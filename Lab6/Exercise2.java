package Lab6;

import java.util.*;
import java.util.stream.Collectors;

public class Exercise2 {
    
    // record for Order
    record Order(Long id, String desc, int amount) {}
    
    // generates random orders
    static List<Order> orderGenerator(int num) {
        if (num < 100) throw new RuntimeException("Need 100+");
        List<Order> list = new ArrayList<>();
        for (int i = 0; i <= num; i++) {
            long id = (int) (Math.random() * 10);
            list.add(new Order(id, "Order " + id, (int) (Math.random() * 200)));
        }
        return list;
    }
    
    public static void main(String[] args) {
        
        // get 10 orders
        List<Order> orders = orderGenerator(100).subList(0, 10);
        
        // TASK 1: print all
        System.out.println("=== TASK 1: 10 Orders ===");
        for (Order o : orders) {
            System.out.println("ID: " + o.id() + " | " + o.desc() + " | $" + o.amount());
        }
        
        // TASK 2: add new order and sort
        System.out.println("\n=== TASK 2: Add + Sort Descending ===");
        orders.add(new Order(999L, "Special", 175));
        orders.sort((a, b) -> b.amount() - a.amount());
        
        for (Order o : orders) {
            System.out.println("$" + o.amount() + " - " + o.desc());
        }
        
        // TASK 3: filter > 150
        System.out.println("\n=== TASK 3: Orders > $150 ===");
        List<String> high = orders.stream()
            .filter(o -> o.amount() > 150)
            .map(o -> o.desc())
            .collect(Collectors.toList());
        System.out.println(high);
        
        // TASK 4: compute average
        System.out.println("\n=== TASK 4: Average ===");
        double avg = orders.stream()
            .mapToInt(o -> o.amount())
            .average()
            .orElse(0);
        System.out.printf("$%.2f\n", avg);
        
        // TASK 5: group by description and sum
        System.out.println("\n=== TASK 5: Total per Description ===");
        orders.stream()
            .collect(Collectors.groupingBy(o -> o.desc(), Collectors.summingInt(o -> o.amount())))
            .forEach((desc, total) -> System.out.println(desc + ": $" + total));
    }
}