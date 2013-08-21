package org.js.toh.server;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.GzipHandler;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public class JettyServer {

    private static final String PORT_KEY = "PORT";
    private static final String SPRING_ANNOTATIONS_SCAN_PACKAGE = "org.js.wordup";

    public static void main(String[] args) throws Exception {
        Server server = new Server(getPort());

        server.setHandler(createGzipHandler(createApplicationHandlers()));
        server.start();
        server.join();
    }

    private static Handler createGzipHandler(Handler servletContextHandler) {
        GzipHandler gzipHandler = new GzipHandler();
        gzipHandler.setHandler(servletContextHandler);
        return gzipHandler;
    }

    private static Handler createApplicationHandlers() {

        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.addHandler(createResourceHandler("/word-up", "src/main/webapp"));
        contexts.addHandler(createSpringServletContextHandler("/wordup-service"));

        return contexts;
    }

    private static ServletContextHandler createSpringServletContextHandler(String contextPath) {
        final AnnotationConfigWebApplicationContext applicationContext = new AnnotationConfigWebApplicationContext();
        applicationContext.scan(SPRING_ANNOTATIONS_SCAN_PACKAGE);

        final ServletHolder servletHolder = new ServletHolder(new DispatcherServlet(applicationContext));
        final ServletContextHandler context = new ServletContextHandler();
        context.setContextPath(contextPath);
        context.addServlet(servletHolder, "/*");
        return context;
    }

    private static Handler createResourceHandler(String contextPath, String resourceBase) {
        ContextHandler contextHandler = new ContextHandler();
        contextHandler.setContextPath(contextPath);
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setResourceBase(resourceBase);
        contextHandler.setHandler(resourceHandler);
        return contextHandler;
    }

    private static int getPort() {
        if (System.getenv().containsKey(PORT_KEY)) {
            return Integer.valueOf(System.getenv(PORT_KEY));
        }
        return 5000;
    }
}
