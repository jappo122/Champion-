import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    // Scrolling is managed against #app-scroll (see ScrollManager in __root.tsx);
    // the window itself never scrolls, so router-level restoration is disabled.
    scrollRestoration: false,
    defaultNotFoundComponent: () => <p>Not found</p>,
  });
}
