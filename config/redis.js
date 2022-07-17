require("dotenv").config();

const redis = require("redis");
let client;
(async () => {
  client = redis.createClient({
    url: "redis://" + process.env.REDHOST + ":" + process.env.REDPORT,
  });
  await client.connect();
})();
client.on("connect", () => {
  console.log("connected to redis server");
});

module.exports = {
  get: client.get,
  set: client.set,
};
