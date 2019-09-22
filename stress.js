import http from "k6/http";
import { sleep } from "k6";

export let options = {
  vus: 200,
  duration: "30s"
};

export default function() {
  let response = http.get("http://localhost:3004");
  sleep(1);
};