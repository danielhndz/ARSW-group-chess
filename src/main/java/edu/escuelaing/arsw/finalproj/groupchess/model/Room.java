package edu.escuelaing.arsw.finalproj.groupchess.model;

public class Room {

    private String name;
    private int players;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPlayers() {
        return players;
    }

    public void setPlayers(int players) {
        this.players = players;
    }

    @Override
    public String toString() {
        return "Room [name=" + name + ", players=" + players + "]";
    }

}
