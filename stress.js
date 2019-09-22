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


/*
export default function() {
  let url = "http://localhost:3004/api/reviews";
  var payload = JSON.stringify({
    title: "Tasty Rubber Tuna",
    review: "Mollitia ea veniam nobis omnis facilis non. Blanditiis et dolorum iure quia veniam rerum. Est voluptate hic rerum magnam suscipit eum sit maxime. Aut in sit libero maxime est non omnis.",
    customerName: "Issac_Jakubowski",
    purchaseData: "2019-09-22",
    productId: 200,
    helpful: 1,
    recommend: 1,
    ratings: {
      overall: 4,
      quality: 4,
      sizing: 5,
      style: 5,
      value: 4,
      comfort: 5
    }
  });

  var params =  { headers: { "Content-Type": "application/json" } }
  http.post(url, payload, params);
  sleep(1);
};
*/