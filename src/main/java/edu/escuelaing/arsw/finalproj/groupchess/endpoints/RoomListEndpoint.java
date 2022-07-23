package edu.escuelaing.arsw.finalproj.groupchess.endpoints;

import java.io.IOException;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedDeque;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.escuelaing.arsw.finalproj.groupchess.cache.RoomsCache;
import edu.escuelaing.arsw.finalproj.groupchess.model.Room;

@Component
@ServerEndpoint("/rooms")
public class RoomListEndpoint {

    private static final Logger LOGGER = LoggerFactory.getLogger(RoomListEndpoint.class);
    private static Queue<Session> queue = new ConcurrentLinkedDeque<>();
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @OnOpen
    public static void onOpen(Session session) {
        if (!queue.contains(session)) {
            queue.add(session);
        }
        LOGGER.info("Connection opened.");
        try {
            session.getBasicRemote().sendText("Connection established.");
            if (!RoomsCache.getRooms().values().isEmpty()) {
                session.getBasicRemote().sendText(MAPPER.writeValueAsString(RoomsCache.getRooms().values()));
            }
        } catch (IOException e) {
            LOGGER.debug(e.getLocalizedMessage(), e);
        }
    }

    @OnMessage
    public static void processNewRoom(String msg, Session session) {
        LOGGER.info("\n\tRoom received: \n\t{}. \n\tFrom session: \n\t{}", msg, session);
        try {
            Room roomReceived = MAPPER.readValue(msg, Room.class);
            LOGGER.info("\n\t{}", roomReceived);
            if (!RoomsCache.getRooms().containsKey(roomReceived.getName())) {
                RoomsCache.addRoom(roomReceived);
                sendRooms();
            }
        } catch (JsonProcessingException e) {
            LOGGER.debug(e.getLocalizedMessage(), e);
        }
    }

    @OnClose
    public static void onClose(Session session) {
        queue.remove(session);
        try {
            session.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        LOGGER.info("Connection closed.");
    }

    @OnError
    public void onError(Session session, Throwable t) {
        queue.remove(session);
        LOGGER.info(t.getMessage());
        LOGGER.info("Connection error.");
    }

    public static void sendRooms() {
        String roomsJSON;
        try {
            roomsJSON = MAPPER
                    .writeValueAsString(RoomsCache.getRooms().values());
            for (Session session : queue) {
                LOGGER.info("\n\tSending rooms : \n\t{}", roomsJSON);
                session.getBasicRemote().sendText(roomsJSON);
            }
        } catch (IOException e) {
            LOGGER.debug(e.getLocalizedMessage(), e);
        }
    }

}
