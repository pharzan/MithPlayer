exports.Player = function() {
    var self = this;
    this.config = {
        dimensions: {
            w: 375,
            h: 225
        },
        autoPlay: true,
        playList: [
            './videos/bunny.mp4',
            './videos/lego.mp4',
            './videos/happyfit2.mp4',

        ],
        loop: true
    };

    this.plugins = [];

    this.state = {
        playing: false,
        finished: false,
        fileIdx: 0,
        time: 0,
        duration: 0,
        speed: 1,
        volume: 25,
        currentPlaying: '',
        mute: false
    };

    this.playToggle = function() {
        var vidElement = this.videoElement;
        m.startComputation();
        if (vidElement.paused) {
            self.state.playing = true;
            vidElement.play();
        } else {
            self.state.playing = false;
            vidElement.pause();
        }
        m.endComputation();
    };

    this.mute = function() {
        this.state.mute = !this.state.mute;
        this.videoElement.muted = this.state.mute;

    };

    this.seek = function(time) {
        var self = this;

        self.videoElement.currentTime = time;
        //self.playToggle();
    };

    this.speed = function(speed) {
        var self = this;
        if (speed) {
            self.videoElement.playbackRate = speed;
            self.state.speed = speed;
        } else {
            switch (self.state.speed) {
                case 1:
                    self.state.speed = 2;
                    break;
                case 2:
                    self.state.speed = 0.5;
                    break;
                case 0.5:
                    self.state.speed = 1;
                    break;
            }
            this.speed(self.state.speed);

        }

    };

    this.volume = function(v) {
        var self = this;
        if (v == 1 && self.state.vol < 1) {
            self.state.vol = self.state.vol + 0.1;
            self.videoElement.volume = self.state.vol;
        }
        if (v == -1 && self.state.vol > 0.1) {
            self.state.vol = self.state.vol - 0.1;
            self.videoElement.volume = self.state.vol;
        }
    };

    this.setVolume = function(v) {
        var self = this;
        if (v > 1)
            v = 1;
        if (v < 0)
            v = 0;

        self.sourceElement.volume = v;
    };

    this.sizeChange = function(h, w) {
        this.config.dimensions.h = h;
        this.config.dimensions.w = w;
    };

    this.loadFromPlayList = function() {

        var config = self.config;
        var fileIdx = self.state.fileIdx;
        self.setVolume(self.state.volume);
        self.state.fileIdx++;

        if (typeof config.playList[fileIdx] !== 'undefined') {

            self.sourceElement.src = self.config.playList[fileIdx];
            self.state.currentPlaying = self.config.playList[fileIdx];
        } else if (config.loop && fileIdx == config.playList.length) {
            self.state.fileIdx = 0;
            self.state.currentPlaying = self.config.playList[fileIdx];
            self.loadFromPlayList();
        }

    };

    this.loadPlugin = function(plugin) {
        self.plugins.push(plugin);
    };

    this.controller = function() {

    };

    this.view = function(ctrl) {
        var self = this;
        return m('',
            m('.videoContainer', {
                    style: {
                        width: self.config.dimensions.w + 'px',
                        height: self.config.dimensions.h + 'px'
                    }
                },
                m("video", {
                        style: {
                            width: self.config.dimensions.w + 'px',
                            height: self.config.dimensions.h + 'px'
                        },

                        config: function(element, isinit) {
                            if (isinit) {
                                return;
                            }
                            self.videoElement = element;

                            setTimeout(function() {
                                self.playToggle();

                            }, 1);
                        },
                        oncanplay: function() {
                            self.state.duration = self.videoElement.duration;
                        },
                        onended: function() {
                            self.loadFromPlayList();
                            self.videoElement.load();
                            self.playToggle();
                        }
                    },

                    m("source", {
                            config: function(element, isinit) {
                                if (isinit) {
                                    return;
                                }
                                self.sourceElement = element;
                                self.loadFromPlayList();

                            },
                            src: '',
                            type: "video/mp4",
                            oncanplay: function() {
                                if (self.config.autoPlay) {
                                    self.playToggle();
                                }
                            },

                            ontimeupdate: function(evt) {
                                self.state.time = self.sourceElement.currentTime;
                            }
                        }

                    )
                ),
                self.plugins.map(function(plugin) {
                    return m.component(plugin, self);
                }))
        );
    };
};
