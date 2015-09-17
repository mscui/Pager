/**
 * @file Pager分页组件
 */
define(['jquery'], function ($) {
    var defaultOptions = {
        pagerid: 'pager',
        // 只有click模式
        mode: 'click',
        // 当前页码
        pno: 1,
        // 总页码
        totalPage: 1,
        // 总数据条数
        totalRecords: 0,
        // 是否显示首页按钮
        isShowFirstPageBtn: true,
        // 是否显示尾页按钮
        isShowLastPageBtn: true,
        // 是否显示上一页按钮
        isShowPrePageBtn: true,
        // 是否显示下一页按钮
        isShowNextPageBtn: true,
        // 是否显示总页数
        isShowTotalPage: true,
        // 是否显示当前页
        isShowCurrPage: true,
        // 是否显示总记录数
        isShowTotalRecords: false,
        // 是否显示页码跳转输入框
        isGoPage: true,
        // 是否用span包裹住页码按钮
        isWrapedPageBtns: true,
        // 是否用span包裹住分页信息和跳转按钮
        isWrapedInfoTextAndGoPageBtn: true,
        // 省略号前至少显示个数
        maxDotPageNum: 8,
        // 链接前部
        href: '',
        // 跳转总范围id
        gopageWrapId: 'pager-gopage-wrap',
        // 跳转按钮id
        gopageButtonId: 'pager-btn-go',
        // 跳转input输入框id
        gopageTextboxId: 'pager-btn-go-input',
        // 模板
        template: '<a href="#" data-page="{1}" title="第{1}页">{1}</a>',
        omitTemplate: '<span class="spanDot">...</span>',
        currTemplate: '<span class="curr">{1}</span>'
    };
    var langOptions = {
        firstPageText: '首页',
        lastPageText: '尾页',
        prePageText: '上一页',
        nextPageText: '下一页',
        totalPageBeforeText: '共',
        totalPageAfterText: '页',
        currPageBeforeText: '当前第',
        currPageAfterText: '页',
        totalInfoSplitStr: '/',
        totalRecordsBeforeText: '共',
        totalRecordsAfterText: '条数据',
        gopageBeforeText: '&nbsp;转到',
        gopageButtonOkText: '确定',
        gopageAfterText: '页'
    };
    var Pager = function () {
        this.pno = defaultOptions.pno;
        this.totalPage = defaultOptions.totalPage;
        this.totalRecords = defaultOptions.totalRecords;
    };

    /**
     * 分页按钮控件初始化
     *
     * @param {Object} options pager配置参数
     */
    Pager.prototype.init = function (options) {
        this.options = $.extend({}, defaultOptions, options);
        this.initLang(options);
        this.initPager(options);
    };

    /**
     * 初始化语言配置选项
     *
     * @param {Object} options pager配置参数
     */
    Pager.prototype.initLang = function (options) {
        if (options.lang) {
            for (var key in options.lang) {
                if (options.lang.hasOwnProperty(key)) {
                    langOptions[key] = options.lang[key];
                }
            }
        }
    };

    /**
     * 初始化插件方法和页码配置项
     *
     * @param {Object} options pager配置参数
     */
    Pager.prototype.initPager = function (options) {
        this.options.href = options.href || '';

        if (options.click && typeof(options.click) === 'function') {
            this.click = options.click;
        }
        if (options.getHref && typeof(options.getHref) === 'function') {
            this.getHref = options.getHref;
        }
        // this.clickConfig 为了click模式不刷新页面渲染
        if (!this.clickConfig) {
            this.clickConfig = options;
        }
        // 初始化页码配置项
        if (this.options.pno < 1) {
            this.options.pno = 1;
        }
        this.options.totalPage = (this.options.totalPage <= 1) ? 1 : this.options.totalPage;
        if (this.options.pno > this.options.totalPage) {
            this.options.pno = this.options.totalPage;
        }
        this.prv = (this.options.pno <= 2) ? 1 : (this.options.pno - 1);
        this.next = (this.options.pno >= this.options.totalPage - 1) ? this.options.totalPage : (this.options.pno + 1);
        this.hasPrv = (this.options.pno > 1);
        this.hasNext = (this.options.pno < this.options.totalPage);

        this.inited = true;
    };

    /**
     * 页码单击事件(mode:click),可自定义click事件
     *
     * @param {number} n 页码
     * @return {boolean} 默认返回false
     */
    Pager.prototype.click = function (n) {
        return false;
    };

    /**
     * 返回页码href的值(mode:click)
     *
     * @param {number} n 页码
     * @return {string} 默认返回#
     */
    Pager.prototype.getHref = function (n) {
        return '#';
    };

    /**
     * 执行click事件
     *
     * @param {number} n 页码
     * @return {Function} click事件
     */
    Pager.prototype.clickHandler = function (n) {
        var res = false;
        var num = $(event.target || event.srcElement).attr('data-page');
        num = num ? parseInt(num, 10) : n;
        if (this.click && typeof this.click === 'function') {
            res = this.click.call(this, num) || false;
        }
        return res;
    };

    /**
     * 拼接页码<a>
     *
     * @param {number} n 页码
     * @return {string} 拼接好的a内容
     */
    Pager.prototype.getHandlerStr = function (n) {

        return 'href="' + this.getHref(n) + '" data-page="' + n + '"';

    };

    /**
     * gopage按钮键盘方法
     *
     * @return {boolean} 返回操作结果
     */
    Pager.prototype.keypressGopage = function () {
        var event = arguments[0] || window.event;
        var code = event.keyCode || event.charCode;
        // delete key
        if (code === 8) {
            return true;
        }
        // enter key
        if (code === 13) {
            this.gopage();
            return false;
        }
        // copy and paste
        if (event.ctrlKey && (code === 99 || code === 118)) {
            return true;
        }
        // only number key
        if (code < 48 || code > 57) {
            return false;
        }
        return true;
    };

    /**
     * 页码框跳转方法
     *
     * @private
     */
    Pager.prototype.gopage = function () {
        var strPage = $('#' + this.options.gopageTextboxId).val();
        if (isNaN(strPage)) {
            $('#' + this.options.gopageTextboxId).val(this.next);
            return;
        }
        var n = parseInt(strPage, 10);
        if (n < 1) {
            n = 1;
        }
        if (n > this.options.totalPage) {
            n = this.options.totalPage;
        }

        this.clickHandler(n);
    };

    /**
     * 生成pager组件
     *
     * @param {Object} config pager配置参数
     * @param {boolean} enforceInit 强制刷新
     */
    Pager.prototype.generPageHtml = function (config, enforceInit) {
        if (enforceInit || !this.inited) {
            this.init(config);
        }

        this.defaultHtml();

        var str = '';
        var totalInfo = '<span class="totalText">';
        var totalInfoSplitstr = '<span class="totalInfoSplitStr">' + langOptions.totalInfoSplitStr + '</span>';
        var gopageInfo = '';

        totalInfo = this.renderTotalInfo(totalInfo, totalInfoSplitstr);
        gopageInfo = this.renderGo();
        str = this.renderDot(str, this.options.omitTemplate);


        var pagerHtml = '<div>';
        if (this.options.isWrapedPageBtns) {
            pagerHtml += '<span class="pageBtnWrap">' + this.strFirst + this.strPrv + str
            + this.strNext + this.strLast + '</span>';
        } else {
            pagerHtml += this.strFirst + this.strPrv + str + this.strNext + this.strLast;
        }
        if (this.options.isWrapedInfoTextAndGoPageBtn) {
            pagerHtml += '<span class="infoTextAndGoPageBtnWrap">' + totalInfo + gopageInfo + '</span>';
        } else {
            pagerHtml += totalInfo + gopageInfo;
        }
        pagerHtml += '</div><div style="clear:both;"></div>';

        $('#' + this.options.pagerid).html(pagerHtml);

        this.renderEvent();
    };

    // 生成pager组件首页，尾页，上一页，下一页
    Pager.prototype.defaultHtml = function () {
        var strFirst = '';
        var strPrv = '';
        var strNext = '';
        var strLast = '';

        this.strFirst = strFirst;
        this.strPrv = strPrv;
        this.strNext = strNext;
        this.strLast = strLast;

        this.strFirst = this.renderBtn(this.options.isShowFirstPageBtn, this.hasPrv, 1, langOptions.firstPageText);
        this.strPrv = this.renderBtn(this.options.isShowPrePageBtn, this.hasPrv, this.prv, langOptions.prePageText);
        this.strNext = this.renderBtn(this.options.isShowNextPageBtn, this.hasNext,
            this.next, langOptions.nextPageText);
        this.strLast = this.renderBtn(this.options.isShowLastPageBtn, this.hasNext,
            this.options.totalPage, langOptions.lastPageText);
    };

    /**
     * 生成pager首页，尾页，上一页，下一页按钮
     *
     * @param {boolean} isShowBtn 是否显示按钮
     * @param {boolean} hasBtn 是否需要按钮
     * @param {number} n 需要显示的页码
     * @param {boolean} langStr 显示文字
     * @return {string} 拼接好的按钮内容
     */
    Pager.prototype.renderBtn = function (isShowBtn, hasBtn, n, langStr) {
        var strBtn;
        if (isShowBtn) {
            if (hasBtn) {
                strBtn = '<a ' + this.getHandlerStr(n) + ' title="'
                    + langStr + '">' + langStr + '</a>';
            } else {
                strBtn = '<span class="disabled">' + langStr + '</span>';
            }
        }
        return strBtn;
    };

    /**
     * 生成"当前第n页/共n页"
     *
     * @param {string} totalInfo 全部内容
     * @param {string} totalInfoSplitstr /
     * @return {string} 拼接好的按钮内容
     */
    Pager.prototype.renderTotalInfo = function (totalInfo, totalInfoSplitstr) {
        if (this.options.isShowCurrPage) {
            totalInfo  += langOptions.currPageBeforeText + '<span class="currPageNum">'
                + this.options.pno + '</span>' + langOptions.currPageAfterText;
            if (this.options.isShowTotalPage) {
                totalInfo += totalInfoSplitstr;
                totalInfo += langOptions.totalPageBeforeText + '<span class="totalPageNum">'
                    + this.options.totalPage + '</span>' + langOptions.totalPageAfterText;
            } else if (this.options.isShowTotalRecords) {
                totalInfo += totalInfoSplitstr;
                totalInfo += langOptions.totalRecordsBeforeText + '<span class="totalRecordNum">'
                    + this.options.totalRecords + '</span>' + langOptions.totalRecordsAfterText;
            }
        } else if (this.options.isShowTotalPage) {
            totalInfo += langOptions.totalPageBeforeText + '<span class="totalPageNum">'
                + this.options.totalPage + '</span>' + langOptions.totalPageAfterText;
            if (this.options.isShowTotalRecords) {
                totalInfo += totalInfoSplitstr;
                totalInfo += langOptions.totalRecordsBeforeText + '<span class="totalRecordNum">'
                    + this.options.totalRecords + '</span>' + langOptions.totalRecordsAfterText;
            }
        } else if (this.options.isShowTotalRecords) {
            totalInfo += langOptions.totalRecordsBeforeText + '<span class="totalRecordNum">'
                + this.options.totalRecords + '</span>' + langOptions.totalRecordsAfterText;
        }
        totalInfo += '</span>';

        return totalInfo;
    };
    Pager.prototype.renderGo = function () {
        var gopageInfo = '';
        if (this.options.isGoPage) {
            gopageInfo = '<span class="goPageBox">' + langOptions.gopageBeforeText + '<span id="'
                + this.options.gopageWrapId + '">'
                + '<input type="button" id="' + this.options.gopageButtonId + '" value="'
                    + langOptions.gopageButtonOkText + '" />'
                + '<input type="text" id="' + this.options.gopageTextboxId + '" value="' + this.next + '" /></span>'
                    + langOptions.gopageAfterText + '</span>';
        }
        return gopageInfo;
    };

    /**
     * 格式化模板
     *
     * @param  {string} template 模板
     * @param  {number} i 页数
     * @return  {string} template 替换后的模板
     */
    Pager.prototype.format = function (template, i) {
        return template.replace(/\{1\}/g, i);
    };
    Pager.prototype.renderDot = function (str, dot) {

        if (this.options.totalPage <= this.options.maxDotPageNum) {
            for (var i = 1; i <= this.options.totalPage; i++) {
                if (this.options.pno === i) {
                    str += this.format(this.options.currTemplate, i);
                } else {
                    str += this.format(this.options.template, i);
                }
            }
        } else {
            if (this.options.pno <= 5) {
                for (var i = 1; i <= 7; i++) {
                    if (this.options.pno === i) {
                        str += this.format(this.options.currTemplate, i);
                    } else {
                        str += this.format(this.options.template, i);
                    }
                }
                str += dot;
            } else {
                str += this.format(this.options.template, 1);
                str += this.format(this.options.template, 2);
                str += dot;

                var begin = this.options.pno - 2;
                var end = this.options.pno + 2;
                if (end > this.options.totalPage) {
                    end = this.options.totalPage;
                    begin = end - 4;
                    if (this.options.pno - begin < 2) {
                        begin = begin - 1;
                    }
                } else if (end + 1 === this.options.totalPage) {
                    end = this.options.totalPage;
                }
                for (var i = begin; i <= end; i++) {
                    if (this.options.pno === i) {
                        str += this.format(this.options.currTemplate, i);
                    } else {
                        str += this.format(this.options.template, i);
                    }
                }
                if (end !== this.options.totalPage) {
                    str += dot;
                }
            }
        }
        return str;
    };

    /**
     * 不刷新页面重新渲染pager
     *
     * @param {number} n 页码
     */
    Pager.prototype.selectPage = function (n) {
        this.clickConfig['pno'] = n;
        this.generPageHtml(this.clickConfig, true);
    };

    Pager.prototype.renderEvent = function () {
        var gopageTextboxId = this.options.gopageTextboxId;
        var gopageButtonId = this.options.gopageButtonId;
        $('#' + gopageTextboxId).on('focus', $.proxy(this.focusGopage, this));
        $('#' + gopageTextboxId).on('keypress', $.proxy(this.keypressGopage, this));
        $('#' + gopageTextboxId).on('blur', $.proxy(this.blurGopage, this));
        $('#' + gopageButtonId).on('click', $.proxy(this.gopage, this));
        if (this.options.mode === 'click') {
            $('#' + this.options.pagerid + ' a').on('click', $.proxy(this.clickHandler, this));
        }
    };

    return Pager;
});

