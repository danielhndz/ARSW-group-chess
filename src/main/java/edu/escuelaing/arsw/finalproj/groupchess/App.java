package edu.escuelaing.arsw.finalproj.groupchess;

import java.util.Collections;
import java.util.Scanner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {

    private static final Logger LOGGER = LoggerFactory.getLogger(App.class);
    private static final String[] COMMANDS = { "shutdown", "off" };

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(App.class);
        app.setDefaultProperties(Collections.singletonMap("server.port", getPort()));
        app.run(args);

        Scanner in = new Scanner(System.in);

        while (in.hasNext()) {
            String msg = in.next();
            LOGGER.info("Input : {}", msg);
            if (msg.equals("?")) {
                for (String c : COMMANDS) {
                    LOGGER.info(c);
                }
            } else if (msg.equalsIgnoreCase("shutdown") || msg.equalsIgnoreCase("off")) {
                System.exit(0);
            }
        }

        in.close();
    }

    private static int getPort() {
        if (System.getenv("PORT") != null) {
            return Integer.parseInt(System.getenv("PORT"));
        }
        return 5000;
    }

}
