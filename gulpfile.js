var _ = require( 'underscore' );
var del = require( 'del' );

var gulp = require( 'gulp' );
var bower = require( 'gulp-bower' );
var concat = require( 'gulp-concat' );
var templates = require( 'gulp-angular-templatecache' );

var tmpDir = './tmp';

var templateCache = {
    path : tmpDir,
    filename : 'templates.js',
    options : {
        module : 'golf-pickem.templates',
        standalone : true,
        moduleSystem : 'IIFE'
    }
};

var js = {
    src : [ 'src/app.js', 'src/services/**/*.js', 'src/components/**/*.js', tmpDir + '/**/*.js' ],
    lib : []
};

var html = {
    src : [ 'src/**/*.html' ]
};

var styles = {
    src : [ 'src/**/*.css' ],
    lib : []
};

var dest = {
    js : {
        path : 'dist',
        filename : 'bundle.js'
    },
    styles : {
        path : 'dist',
        filename : 'bundle.css'
    }
};

gulp.task( 'bower', function() {
    return bower().pipe( gulp.dest( 'bower' ) )
} );

gulp.task( 'css', [ 'bower' ], function() {
    return gulp.src( _.flatten( [ styles.lib, styles.src ] ) ).pipe( concat( dest.styles.filename ) ).pipe( gulp.dest( dest.styles.path ) );
} );

gulp.task( 'js-templates', [ 'bower' ], function() {
    return gulp.src( html.src ).pipe( templates( templateCache.filename, templateCache.options ) ).pipe( gulp.dest( templateCache.path ) );
} );

gulp.task( 'js-concat', [ 'js-templates' ], function() {
    return gulp.src( _.flatten( [ js.lib, js.src ] ) ).pipe( concat( dest.js.filename ) ).pipe( gulp.dest( dest.js.path ) );
} );

gulp.task( 'js', [ 'js-concat' ], function() {
    return del( tmpDir );
} );

gulp.task( 'default', [ 'css', 'js' ] );
