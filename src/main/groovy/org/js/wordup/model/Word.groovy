package org.js.wordup.model;

public class Word {

    String word
    List<Definition> definitions
    String error

    static class Definition {
        String pos
        String explanation
    }
}
