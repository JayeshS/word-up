package org.js.wordup.dao

import com.mongodb.BasicDBObject
import com.mongodb.DB
import com.mongodb.DBCollection
import com.mongodb.DBObject
import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import org.js.wordup.model.Word
import org.springframework.stereotype.Component

@Component
class MongoDictionaryDao {

    MongoClientURI uri = new MongoClientURI("mongodb://dictionaryUser:StickyTape98@dharma.mongohq.com:10009/word-up");
    DB db = new MongoClient(uri).getDB("word-up");
    DBCollection words = db.getCollection("words");

    def find(String word) {

        def cursor = words.find(new BasicDBObject("name", word))
        if (!cursor.hasNext()) {
            return new Word(word: word, definitions: [], error: 'No such word found');
        }

        DBObject dbWord = cursor.next();
        def definitions = dbWord.defns.collect {
            new Word.Definition(pos: it.pos,
                        explanation: it.defn.replaceAll('^# ', '')
                            .replaceAll('\\[\\[', '')
                            .replaceAll('\\]\\]', '')
                            .replaceAll('\\{\\{', '[')
                            .replaceAll('\\}\\}', ']')
            )
        }

        return new Word(word: word, definitions: definitions);
    }
}
