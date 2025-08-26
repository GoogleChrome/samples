const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false
});

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-multipart"));

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

function getMimeTypeParams(request) {
  let params = {
    mimeType: "image/*"
  };
  if (request.query.mime) {
    params['mimeType'] = request.query.mime;
  }
  return params;
}

// Our home page route, this pulls from src/pages/index.hbs
fastify.get("/", function(request, reply) {
  let params = getMimeTypeParams(request);
  reply.view("/src/pages/index.hbs", params);
});

fastify.get("/manifest.json", function(request, reply) {
  let params = getMimeTypeParams(request);
  reply.type("application/json").view("/src/pages/manifest.json.hbs", params);
});

fastify.post("/share", async function(request, reply) {
  let params = getMimeTypeParams(request);
  const files = await request.saveRequestFiles()
  
  params["files"] = [];
  for (const file of files) {
    params["files"].push({filename: file.filename, type: file.mimetype});
  }
  
  return reply.view("/src/pages/share.hbs", params);
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
