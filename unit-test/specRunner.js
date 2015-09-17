/**
 * @file jasmine requireJS配置
 */
require.config({
    paths: {
        'jquery': 'http://apps.bdimg.com/libs/jquery/1.11.1/jquery.min',
        'Pager': '../src/pager',
        'jasmine': 'https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.0.0/jasmine',
        'jasmine-html': 'https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.0.0/jasmine-html',
        'boot': 'https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.0.0/boot'
    },
    shim: {
        'jasmine': {
            exports: 'window.jasmineRequire'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'window.jasmineRequire'
        },
        'boot': {
            deps: ['jasmine', 'jasmine-html'],
            exports: 'window.jasmineRequire'
        }
    }
});

var specs = [
    'unit-test'
];

require(['boot'], function () {
    require(specs, function () {
        window.onload();
    });
});