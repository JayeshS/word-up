package org.js.wordup.model;

public class Definition {

    private String word;
    private String pos;
    private String definition;

    public Definition(String word, String pos, String definition) {
        this.word = word;
        this.pos = pos;
        this.definition = definition;
    }

    public String getWord() {
        return word;
    }

    public String getPos() {
        return pos;
    }

    public String getDefinition() {
        return definition;
    }
}
