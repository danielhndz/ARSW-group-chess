package edu.escuelaing.arsw.finalproj.groupchess.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.escuelaing.arsw.finalproj.groupchess.cache.RoomsCache;
import edu.escuelaing.arsw.finalproj.groupchess.model.Room;
import edu.escuelaing.arsw.finalproj.groupchess.utils.Utils;

@RestController()
@RequestMapping("without-ws")
public class RoomsNoWSController {

    private static final Logger LOGGER = LoggerFactory.getLogger(RoomsNoWSController.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @GetMapping("")
    public ModelAndView index() {
        LOGGER.info("index\n\trooms = {}", RoomsCache.getRooms());
        return Utils.getModelAndView("index-no-ws.html");
    }

    @GetMapping("/")
    public ModelAndView index2() {
        return index();
    }

    @GetMapping("/rooms")
    @SuppressWarnings("java:S2629")
    public String getRooms() {
        try {
            LOGGER.info("getRooms\n\tmessage = {}", MAPPER.writeValueAsString(RoomsCache.getRooms().values()));
            return MAPPER.writeValueAsString(RoomsCache.getRooms().values());
        } catch (JsonProcessingException e) {
            LOGGER.debug(e.getLocalizedMessage(), e);
            return e.getMessage();
        }
    }

    @PostMapping("/rooms")
    public void addRoom(@RequestBody String body, HttpServletResponse response) {
        LOGGER.info("addRoom\n\tbody = {}", body);
        try {
            Room room = MAPPER.readValue(body, Room.class);
            LOGGER.info("addRoom\n\troom = {}", room);
            RoomsCache.addRoom(room);
            response.sendRedirect("/");
        } catch (IOException e) {
            LOGGER.debug(e.getLocalizedMessage(), e);
        }
    }

}
