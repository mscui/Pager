/**
 * @file 初始化Pager Link Mode
 */
require.config({
    paths: {
        'jquery': 'http://apps.bdimg.com/libs/jquery/1.11.1/jquery.min',
        'Pager': '../src/pager'
    }
});
require(['jquery', 'Pager'], function ($, Pager) {
    function getParameter(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return unescape(r[2]);
        } else {
            return null;
        }
    }
    var totalPage = 20;
    var totalRecords = 390;
    var pageNo = parseInt(getParameter('pno'), 10);
    if (!pageNo) {
        pageNo = 1;
    }
    var pager = new Pager();
    pager.generPageHtml({
        pno: pageNo,
        // 总页码
        totalPage: totalPage,
        // 总数据条数
        totalRecords: totalRecords,
        // 链接前部
        href: 'pagerTest.html',
        getLink: function (n) {
            return this.options.href + "?pno=" + n;
        }
    });
});
