module.exports = {
  apps : [
    {
      name: 'fsys',
      script: './.output/server/index.mjs',
      env: {
        ROOT_DIR:'/Users/chenxuke/',
        PORT:8082
      },
      max_memory_restart: '300M'
    }
  ],
};
