/**
 * pm2 start ./pm2.config.js --env production
 * pm2 start /www/pm2.config.js --env production
 * pm2 start /www/pm2.config.js --env development
 * pm2 restart all
 */
module.exports = {
  apps: [
    {
      name: 'bun-server',
      interpreter: "~/.bun/bin/bun", // Path to the Bun interpreter
      script: '/www/zaizai-workspace/packages/bun-server',
      cwd: '/www/zaizai-workspace/packages/bun-server', // 如果配置文件不是在项目目录下就是要加 cwd 工作目录
      watch: ['/www/zaizai-workspace/packages/bun-server'],
      ignore_watch: [
        // 忽视这些目录的变化
        '/www/zaizai-workspace/packages/bun-server/node_modules',
        '/www/zaizai-workspace/packages/bun-server/public',
        '/www/zaizai-workspace/packages/bun-server/logs',
        '/www/zaizai-workspace/packages/bun-server/data',
        '/www/zaizai-workspace/packages/bun-server/cache'
      ],
      autorestart: true, //自动重启
      env_development: {
        ENV: '开发环境',
        NODE_ENV: 'development',
      },
      env_production: {
        ENV: '生成环境',
        NODE_ENV: 'production',
        PORT: 4399,
      },
      error_file: '/www/logs/err.log',
      out_file: '/www/logs/out.log',
    },
  ],
}
