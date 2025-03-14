module.exports = {
    apps: [
      {
        name: "nap-works-assignment", // The name of the application
        script: "./server.js", // The entry point (Change if different)
        instances: "max", // Uses all available CPU cores
        exec_mode: "cluster", // Enables load balancing
        watch: false, // Prevents auto-restarting on file changes in production
        env: {
          NODE_ENV: "production",
          PORT: 8080, // Ensure it matches Render's settings
        },
      },
    ],
  };