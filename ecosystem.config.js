module.exports = {
  apps : [
    {
      name: 'products',
      script: './server.js',
      exec_mode: 'cluster',
      instances: 3,
      watch: true,
      increment_var: 'PORT',
      env: {
        PORT: 3010,
        NODE_ENV: 'development'
      },
    }
  ]
};