/*
 The Player
 */
var Player = function () {

    this.config = {
        dimensions: {w: "400px", h: "225px"},
        autoPlay: true,
        playList: [
            'file://C:/wamp/www/mithPlayer/videos/trailer.mp4',
            'file://C:/wamp/www/mithPlayer/videos/bunny.mp4',
            'file://C:/wamp/www/mithPlayer/videos/starwars.mp4'
        ],
        loop: true
    };

    this.state = {
        playing: false,
        finished: false,
        fileIdx: 0,
        time:0
    };

    this.thePlayerObj = m.prop();

   /* this.timeUpdate = function (seekBarId) {
        m.startComputation();
        this.state.time=this.thePlayerObj().currentTime;
        m.endComputation();

    };*/

    this.playIt = function () {
        var me = this.thePlayerObj();
        var self = this;

        if (me.paused) {
            this.state.playing = true;
            me.play();
            /*seekBarId = setInterval(function () {
                self.timeUpdate(seekBarId);
            }, 1);*/
        } else {
           /* clearInterval(seekBarId);*/
            this.state.playing = false;
            me.pause();


        }
    };

    this.loadFromPlayList = function () {

        var me = this.thePlayerObj();
        var config = this.config;
        var fileIdx = this.state.fileIdx;
        this.state.fileIdx++;

        if (config.playList[fileIdx]) {
            me.src = config.playList[fileIdx];
            me.load();

        }
        else if (config.loop && fileIdx == config.playList.length) {
            this.state.fileIdx = 0;
            this.loadFromPlayList()
        }

    }.bind(this);
    this.view = function () {
        var self = this;
        var videoView = [
            m("video",
                {
                    controls: 'controls',
                    height: self.config.dimensions.h,
                    width: self.config.dimensions.w,
                    oncanplay: function () {
                        if (self.config.autoPlay) {
                            self.playIt()
                        }
                    },
                    config: function (element, isinit) {
                        if (isinit) {
                            return
                        }
                        self.thePlayerObj(element);

                        self.loadFromPlayList()

                    },
                    onended: self.loadFromPlayList,
                    ontimeupdate:function(evt){
                        self.state.time=self.thePlayerObj().currentTime;
                    }

                },
                m("source",
                    {
                        src: '',
                        type: "video/mp4"
                    })
            )
        ];

        videoView.push(m.component(overlayControls, self));

        return [m('.videoContainer', {

            height: self.config.dimensions.h,
            width: self.config.dimensions.w,
            style: {
                position: "relative",
                width: self.config.dimensions.w,
                height: self.config.dimensions.h
            }
        }, videoView)]
    }
};

/*
 The custom overlay for the controls:
 */
var overlayControls = {

    overlayPlay: function (parent) {

        parent.playIt()
    },
    controller: function () {
    },
    view: function (ctrl, parent) {
        var self = this;

        this.controlsConfig = {
            playUrl: "url('file://C:/wamp/www/mithPlayer/assets/img/playBtn.png')",
            playDimensions: {h: "100px", w: "100px"},
            pauseUrl: "url('file://C:/wamp/www/mithPlayer/assets/img/pauseBtn.png')",
            pauseDimensions: {h: "25px", w: "25px"}
        };

        return m('.btns',
            m("div.playBtn",
                {
                    width: parent.config.dimensions.w,
                    height: parent.config.dimensions.h,
                    style: {
                        position: "absolute",
                        left: "35%",
                        top: "20%",
                        color: "red",
                        height: this.controlsConfig.playDimensions.h,
                        width: this.controlsConfig.playDimensions.w,
                        backgroundImage: this.controlsConfig.playUrl,
                        backgroundRepeat: "no-repeat",
                        display: parent.state.playing ? "none" : "block",
                        backgroundSize: "cover"
                    },
                    onclick: function () {
                        self.overlayPlay(parent)
                    }
                }
            ),
            m('.pauseBtn', {
                    style: {
                        opacity: .5,
                        position: "absolute",
                        left: "5px",
                        bottom: "5px",
                        color: "red",
                        height: this.controlsConfig.pauseDimensions.h,
                        width: this.controlsConfig.pauseDimensions.w,
                        backgroundImage: this.controlsConfig.pauseUrl,
                        backgroundRepeat: "no-repeat",
                        display: parent.state.playing ? "block" : "none",
                        backgroundSize: "cover"
                    },
                    onclick: parent.playIt.bind(parent)
                }
            ),
            m('.seek',parent.state.time)
        )
    }
};

myPlayer = new Player();
m.mount(document.body, myPlayer);
