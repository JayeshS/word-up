package org.js.wordup

import org.js.wordup.dao.MongoDictionaryDao
import org.js.wordup.model.Word
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.ResponseBody

import java.util.logging.Logger

@SuppressWarnings("GrMethodMayBeStatic")
@Controller
public class WordupController {

    static def logger = Logger.getLogger(WordupController.class.getName())

    @Autowired
    MongoDictionaryDao dao

    @RequestMapping(method = RequestMethod.GET, value = "/define/{word}.json")
    @ResponseBody
    public Word define(@PathVariable String word) throws UnknownHostException {
        logger.info "Received word definition request for: $word"
        return dao.find(word)
    }
}
