import { src, dest, series, watch } from "gulp";
import gulpSass from "gulp-sass";
import { log } from "gulp-util";
import dartSass from "sass";
const sass = gulpSass(dartSass);
import postcss from "gulp-postcss";
import rename from "gulp-rename";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import del from "del";
import sync from "browser-sync";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import terser from "terser";

// variable set
const DEST = "dist";
const SRC = "src";
const SERVER_PORT = "8012";
const FILE_NAME = "dnd";

const PATH = {
    css: {
        src: `${SRC}/scss`,
        dest: `${DEST}/css`,
    },
    js: {
        src: `${SRC}/js/*.js`,
        dest: `${DEST}/js`,
    },
    img: {
        src: `${SRC}/img/**/*`,
        dest: `${DEST}/img`,
    },
};

// processing tasks
const css = async (reload) => {
    await src([
        `${PATH.css.src}/connector.scss`,
        `${PATH.css.src}/dnd.scss`,
        `${PATH.css.src}/generator.scss`,
    ])
        .pipe(
            sass({
                outputStyle: "expanded",
            }).on("error", sass.logError)
        )
        .on("error", (e) => logger.failed("sass", e))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .on("error", (e) => logger.failed("postcss", e))
        .pipe(dest(PATH.css.dest))
        .on("error", (e) => logger.failed("write", e))
        .on("end", () => {
            logger.success("SASS");
            reload && sync.reload();
        });
};

const bundleCss = async (reload) => {
    await src(`${SRC}/scss/*.scss`, { sourcemaps: true })
        .pipe(
            sass({
                includePaths: "node_modules",
                outputStyle: "compressed",
            }).on("error", sass.logError)
        )
        .on("error", (e) => logger.failed("sass", e))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .on("error", (e) => logger.failed("postcss", e))
        .pipe(rename(`${FILE_NAME}.bundle.css`))
        .on("error", (e) => logger.failed("rename", e))
        .pipe(dest(PATH.css.dest, { sourcemaps: "." }))
        .on("error", (e) => logger.failed("write", e))
        .on("end", () => {
            logger.success("SASS Budnling");
            if (reload == true) {
                sync.reload();
            }
        });
};

const js = async (reload) => {
    await src(PATH.js.src)
        .pipe(dest(PATH.js.dest))
        .on("end", (e) => {
            logger.success("JS");
            reload && sync.reload();
        });
};

const img = async (reload) => {
    await src(PATH.img.src)
        .pipe(dest(PATH.img.dest))
        .on("end", (e) => {
            logger.success("IMAGE");
            reload && sync.reload();
        });
};

// other tasks
const logger = {
    success: (msg) => {
        log(`✅ ${msg}: Success`);
    },
    failed: (msg, e) => {
        log(`❌ [${msg}] ${e}: Failed`);
    },
};

const clean = async () => {
    await del.sync([DEST]);
};

const proxy = async () => {
    await sync.init(null, {
        proxy: `http://localhost:${SERVER_PORT}`,
        open: false,
        notify: false,
    });
};

const watcher = () => {
    log("👀 Start watching...");
    watch(`static/**/*`).on("change", (e) => {
        sync.reload();
        log(`\n\n🔄 Source Changed: ${e}`);
    });
    watch(`${SRC}/**/*.scss`).on("change", (e) => {
        css(true);
        bundleCss(true);
        log(`\n\n🔄 Source Changed: ${e}`);
    });
    watch(`${SRC}/**/*.js`).on("change", (e) => {
        js(true);
        log(`\n\n🔄 Source Changed: ${e}`);
    });
    watch(`${SRC}/img/**/*`).on("change", (e) => {
        img(true);
        log(`\n\n🔄 Source Changed: ${e}`);
    });
};

// run
exports.dev = series(
    [clean],
    [js],
    [css],
    [bundleCss],
    [img],
    [proxy],
    [watcher]
);

exports.build = series([clean], [js], [css], [bundleCss], [img]);
