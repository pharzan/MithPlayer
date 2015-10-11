//var myPlayer = thePlayerName;
var Player = function () {

    this.config = {
        theVideo: m.prop(),
        theDims: m.prop({w: 400}),
        theUrl: m.prop("http://media.w3.org/2010/05/bunny/trailer.mp4"),
        thePlugins: []
    };

// this function is
    this.delayFunction = function () {
        var self = this;
        var deferred = m.deferred();
        setTimeout(function () {
            var theVid = self.config.theVideo();
            deferred.resolve(theVid);
        }, 2);
        return deferred.promise;
    };

    this.playIt = function () {
        this.delayFunction()
            .then(function (theVid) {
                console.log(theVid);
                if (theVid.paused) {
                    theVid.play()
                } else {
                    theVid.pause()
                }
            })



    };

    this.loadVideo = function (videoUrl) {

        if (videoUrl) {
            this.config.theUrl(videoUrl)
        } else {
            //default video if nothing is passed also can add a try exception
            //here to check for video availibility
            this.config.theUrl('http://media.w3.org/2010/05/bunny/trailer.mp4')
        }

        var theVid = this.config.theVideo();
//change the src of source not video as set in the tag
        theVid.src = this.config.theUrl();
        theVid.load();
        console.log('URL', videoUrl)
    };

    this.skipVideo = function (value) {
        var theVid = this.config.theVideo();
        console.log(this.config.theVideo())
        theVid.currentTime += value;
    };

    this.volumeVideo = function (vol) {
        var theVid = this.config.theVideo();
        if (theVid.volume + vol >= 0 && theVid.volume + vol < 1) {
            theVid.volume = theVid.volume + vol
        }
    };

    this.view = function () {
        var self = this;
        var videoView = [m("video",
            {
                controls: "controls",
                height: this.config.theDims().h,
                width: this.config.theDims().w,
                config: function (element, isinit) {
                    self.config.theVideo(element);
                }
            },
            m("source",
                {
                    //default should be somewhere else not here
                    src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
                    type: "video/mp4"
                })
        ), m('div', {onclick: this.skipVideo.bind(this, 0.5)}, 'SKIP')];
        var volView = m('div', {
            onclick: this.volumeVideo.bind(this, 0.1)
        }, 'Vol +');
        var theView = [videoView];
        theView.push(volView, m.component(theOverlays, this));

        return [m(".video_container", {}, theView)];

    };

};
var theOverlays = {

    vm: {
        self: m.prop(this)
    },
    playIt: function () {
        this.vm.self().style.display = "none";
        console.log(this);
        this.playIt();

    },

    controller: function () {
    },
    view: function (ctrl, parent) {
        var self = this;
        console.log("parent:", parent);
        return m("div", [
            m("img", {
                src: 'assets/img/play_button.png',
                style: {
                    position: "absolute",
                    top: "0"
                },
                onclick: function(){
                    console.log(this)
                    parent.playIt.bind(parent)
                },
                config: function (element, isinit) {
                    self.vm.self(element)
                }
            })
        ])
    }
};

myPlayer = new Player();


//myPlayer.playIt();
m.mount(document.body, myPlayer);
/*
 different sources : change files
 access controls using api myPlayer.play() ....
 add some plugins : overlay div



 */
