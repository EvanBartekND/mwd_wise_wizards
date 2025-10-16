import React from "react";
import Parse from "parse";
import Components from "./Components/Components"
import * as env from "./environments.js"

Parse.initialize(env.APPLICATION_ID, env.JAVASCRIPT_KEY);
Parse.serverURL = env.SERVER_URL; 

export default function App() {
  return (
    <Components/>
  );
}


