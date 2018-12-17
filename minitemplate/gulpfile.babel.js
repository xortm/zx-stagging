/*
 * @Author: chip
 * @Date: 2018-02-26 16:22:40
 * @Last Modified by: chip
 * @Last Modified time: 2018-03-23 17:19:36
 */
import gulp from 'gulp';
import babel from 'gulp-babel';
import gutil from 'gulp-util';
import watch from 'gulp-watch';
import less from 'gulp-less';
import rename from 'gulp-rename';
import packageNodeModules from 'gulp-package-node-modules';
import del from 'del';
import urlPrefixer from 'gulp-css-url-prefixer';
import env from './config/env';
import combiner from 'stream-combiner2';
import gsd from 'gulp-strip-debug';
import changed from 'gulp-changed';

const dest = 'dist';
const src = 'src';

const paths = {
  scripts: {
    src: `${src}/**/*.js`,
    dest: `${dest}/`,
  },
  styles: {
    src: `${src}/**/*.wxss`,
    dest: `${dest}/`,
  },
  others: {
    src: `${src}/**/*.!(js|wxss)`,
    dest: `${dest}/`,
  },
}

const environment = env[process.env.NODE_ENV || 'dev'];

export const clean = () => del([dest]);

/**
 * 编译Js
 */
export function scripts() {
  let arr = [];
  arr.push(gulp.src(paths.scripts.src, { sourcemaps: true }));
  arr.push(changed(paths.scripts.dest));

  arr.push(packageNodeModules({
    dev: paths.scripts.src,       // 项目开发目录
    dist: paths.scripts.dest,     // 项目打包目录
    output: './npm',    // node_modules打包后的存放目录
    isLiveUpdate: false // 是否实时更新（不管包是否已复制）
  }));

  arr.push(gulp.dest(paths.scripts.dest));
  const combined = combiner.obj(arr);
  // 任何在上面的 stream 中发生的错误，都不会抛出，
  // 而是会被监听器捕获
  combined.on('error', console.error.bind(console));
  return combined;
}

/**
 * 编译样式
 */
export function styles() {
  return gulp.src(paths.styles.src, { sourcemaps: true })
    .pipe(less())
    .pipe(urlPrefixer(environment.ASSETS))
    .pipe(rename(path => {
      path.extname = '.wxss'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

/**
 * 复制其他文件
*/
export function copy() {
  return gulp.src(paths.others.src)
    .pipe(gulp.dest(paths.others.dest))
}

/**
 * 生成stream
 * @param {*} filename 文件名
 * @param {*} string 内容
 */
function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return src
}

/**
 * 生成配置文件
 */
export function settings() {
  const env = {
    ...environment,
    version: process.env.version,
  }
  return string_src('config.js', `export default ${JSON.stringify(env)};`)
    .pipe(babel())
    .pipe(gulp.dest(`${dest}/`));
}

export function watchFiles() {
  watch(paths.scripts.src, scripts);
  watch(paths.others.src, copy);
  watch(paths.styles.src, styles);
  watch('config/**', settings);

}


/**
 * 打包
 */
const build = gulp.series(clean, gulp.parallel(copy, settings, scripts, styles));

gulp.task('build', build);
gulp.task('watch', gulp.parallel(build, watchFiles));



export default build;
