# TODO

## 关于在本地引入 vitepress-md-renderer-web 的问题

在 workspace 引入 这个要记得打包后引入，先去 vitepress-md-renderer-web 下执行 pnpm build后 在piece-zaizai才能使用
因为当初就是使用打包后的文件  本意是因为在 piece-zaizai打包可能会造的打包多了，然后 vitepress-md-renderer-web 也是本意做插件

## docker 安装 nginx 
https://blog.csdn.net/BThinker/article/details/123507820
https://blog.csdn.net/m0_74823863/article/details/144793022

# 创建挂载目录
mkdir -p /root/nginx/conf
mkdir -p /root/nginx/log
mkdir -p /root/nginx/html

# 生成容器
docker run --name nginx -p 9001:80 -d nginx
# 将容器nginx.conf文件复制到宿主机
docker cp nginx:/etc/nginx/nginx.conf /root/nginx/conf/nginx.conf
# 将容器conf.d文件夹下内容复制到宿主机
docker cp nginx:/etc/nginx/conf.d /root/nginx/conf/conf.d
# 将容器中的html文件夹复制到宿主机
docker cp nginx:/usr/share/nginx/html /root/nginx/



docker run \
-p 80:9002 \
-p 443:9002 \
--name nginx \
-v /root/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /root/nginx/conf/conf.d:/etc/nginx/conf.d \
-v /root/nginx/log:/var/log/nginx \
-v /root/nginx/html:/usr/share/nginx/html \
-d nginx


启动
sudo systemctl start nginx
sudo systemctl stop nginx
重启
sudo systemctl reload nginx
Nginx服务的当前状态
sudo systemctl status nginx


# 关于在ubuntu安装bun和volta使用官网的脚本，因为网络问题连接不到github的处理办法

+ 安装Bun

先下载Bun的压缩包，
（网址）[https://github.com/oven-sh/bun/releases/latest/download/bun-linux-x64.zip] :https://github.com/oven-sh/bun/releases/latest/download/bun-linux-x64.zip

然后新建文件夹

```bash
mkdir /root/.bun/bin
```

然后把文件解压在这个文件夹里面


然后添加环境变量，在用户目录下的 `.bashrc` 文件中添加

```bash
export BUN_INSTALL="/root/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```
在输入 `source ~/.bashrc` 重新加载配置文件，就可以输入 `bun -v`，如果没有找到命令，请重新打开一个控制台

+ 安装volta

同样下载安装包
（网址）[https://github.com/volta-cli/volta/releases/download/v2.0.2/volta-2.0.2-linux-arm.tar.gz] :https://github.com/volta-cli/volta/releases/download/v2.0.2/volta-2.0.2-linux-arm.tar.gz

然后新建文件夹

```bash
mkdir /root/.volta/bin
```

然后把文件解压在这个文件夹里面

然后添加环境变量，在用户目录下的 `.bashrc` 文件中添加

```bash
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH" 
```
在输入 `source ~/.bashrc` 重新加载配置文件，就可以输入 `volta -v`，如果没有找到命令，请重新打开一个控制台

# git 设置代理

git config --global http.proxy 127.0.0.1:7897
git config --global https.proxy 127.0.0.1:7899

# sudo systemctl restart systemd-networkd 通过 systemctl 重启网络服务

## docker

重启 Docker 服务命令
sudo systemctl start docker 

停止 Docker 守护进程服务
sudo systemctl stop docker    # 停止服务 
sudo systemctl stop docker.socket   # 停止套接字（可选）


# 方法1：重启网络服务（任选上述任意一种网络重启方式）
sudo systemctl restart 

## pm2 设置开启启动自动启动配置文件

先运行配置文件
pm2 start /www/pm2.config.js  
保存当前进程列表
pm2 save 
生成开机启动脚本
pm2 startup 


pm2 reload all     # 重启所有进程 