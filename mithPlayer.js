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
        time: 0,
        duration: 0,
        speed: 0,
        vol: 1
    };

    this.thePlayerObj = m.prop();

    this.playIt = function () {
        var me = this.thePlayerObj();

        if (me.paused) {
            this.state.playing = true;
            me.play();
        } else {
            this.state.playing = false;
            me.pause();
        }
    };

    this.seek = function (time) {
        var self = this;
        self.thePlayerObj().currentTime = time;
        self.playIt()
    };

    this.speed = function (speed) {
        var self = this;
        self.thePlayerObj().playbackRate = speed
    };

    this.volume = function (v) {
        var self = this;
        if (v == 1 && self.state.vol < 1) {
            self.state.vol = self.state.vol + 0.1;
            self.thePlayerObj().volume = self.state.vol
        }
        if (v == -1 && self.state.vol > 0.1) {
            self.state.vol = self.state.vol - 0.1;
            self.thePlayerObj().volume = self.state.vol
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

                    height: self.config.dimensions.h,
                    width: self.config.dimensions.w,
                    oncanplay: function () {
                        if (self.config.autoPlay) {
                            self.state.duration = self.thePlayerObj().duration
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
                    ontimeupdate: function (evt) {
                        self.state.time = self.thePlayerObj().currentTime;
                    }

                },
                m("source",
                    {
                        src: '',
                        type: "video/mp4"
                    }
                )
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
                        opacity: 1,
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
            m('progress', {
                    max: Math.floor(parent.state.duration),
                    value: Math.floor(parent.state.time),
                    style: {
                        left: "35px",
                        position: "absolute",
                        bottom: "5px",
                        background: "#fff",
                        color: "red",
                        width: "50%"
                    },
                    onclick: function (e) {
                        var clickedTime = ((e.pageX - this.offsetLeft) * parent.state.duration) / e.target.offsetWidth;
                        parent.seek(clickedTime);
                    }
                }
            ),
            m('span', {
                style: {
                    position: 'absolute',
                    color: "white",
                    bottom: "5px",
                    left: "60%"
                },
                onclick: function () {
                    parent.speed(0.5);
                }
            }, '<<'),
            m('span', {
                style: {
                    position: 'absolute',
                    color: "white",
                    bottom: "5px",
                    left: "65%"
                },
                onclick: function () {
                    parent.speed(1.0);
                }
            }, '--'),
            m('span', {
                style: {
                    position: 'absolute',
                    color: "white",
                    bottom: "5px",
                    left: "70%"
                },
                onclick: function () {
                    parent.speed(2);
                }
            }, '>>'),
            m('span', {
                style: {
                    position: 'absolute',
                    color: "white",
                    bottom: "5px",
                    left: "75%"
                },
                onclick: function () {
                    parent.volume(1)
                }
            }, '++'),
            m('span', {
                style: {
                    position: 'absolute',
                    color: "white",
                    bottom: "5px",
                    left: "80%"
                },
                onclick: function () {
                    parent.volume(-1)
                }
            }, '--')
        )

    }
};

myPlayer = new Player();
m.mount(document.body, myPlayer);
