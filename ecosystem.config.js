module.exports = {
    apps: [
      {
        name: "nap-works-assignment",
        script: "server.js",
        instances: 1,  // Change "max" to 1 to avoid clustering issues on Render
        exec_mode: "fork", // "cluster" mode sometimes causes issues on Render, use "fork"
        watch: false,
        env: {
          NODE_ENV: "production",
          PORT: process.env.PORT, // Remove default 8000 to allow Render to assign it dynamically
        },
      },
    ],
  };