package edu.escuelaing.arsw.finalproj.groupchess.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import edu.escuelaing.arsw.finalproj.groupchess.cache.RoomsCache;
import edu.escuelaing.arsw.finalproj.groupchess.utils.Utils;

@RestController()
public class RoomsController {

    private static final Logger LOGGER = LoggerFactory.getLogger(RoomsController.class);

    @GetMapping("/")
    public ModelAndView index() {
        LOGGER.info("index\n\trooms = {}", RoomsCache.getRooms().values());
        return Utils.getModelAndView("index.html");
    }

    @GetMapping("/room/{roomName}")
    public ModelAndView room() {
        LOGGER.info("room\n\trooms = {}", RoomsCache.getRooms().values());
        return Utils.getModelAndView("room.html");
    }
}
