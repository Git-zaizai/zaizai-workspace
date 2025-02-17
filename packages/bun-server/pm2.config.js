/**
 * pm2 start ./pm2.config.js --env production
 * pm2 start /www/pm2.config.js --env production
 */
module.exports = {
  apps: [
    {
      name: 'bun-server',
      interpreter: "~/.bun/bin/bun", // Path to the Bun interpreter
      script: '/home/ubuntu/www/zaizai-workspace/packages/bun-server',
      cwd: '/home/ubuntu/www/zaizai-workspace/packages/bun-server', // 如果配置文件不是在项目目录下就是要加 cwd 工作目录
      watch: ['/home/ubuntu/www/zaizai-workspace/packages/bun-server'],
      ignore_watch: [
        // 忽视这些目录的变化
        '/home/ubuntu/www/zaizai-workspace/packages/bun-server/node_modules',
        '/home/ubuntu/www/zaizai-workspace/packages/bun-server/public',
        '/home/ubuntu/www/zaizai-workspace/packages/bun-server/logs',
        '/home/ubuntu/www/zaizai-workspace/packages/bun-server/data',
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
      error_file: '/home/ubuntu/www/logs/err.log',
      out_file: '/home/ubuntu/www/logs/out.log',
    },
  ],
}
