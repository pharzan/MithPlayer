var Player = require('./lib/player.js').Player;
var overlayControls = require('./lib/overlayControls.js').overlayControls;

var subtitles = {
    0: {
        start: 1,
        end: 10,
        caption: 'first subtitle'
    },

    2: {
        start: 20,
        end: 30,
        caption: 'third one'
    }

};
var overlaySubtitles = {
    state: {
        currentSub: ''
    },
    controller: function() {
        this.subIdxs = Object.keys(subtitles);


    },

    view: function(ctrl, parent) {
        var self = this;

        ctrl.subIdxs.map(function(subIdx) {

            if (self._isInBetween(parent.state.time, subtitles[subIdx].start, subtitles[subIdx].end))
                self.state.currentSub = subtitles[subIdx].caption;
            else if (parent.state.time >= subtitles[subIdx].start)
                self.state.currentSub = '';
        });

        return m('.subtitle', this.state.currentSub);
    },
    _isInBetween: function(x, min, max) {
        return x >= min && x <= max;
    }
};

var myPlayer = new Player();

myPlayer.loadPlugin(overlayControls);
myPlayer.loadPlugin(overlaySubtitles);


var main = {
    view: function() {

        return [m('',
                m.component(myPlayer)

            ), m('.demo', {
                    style: {
                        position: 'absolute',
                        top: myPlayer.config.dimensions.h + 50 + "px"
                    }
                },
                m('button', {
                    onclick() {
                        myPlayer.playToggle();
                    }
                }, 'play/stop'),
                m('button', {
                    onclick() {
                        myPlayer.speed(0.5);
                    }
                }, 'speed Slow'),
                m('button', {
                    onclick() {
                        myPlayer.speed(1);
                    }
                }, 'speed Normal'),
                m('button', {
                    onclick() {
                        myPlayer.speed(2);
                    }
                }, 'speed Fast'),
                m('button', {
                    onclick() {
                        myPlayer.config.dimensions.h = window.innerHeight - 100;
                        myPlayer.config.dimensions.w = window.innerWidth - 50;
                        // console.log(myPlayer.videoElement.height=window.innerHeight)
                        // myPlayer.videoElement.width=window.innerWidth;
                    }
                }, 'Bigger'),
                m('', 'current Time: ', m('span', myPlayer.state.time)),
                m('', 'current Speed: ', m('span', myPlayer.state.speed)),
                m('', 'current File: ', m('span', myPlayer.state.currentPlaying)),
                m('', 'volume: ', m('span', Math.round(myPlayer.state.volume))),
                m('', 'mute: ', m('span', myPlayer.state.mute)),
                m('', 'current Subtitle: ', m('span', overlaySubtitles.state.currentSub !== 'undefined' ? overlaySubtitles.state.currentSub : 'none'))
            )

        ]
    }
}

m.mount(document.body, main);
