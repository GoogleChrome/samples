/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}
const colors = require("./src/colors.json");

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function (request, reply) {
  let params = { seo };
  return reply.view("/src/pages/index.hbs", params);
});

fastify.get(
  "/pages/race-network-and-fetch-handler",
  async function (request, reply) {
    const { result } = request.query;
    // Add delay to let the fetch handler wins the race.
    if (result == "fetch-handler") {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    let params = { seo };
    return reply.view("/src/pages/detail.hbs", params);
  }
);

fastify.get("/pages/:source", function (request, reply) {
  let params = { seo };
  return reply.view("/src/pages/detail.hbs", params);
});

fastify.addHook("onRequest", (request, reply, done) => {
  // Static Routing API Resource Timing
  reply.header(
    "Origin-Trial",
    "Ah97B8r2B/Eb/fB7eTwgN3XNOrc1R+z868DvFdbLOtJjC6Y4qdaECpiY6npivtdDUKRqDhiE3UTIwJpTJDUozQIAAAB9eyJvcmlnaW4iOiJodHRwczovL3N3LXN0YXRpYy1yb3V0aW5nLWRlbW8uZ2xpdGNoLm1lOjQ0MyIsImZlYXR1cmUiOiJTZXJ2aWNlV29ya2VyU3RhdGljUm91dGVyVGltaW5nSW5mbyIsImV4cGlyeSI6MTc1MzE0MjQwMH0="
  );
  done();
});

// This is the exported function that Google Cloud will call.
exports.serviceworker_static_routing = (req, res) => {
  // We need to make sure fastify is "ready" before handling requests.
  fastify.ready(err => {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }
    // Pass the request to the fastify server instance.
    fastify.server.emit('request', req, res);
  });
};
