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