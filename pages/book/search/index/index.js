var util = require('../../../../utils/util.js');
var api = require('../../../../utils/api.js');
var app = getApp();
var storagekey = 'hotSearch';
var BasePage = require('../../../../utils/BasePage.js');
BasePage({
    data: {
        hotKeyword: [],
        historyWord: [],
        keyword: '',
        showClearIcon: false,
        pageIndex: 1,
        pagecount: 0,
        resultPageIndex: 1,
        resultPagecount: 0,
        resultCount: 0,
        bookList: [],
        showResult: false,
        slideAnimation: {},
        toTop: false,
        noMoreData:false,
        showLoading: false,
        message: {
            content: '无搜索结果',
            duration: 3000,
            iconPath: '/image/noresult.png'
        },
        unitidList: [{
            type:'banner',
            id: "adunit-df07e1b4d3681ec7"
        },{
            type:'vedio',
            id: "adunit-884d7b30e66b6bc9"
        }],
        unitid:{
        },
        colorArr:['#F4ECEA','#F5EEE6','#EDF4EC','#E8F2F3','#EDF4EC'],
        randomColorArr:[],
        loading:true

    },
    onLoad: function (options) {     
            this.requestHotsearchList();
            // this.getAd();
            this.initRandomColor();
            if(options.keyword != undefined){
                this.setData({
                    keyword: options.keyword,
                    showClearIcon: true,
                    loading:false
                });   
                this.requestBookList();         
            }     
            this.setData({
                loading:false
            });   
            this.getHistoryKeyword();
    },
    getAd:function()
    {
     this.setData({
      unitid: util.common.getRandomArrayElements(this.data.unitidList,1)[0]
    });
    },
    initRandomColor:function(){
        var tempRandomColorArr=[];
        for (var i = 0; i < 5;i++) {
            let random = this.data.colorArr[Math.floor(Math.random() * 5)];          
            tempRandomColorArr.push(random);
        }   
        this.setData({
            randomColorArr: tempRandomColorArr
        })     
    },
    onShow: function () {    
        if (this.data.loading == true) {
            var cxt_rotate = wx.createContext();//创建并返回绘图上下文context对象。
            var rotate=0;//默认旋转角度为为0
            setInterval(function(){ //无限循环定时函数    
              cxt_rotate.translate(150,100);//设置坐标系坐标
              rotate++;//旋转角度自增1
              cxt_rotate.rotate(rotate*Math.PI/180)//设置旋转的角度
              cxt_rotate.rect(0,0,50,50)//设置坐标(0,0)，相对于坐标系坐标，边长为为50px的正方形
              cxt_rotate.stroke();//对当前路径进行描边
              wx.drawCanvas({
              canvasId:'canvasid',//画布标识，对应
              actions:cxt_rotate.getActions()//导出context绘制的直线并显示到页面
            });
            },1)   
        }          
           
    },
    deleteEvent: function (e) {
        util.wxf.removeStorageSync(storagekey);
        this.setData({
            historyWord: []
        });
    },

    searchEvent: function (e) {     
        var _this = this
        var keyword = e.currentTarget.dataset.keyword
        console.log("searchEvent  keyword="+keyword);
        if (keyword) {
            keyword = util.common.trim(keyword);
            _this.setSearchStorage(keyword);
            _this.setData({
                keyword: keyword,
                showClearIcon: true,
                resultPageIndex:1,
                bookList:[]
            });
            _this.requestBookList();
            _this.getHistoryKeyword();
        }
    },

    submitEvent: function (e) {
        console.log("submitEvent");
        var _this = this
        var keyword = e.detail.value.keyword;
        var check = util.common.isEmptyString(keyword);
        if (!check) {
            keyword = util.common.trim(keyword);
            _this.setSearchStorage(keyword);
            _this.setData({
                resultPageIndex: 1,
                resultPagecount: 0,
                resultCount: 0,
                bookList: [],
                keyword: keyword,
                showClearIcon: true
            });
         
            _this.requestBookList();
            _this.getHistoryKeyword();
        }
    },

    confirmEvent: function (e) {
    },
    blurEvent: function (e) {
        wx.hideKeyboard();
    },

    toDetailPage: function (e) {
        var bid = e.currentTarget.dataset.bid; //图书id
        wx.navigateTo({
            url: '../../detail/detail?novelid=' + bid
        });
    },

    scrolltolowerEvent: function (e) {    
        this.requestBookList();
    },

    toTopEvent: function (e) {      
        this.setData({toTop:true});       
        wx.pageScrollTo({
            scrollTop: 0
        });
    },
    inputEvent: function (e) {
        this.setData({
            showClearIcon: true
        });
    },
    emptyEvent: function (e) {
    },
    clearWordsEvent: function (e) {
        this.setData({
            keyword: '',
            showClearIcon: false,
            showResult:false,
            noMoreData:false
        });
    },
    //请求热搜书籍
    requestHotsearchList() { 
        var _this = this;  
        var requestData = {
            pageIndex: _this.data.pageIndex,
            pagesize: 5,
        };  
        app.getHeaderInfo(function (headerInfo) {
            api.request.hotSearchList(requestData, headerInfo, (res) => {
                if (res.list) {
                    _this.setData({
                        hotKeyword: res.list.item,
                        pageIndex: _this.data.pageIndex + 1,
                        pagecount: res.list.item.pagecount
                    });
                }
            });
        })
    },
    //获取搜索历史
    getHistoryKeyword() {
        let _this = this;
        let storageValue = util.wxf.getStorageSync(storagekey);
        let length = storageValue.length;
        //取10个历史记录
        if (length > 10) {
            while (storageValue.length > 10) {
                storageValue.pop();
            }
        }
        _this.setData({
            historyWord: storageValue
        });
    },
    //搜索历史写入缓存
    setSearchStorage(keyword) {
        let _this = this;
        let historyWord = _this.data.historyWord;
        historyWord.unshift(keyword);
        let unique = _this.distinct(historyWord);
        util.wxf.setStorageSync(storagekey, unique);
    },
    //搜索书籍
    requestBookList() {
        let _this = this;
        _this.setData({ showLoading: true });
        let resultPageIndex = _this.data.resultPageIndex;
        let resultPagecount = _this.data.resultPagecount;
    
        console.log("requestBookList，resultPageIndex="+resultPageIndex+"resultPagecount="+resultPagecount+"keyword="+_this.data.keyword);
        if (resultPagecount > 0 && resultPageIndex > resultPagecount)
            return;
       
        let requestData = {
            pageIndex: resultPageIndex,
            pagesize: 10,
            keyword: _this.data.keyword
        };
  
        app.getHeaderInfo(function (headInfo) {
            api.request.novelList(requestData, headInfo, (res) => {
                if (res.list && res.list.item) {
                    if (res.list.item.length == 0)
                        _this.setData({
                            showResult: false
                        });
                    else { 
                        var noMoreData=false;
                        // console.log("resultPageIndex="+resultPageIndex);
                        // console.log("res.list.item.length="+res.list.item.length);
                        var loadedCount=res.list.item.length+((resultPageIndex-1)*10);
                        
                        if(loadedCount>=res.list.totalcount)  
                        {
                            noMoreData=true;
                        } 
                        console.log("noMoreData"+noMoreData);
                        _this.setData({
                            bookList: _this.data.bookList.concat(res.list.item),
                            resultPageIndex: resultPageIndex + 1,
                            resultPagecount: res.list.pagecount,
                            resultCount: res.list.totalcount,
                            showResult: true,
                            noMoreData:noMoreData
                        });
                        
    
                    }
                }
                else {
                    _this.setData({
                        showResult: false
                    });
                }
            _this.setData({ showLoading: false });
            console.log("AAA");
            console.log(_this.data.showResult);
            console.log("BBB");
            //msg.hide.call(_this);
    }, () => {
    _this.setData({ showLoading: false });
    },
    () => { _this.setData({ showLoading: false }); }
            );
        });
    },
    //去除重复数据
    distinct(arr) {
        let result = [], hash = {};
        for (let i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }
})




