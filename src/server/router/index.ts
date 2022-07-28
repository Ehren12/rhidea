// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { likeRouter } from "./like";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", authRouter)
  .merge("post.", postRouter)
  .merge("like.", likeRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
