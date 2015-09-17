/**
 * @file UnitTest
 */

/* global Pager */
define(['jquery', 'Pager'], function ($, Pager) {
    describe('test init', function () {
        var thisOptions;
        var testMergeOptions;
        var moduleOptions;
        var pager;
        beforeEach(function () {
            thisOptions = {
                pno: 2,
                totalPage: 10,
                totalRecords: 100,
                hrefFormer: 'pagerTest',
                hrefLatter: '.html',
                getLink: function (n) {
                    return this.options.hrefFormer + this.options.hrefLatter + '?pno=' + n;
                }
            };
            testMergeOptions = {
                // customOption
                pno: 2,
                totalPage: 10,
                totalRecords: 100,
                hrefFormer: 'pagerTest',
                hrefLatter: '.html',
                // defaultOption
                pagerid: 'pager',
                gopageButtonId: 'pager-btn-go'
            };
            pager = new Pager();
            pager.generPageHtml(thisOptions);
            moduleOptions = pager.options;
        });
        it('test pager pno property', function () {
            expect(moduleOptions.pno).toEqual(testMergeOptions.pno);
        });
        it('test pager totalPage property', function () {
            expect(moduleOptions.totalPage).toEqual(testMergeOptions.totalPage);
        });
        it('test pager totalRecords property', function () {
            expect(moduleOptions.totalRecords).toEqual(testMergeOptions.totalRecords);
        });
        it('test pager pagerId property', function () {
            expect(moduleOptions.pagerid).toEqual(testMergeOptions.pagerid);
        });
    });
    describe('test runner time', function () {
        var pager;
        beforeEach(function () {
            pager = new Pager();
            pager.generPageHtml({
                pno: 2,
                totalPage: 10,
                totalRecords: 100,
                hrefFormer: 'pagerTest',
                hrefLatter: '.html',
                getLink: function (n) {
                    return this.options.hrefFormer + this.options.hrefLatter + '?pno=' + n;
                }
            });
        });
        it('tracks that the spies were called', function () {
            spyOn(pager, 'generPageHtml');
            pager.generPageHtml({
                pno: 2,
                totalPage: 10,
                totalRecords: 100,
                hrefFormer: 'pagerTest',
                hrefLatter: '.html',
                getLink: function (n) {
                    return this.options.hrefFormer + this.options.hrefLatter + '?pno=' + n;
                }
            });

            expect(pager.generPageHtml).toHaveBeenCalled();
        });

        it('tracks the number of times getLink was called', function () {
            spyOn(pager, 'getLink').and.callThrough();
            pager.generPageHtml({
                pno: 2,
                totalPage: 10,
                totalRecords: 100,
                hrefFormer: 'pagerTest',
                hrefLatter: '.html',
                getLink: function (n) {
                    return this.options.hrefFormer + this.options.hrefLatter + '?pno=' + n;
                }
            });
            expect(pager.getLink.calls.count()).toEqual(10);
        });
    });
    describe('test html template', function () {
        var pager;
        var thisOptions;
        var linkHtml;
        beforeEach(function () {
            thisOptions = {
                pno: 2,
                totalPage: 5,
                totalRecords: 100,
                hrefFormer: 'pagerTest',
                hrefLatter: '.html',
                getLink: function (n) {
                    return this.options.hrefFormer + this.options.hrefLatter + '?pno=' + n;
                }
            };

            $('<div>', {
                id: 'pager'
            }).appendTo($('body'));
            pager = new Pager();
            pager.generPageHtml(thisOptions);
            linkHtml = $('.pageBtnWrap').html();
            $('#pager').hide();
        });
        it('link mode html is right', function () {

            var expectHtml = '<a title="首页" href="pagerTest.html?pno=1">首页</a>'
            + '<a title="上一页" href="pagerTest.html?pno=1">上一页</a>'
            + '<a title="第1页" href="pagerTest.html?pno=1">1</a>'
            + '<span class="curr">2</span>'
            + '<a title="第3页" href="pagerTest.html?pno=3">3</a>'
            + '<a title="第4页" href="pagerTest.html?pno=4">4</a>'
            + '<a title="第5页" href="pagerTest.html?pno=5">5</a>'
            + '<a title="下一页" href="pagerTest.html?pno=3">下一页</a>'
            + '<a title="尾页" href="pagerTest.html?pno=5">尾页</a>';

            expect(linkHtml).toEqual(expectHtml);
        });

    });
});
