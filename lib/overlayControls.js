exports.overlayControls = {
    showVol: false,
    overlayPlay: function(parent) {
        parent.playToggle();
    },
    controller: function() {},
    view: function(ctrl, parent) {
        var self = this;

        this.controlsConfig = {
            playUrl: "url('icons/play.png')",
            playDimensions: {
                h: "100px",
                w: "100px"
            },
            pauseUrl: "url('icons/pause.png')",
            vol: "url('icons/vol.png')",
            ffUrl: "url('icons/ff.png')",
            volUp: "url('icons/vup.png')",
            volDown: "url('icons/vdown.png')",
            mute: "url('icons/mute.png')",
            speedToggle: "url('icons/snail.png')",
            resizeBigger: "url('icons/resize.png')",
            pauseDimensions: {
                h: "25px",
                w: "25px"
            }
        };

        return m('.btns',
            m("div.playBtn", {
                width: parent.config.dimensions.w + 'px',
                height: parent.config.dimensions.h + 'px',
                style: {
                    position: "absolute",
                    left: (parent.config.dimensions.w / 2 - 50) + 'px',
                    top: (parent.config.dimensions.h / 2 - 50) + 'px',
                    width: "50%",
                    margin: "0 auto",
                    color: "red",
                    height: this.controlsConfig.playDimensions.h,
                    width: this.controlsConfig.playDimensions.w,
                    backgroundImage: this.controlsConfig.playUrl,
                    backgroundRepeat: "no-repeat",
                    display: parent.state.playing ? "none" : "block",
                    backgroundSize: "cover"
                },
                onclick: function() {
                    self.overlayPlay(parent);
                }
            }),
            m('.bottomLayer',
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
                    onclick: parent.playToggle.bind(parent)
                }),
                this.showVol ? m('.outer', {
                    onclick: function(e) {
                        //calculate percentage of clicked volume
                        var v = ((this.getClientRects()[0].bottom - e.pageY) * 100) / 57;
                        parent.state.volume = v;
                        parent.setVolume(v / 100);
                        self.showVol = false;
                    },

                }, m('.inner', {
                    style: {
                        height: parent.state.volume + "%",
                        background: "red"
                    }
                })) : m('', {
                    style: {
                        position: "absolute",
                        color: "white",
                        bottom: "5px",
                        left: "88%",
                        width: "20px",
                        height: "20px",
                        position: "absolute",
                        backgroundImage: this.controlsConfig.vol,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover"
                    },
                    onclick: function() {
                        self.showVol = true;
                    }


                }),

                m('progress', {
                    max: Math.floor(parent.state.duration),
                    value: Math.floor(parent.state.time),
                    style: {
                        left: "35px",
                        position: "absolute",
                        bottom: "5px",
                        background: "black",
                        color: "red",
                        width: "50%"
                    },
                    onclick: function(e) {
                        var clickedTime = ((e.pageX - this.offsetLeft) * parent.state.duration) / e.target.offsetWidth;
                        
                        parent.seek(clickedTime);
                    }
                }),

                m('span', {
                    style: {
                        position: 'absolute',
                        color: "white",
                        bottom: "5px",
                        left: "62%",
                        backgroundImage: this.controlsConfig.speedToggle,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "20px",
                        height: "20px"
                    },
                    onclick: function() {
                        parent.speed();
                    }
                }),
                m('span', {
                    style: {
                        position: 'absolute',
                        color: "white",
                        bottom: "5px",
                        left: "70%",
                        backgroundImage: this.controlsConfig.resizeBigger,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "20px",
                        height: "20px"

                    },
                    onclick: function() {
                        var h = 50,
                            w = 150;

                        if (parent.config.dimensions.h == 225)
                            parent.sizeChange(300, 500);
                        else
                            parent.sizeChange(225, 375);
                    }
                }),

                m('span', {
                    style: {
                        position: 'absolute',
                        color: "white",
                        bottom: "5px",
                        left: "78%",
                        backgroundImage: this.controlsConfig.mute,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "20px",
                        height: "20px"

                    },
                    onclick: function() {
                        parent.mute();
                    }
                })

            )
        );

    }
};
