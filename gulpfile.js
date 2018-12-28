var gulp = require('gulp');

var sass = require('gulp-sass'); //编译scss的

var autoprefixer = require('gulp-autoprefixer'); //自动添加前缀

var clean = require('gulp-clean-css'); //压缩css

var concat = require('gulp-concat'); //合并文件

var uglify = require('gulp-uglify'); //压缩js

var babel = require('gulp-babel'); //es6 ----> es5

var htmlmin = require('gulp-htmlmin'); //压缩html插件

var server = require('gulp-webserver'); //起服务

var url = require('url');

var fs = require('fs');

var path = require('path');

//开发环境的编译scss
gulp.task('devSass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browers: ['last 2 versions', 'Andriod>=4.0']
        }))
        .pipe(concat('all.css'))
        .pipe(clean())
        .pipe(gulp.dest('./src/css'))
})

//监听scss
gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('devSass'))
})


function serverFun(serverPath) {
    return gulp.src(serverPath)
        .pipe(server({
            port: 9090, //端口号
            host: '172.21.66.4', //配置ip地址
            // open:true,  //自动打开浏览器
            // livereload:true, //自动刷新浏览器
            // fallback:'demo.html' //指定默认打开的文件  index.html不用此设置
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    res.end('');
                    return
                }

                if (pathname === '/api/list') { //接口

                    res.end(JSON.stringify({
                        code: 1,
                        data: target
                    }))
                } else { //读文件
                    pathname = pathname === '/' ? 'index.html' : pathname;

                    res.end(fs.readFileSync(path.join(__dirname, serverPath, pathname)));
                }
            }
        }))
}

//起服务
gulp.task('devServer', function() {
    return serverFun('src')
})

//开发环境
gulp.task('dev', gulp.series('devSass', 'devServer', 'watch')); //注意：watch任务永远放在最后