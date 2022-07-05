package edu.escuelaing.arsw.finalproj.groupchess.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@Configuration
public class WebSocketConfigurator {

    @Bean
    ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
