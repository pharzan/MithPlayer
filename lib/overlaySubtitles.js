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

exports.overlaySubtitles = overlaySubtitles;
