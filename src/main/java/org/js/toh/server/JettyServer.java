package org.js.toh.server;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ResourceHandler;

public class JettyServer {

    private static final String PORT_KEY = "PORT";

    public static void main(String[] args) throws Exception {
        Server server = new Server(getPort());
        server.setHandler(createResourceHandler(getBasePath(args, "src/main/webapp")));
        server.start();
        server.join();
    }

    private static String getBasePath(String[] args, String defaultPath) {
        return args.length > 0 ? args[0] : defaultPath;
    }

    private static int getPort() {
        if (System.getenv().containsKey(PORT_KEY)) {
            return Integer.valueOf(System.getenv(PORT_KEY));
        }
        return 8080;
    }

    private static ResourceHandler createResourceHandler(String resourceBase) {
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setResourceBase(resourceBase);
        return resourceHandler;
    }
}
