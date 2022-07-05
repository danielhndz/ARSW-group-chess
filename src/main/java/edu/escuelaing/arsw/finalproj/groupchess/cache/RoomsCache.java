package edu.escuelaing.arsw.finalproj.groupchess.cache;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import edu.escuelaing.arsw.finalproj.groupchess.model.Room;

public class RoomsCache {

    private static final Logger LOGGER = LoggerFactory.getLogger(RoomsCache.class);
    private static HashMap<String, Room> rooms;

    private RoomsCache() {
    }

    public static void addRoom(Room room) {
        if (rooms != null && !rooms.containsKey(room.getName())) {
            rooms.put(room.getName(), room);
            LOGGER.info("room {} added", room);
        }
    }

    public static Map<String, Room> getRooms() {
        if (rooms == null) {
            rooms = new HashMap<>();
        }
        return rooms;
    }
}
