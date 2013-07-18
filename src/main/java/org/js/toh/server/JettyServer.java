package org.js.toh.server;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ResourceHandler;

public class JettyServer {

    private static final String PORT_KEY = "PORT";

    public static void main(String[] args) throws Exception {
        checkArgs(args);
        Server server = new Server(getPort());
        server.setHandler(createResourceHandler(args[0]));
        server.start();
        server.join();
    }

    private static int getPort() {
        if (System.getenv().containsKey(PORT_KEY)) {
            return Integer.valueOf(System.getenv(PORT_KEY));
        }
        return 8080;
    }

    private static void checkArgs(String[] args) {
        if (args.length < 1) {
            throw new IllegalArgumentException("Please pass in base path");
        }
    }

    private static ResourceHandler createResourceHandler(String resourceBase) {
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setResourceBase(resourceBase);
        return resourceHandler;
    }
}
