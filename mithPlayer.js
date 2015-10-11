//var myPlayer = thePlayerName;
var Player = function () {

    this.config = {
        theVideo: m.prop(),
        theDims: m.prop({w: 400}),
        theUrl: m.prop(),
        thePlugins: []
    };

    this.init = function (element, isinit) {
        this.config.theVideo(element);
        console.info(element)
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

        theVid.src = this.config.theUrl();
        theVid.load();
        console.log('URL', videoUrl)

    };

    this.skipVideo = function (value) {
        var theVid = this.config.theVideo();
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
        var videoView = m("video",
            {
                controls: "controls",
                height: this.config.theDims().h,
                width: this.config.theDims().w,
                config: function (element, isinit) {
                    self.init(element, isinit)
                }
            },
            m("source",
                {
                    src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
                    type: "video/mp4"

                })
        );
        var volView = m('div', {
            onclick: this.volumeVideo.bind(this, 0.1)
        }, 'Vol +');
        var theView = [videoView];
        theView.push(volView);

        return [m(".video_container", {}, theView), m.component(theOverlays)];
    };

};
var theOverlays = {
    vm:{
        self:m.prop(this)
    },
    playIt: function () {
        theOverlays.vm.self().style.display="none"
        console.log(theOverlays.vm.self().style)
        myPlayer.playIt();

    },

    init: function (element, isinit) {
        this.vm.self(element)
    },
    controller: function (args) {

    },
    view: function (ctrl, args) {
        var self = this;
        return m("div", [
            m("img", {
                src: 'assets/img/play_button.png', style: {
                    position: "absolute",
                    top: "0"

                },
                onclick: this.playIt,
                config: function (element, isinit) {
                    self.init(element, isinit)
                }
            })
        ])
    }
}

myPlayer = new Player();


//myPlayer.playIt();
m.mount(document.body, myPlayer);
