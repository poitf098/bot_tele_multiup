module.exports = {
    apps: [
      {
        name: 'multiupApi',
        script: 'test2.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '500M',
      },
      {
        name: 'telegramBot',
        script: 'test3.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '500M',
      },
    ],
  };
  