package org.js.wordup

import org.springframework.context.annotation.Configuration
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter

@Configuration
@EnableWebMvc
class SpringAutoConfig extends WebMvcConfigurerAdapter {

    @Override
    void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        def jsonConverter = new MappingJackson2HttpMessageConverter(prettyPrint: true)
        converters << jsonConverter
    }
}
