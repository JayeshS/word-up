package org.js.wordup.model;

public class Word {

    String word
    def definitions = []
    String error

    static class Definition {
        String pos
        String explanation
    }
}
