const { src, dest, watch, parallel } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// Webpack
const webpack = require('webpack-stream');
const path = require('path');

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// JavaScript
const terser = require('gulp-terser-js');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
};

// Tarea CSS
function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(postcss([autoprefixer()]))
        // .pipe(postcss([autoprefixer(), cssnano()])) // Usa esto para minificar
        .pipe(sourcemaps.write('.'))
        .pipe(dest('public/build/css'));
}

// Tarea JavaScript
function javascript() {
    return src(paths.js)
        .pipe(webpack({
            entry: './src/js/app.js', // Configura el archivo de entrada
            output: {
                filename: 'bundle.js', // Configura el archivo de salida
                path: path.resolve(__dirname, 'public/build/js'), // Ruta donde se guardará el bundle
            },
            mode: 'production', // Configura el modo de producción
            watch: false, // Desactiva el watch para producción
        }))
        .pipe(sourcemaps.init())
        .pipe(terser()) // Minifica el código JS
        .pipe(sourcemaps.write('.'))
        .pipe(rename({ suffix: '.min' })) // Renombra el archivo con el sufijo .min
        .pipe(dest('public/build/js')); // Guarda el archivo compilado
}

// Tarea de imágenes
function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest('public/build/img'));
}

// Tareas de WebP y AVIF
function versionWebp(done) {
    const opciones = { quality: 50 };
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('public/build/img'));
    done();
}

function versionAvif(done) {
    const opciones = { quality: 50 };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('public/build/img'));
    done();
}

// Tarea de desarrollo (watch)
function dev(done) {
    watch(paths.scss, css);
    watch(paths.js, javascript);
    watch(paths.imagenes, imagenes);
    watch(paths.imagenes, versionWebp);
    watch(paths.imagenes, versionAvif);
    done();
}

// Exportación de tareas
module.exports.css = css;
module.exports.js = javascript;
module.exports.imagenes = imagenes;
module.exports.versionWebp = versionWebp;
module.exports.versionAvif = versionAvif;
module.exports.dev = parallel(css, imagenes, versionWebp, versionAvif, javascript, dev);
module.exports.build = parallel(javascript, css, imagenes); // Compilación final
