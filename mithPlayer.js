 function Player () {

    this.config = {
        theVideo: m.prop(),
        theUrl: m.prop(),
        thePlugins:[]
    };

    this.init = function (element, isinit) {
        this.config.theVideo(element);
        console.info(element)
    };

    this.playIt = function () {

        var theVid = this.config.theVideo();

        if (theVid.paused) {
            theVid.play()
        } else {
            theVid.pause()
        }
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

        return [
            m.component(theOverlays),
            m("video",
                {
                    controls: "controls",
                    height: 250,
                    config: function (element, isinit) {
                        self.init(element, isinit)
                    }

                },
                m("source",
                    {
                        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
                        type: "video/mp4"

                    })
            ),
            m('div', {
                onclick: this.playIt.bind(this)
            }, 'play'),
            m('div', {
                onclick: this.loadVideo.bind(this, 'http://media.w3.org/2010/05/bunny/trailer.mp4')
            }, 'Trailer'),
            m('div', {
                onclick: this.loadVideo.bind(this, 'http://media.w3.org/2010/05/bunny/movie.mp4')
            }, 'Movie'),
            m('div', {
                onclick: this.skipVideo.bind(this, 0.1)
            }, 'Speed +'),
            m('div', {
                onclick: this.volumeVideo.bind(this, 0.1)
            }, 'Vol +')

        ]
    };

};
 var theOverlays = {
     controller: function(args) {

     },
     view: function(ctrl, args) {

         return m("div", [
             m("label", "Name"),
             m("input", "Hello")

         ])
     }
 }
myPlayer = new Player();


//myPlayer.playIt();
m.mount(document.body, myPlayer);
