package edu.escuelaing.arsw.finalproj.groupchess.model;

public class Room {

    private String name;
    private int players;
    private String fen;
    private static final String FEN_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    public Room() {
        this.fen = FEN_START;
    }

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

    public String getFen() {
        return fen;
    }

    public void setFen(String fen) {
        this.fen = fen;
    }

    @Override
    public String toString() {
        return "Room [fen=" + fen + ", name=" + name + ", players=" + players + "]";
    }

}
