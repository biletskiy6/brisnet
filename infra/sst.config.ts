/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "neo-brisnet",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // Database URL from environment or secret
    const databaseUrl = new sst.Secret("DatabaseUrl");

    // API Gateway with Lambda functions
    const api = new sst.aws.ApiGatewayV2("NeoB risnetApi", {
      cors: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "X-User-Id"],
      },
    });

    // Products API
    api.route("GET /products", {
      handler: "backend/functions/products.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("GET /products/featured", {
      handler: "backend/functions/products.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("GET /products/{id}", {
      handler: "backend/functions/products.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("POST /products", {
      handler: "backend/functions/products.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("PUT /products/{id}", {
      handler: "backend/functions/products.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("DELETE /products/{id}", {
      handler: "backend/functions/products.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    // Cart API
    api.route("GET /cart", {
      handler: "backend/functions/cart.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("POST /cart/items", {
      handler: "backend/functions/cart.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("DELETE /cart/items/{productId}", {
      handler: "backend/functions/cart.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("PATCH /cart/items/{productId}", {
      handler: "backend/functions/cart.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("DELETE /cart", {
      handler: "backend/functions/cart.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    // Checkout API
    api.route("POST /checkout/cash", {
      handler: "backend/functions/checkout.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("POST /checkout/credits", {
      handler: "backend/functions/checkout.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("POST /checkout/mixed", {
      handler: "backend/functions/checkout.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    // Credits API
    api.route("GET /credits/balance", {
      handler: "backend/functions/credits.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("GET /credits/transactions", {
      handler: "backend/functions/credits.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("POST /credits/purchase", {
      handler: "backend/functions/credits.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    // Orders API
    api.route("GET /orders", {
      handler: "backend/functions/orders.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("GET /orders/{id}", {
      handler: "backend/functions/orders.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("GET /access", {
      handler: "backend/functions/orders.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    api.route("GET /downloads/{productId}", {
      handler: "backend/functions/orders.handler",
      link: [databaseUrl],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
    });

    return {
      api: api.url,
    };
  },
});
