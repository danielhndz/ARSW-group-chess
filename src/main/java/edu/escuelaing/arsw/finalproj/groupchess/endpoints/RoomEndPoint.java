package edu.escuelaing.arsw.finalproj.groupchess.endpoints;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.escuelaing.arsw.finalproj.groupchess.cache.RoomsCache;
import edu.escuelaing.arsw.finalproj.groupchess.model.Room;

@Component
@ServerEndpoint("/room/{roomName}")
public class RoomEndPoint {

    private static final Logger LOGGER = LoggerFactory.getLogger(RoomEndPoint.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static ConcurrentHashMap<String, Session> users = new ConcurrentHashMap<>();
    private static ConcurrentHashMap<String, Boolean> readyUsers = new ConcurrentHashMap<>();
    private static Room room;

    @OnOpen
    public static void onOpen(@PathParam("roomName") String roomName, Session session) {
        LOGGER.info("Connection opened.");
        if (room == null) {
            room = RoomsCache.getRooms().get(roomName);
        }
        LOGGER.info("Room: {}", room);
        LOGGER.info("session.id = {}", session.getId());
        if (!users.containsKey(session.getId())) {
            users.put(session.getId(), session);
            readyUsers.put(session.getId(), false);
            room.setPlayers(room.getPlayers() + 1);
            sendRoom();
            sendReadyUsers();
            RoomListEndpoint.sendRooms();
        }
        try {
            session.getBasicRemote().sendText("Connection established.");
            session.getBasicRemote().sendText("session id " + session.getId());
        } catch (IOException e) {
            LOGGER.debug(e.getLocalizedMessage(), e);
        }
    }

    @SuppressWarnings({
            "java:S2629",
            "java:S1192"
    })
    @OnMessage
    public static void onMessage(String msg, Session session) {
        LOGGER.info("Message received: \n\t{}. \n\tFrom session: \n\t{}", msg, session.getId());
        if (msg.equals("user ready")) {
            readyUsers.put(session.getId(), true);
            sendReadyUsers();
        } else if (msg.startsWith("board ")) {
            LOGGER.info("Board received: \n\t{}", msg);
            room.setFen(msg.replaceFirst("board ", ""));
            sendBoard();
        }
    }

    @OnClose
    public static void onClose(Session session) {
        users.remove(session.getId());
        readyUsers.remove(session.getId());
        if (room.getPlayers() > 0) {
            room.setPlayers(room.getPlayers() - 1);
        }
        sendRoom();
        sendReadyUsers();
        RoomListEndpoint.sendRooms();
        try {
            session.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        LOGGER.info("Connection closed.");
    }

    @OnError
    public void onError(Session session, Throwable t) {
        users.remove(session.getId());
        readyUsers.remove(session.getId());
        room.setPlayers(room.getPlayers() - 1);
        sendRoom();
        sendReadyUsers();
        RoomListEndpoint.sendRooms();
        LOGGER.info(t.getMessage());
        LOGGER.info("Connection error.");
    }

    private static void sendReadyUsers() {
        String readyUsersJSON;
        try {
            readyUsersJSON = MAPPER.writeValueAsString(readyUsers);
            for (Session session : users.values()) {
                LOGGER.info("\n\tSending ready users : \n\t{}", readyUsersJSON);
                session.getBasicRemote().sendText("ready users " + readyUsersJSON);
            }
        } catch (IOException e) {
            LOGGER.debug(e.getLocalizedMessage(), e);
        }
    }

    private static void sendRoom() {
        String roomJSON;
        try {
            roomJSON = MAPPER.writeValueAsString(room);
            for (Session session : users.values()) {
                LOGGER.info("\n\tSending room : \n\t{}", roomJSON);
                session.getBasicRemote().sendText("room " + roomJSON);
            }
        } catch (IOException e) {
            LOGGER.debug(e.getLocalizedMessage(), e);
        }
    }

    private static void sendBoard() {
        try {
            for (Session session : users.values()) {
                LOGGER.info("\n\tSending board : \n\t{}", room.getFen());
                session.getBasicRemote().sendText("board " + room.getFen());
            }
        } catch (IOException e) {
            LOGGER.debug(e.getLocalizedMessage(), e);
        }
    }
}
