var Player = function () {
    var self=this;
    this.config = {
        dimensions: {//w: "300px", h: "225px",
		     w:300,h:225
		    },
        autoPlay: true,
        playList: [
            './videos/bunny.mp4',
            './videos/lego.mp4',
            './videos/happyfit2.mp4'
        ],
        loop: true
    };

    this.plugins=[];
    
    this.state = {
        playing: false,
        finished: false,
        fileIdx: 0,
        time: 0,
        duration: 0,
        speed: 1,
        vol: 1,
	currentPlaying:'',
	mute:false
    };
    
    this.playToggle = function () {
        var me = this.videoElement;

        if (me.paused) {
            this.state.playing = true;
            me.play();
        } else {
            this.state.playing = false;
            me.pause();
        }
    };
    
    this.mute = function () {
        this.state.mute = !this.state.mute;
        this.videoElement.muted=this.state.mute;
            
    };
    
    this.seek = function (time) {
        var self = this;
        self.videoElement.currentTime = time;
        self.playToggle();
    };

    this.speed = function (speed) {
        var self = this;
	if(speed){
        self.videoElement.playbackRate = speed;
	    self.state.speed=speed;}
	else{
	    switch(self.state.speed){
	    case 1:
		self.state.speed=2;
		break;
	    case 2:
		self.state.speed=0.5;
		break;
	    case 0.5:
		self.state.speed=1;
		break;
	    }
	    this.speed(self.state.speed);
	    
	}
	    
    };

    this.volume = function (v) {
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

    this.loadFromPlayList = function () {
	
        var config = self.config;
        var fileIdx = self.state.fileIdx;
	
	self.state.fileIdx++;
        if (typeof config.playList[fileIdx]!=='undefined') {
            self.videoElement.src = self.config.playList[fileIdx];
            self.videoElement.load();
	    self.state.currentPlaying=self.config.playList[fileIdx];
        }
        else if (config.loop && fileIdx == config.playList.length) {
            self.state.fileIdx = 0;
	    self.state.currentPlaying=self.config.playList[fileIdx];
            self.loadFromPlayList();
        }

    };

    this.controller=function(){
	 self.plugins.push(overlayControls);
	//self.plugins.push(overlaySubtitle);
    };
    
    this.view = function (ctrl) {
        var self = this;
        return m('',
		 m('.videoContainer',{style:{
		    width:self.config.dimensions.w+'px',
		    height:self.config.dimensions.h+'px'
		 }},
	      m("video",
                {style:{
		    width:self.config.dimensions.w+'px',
		    height:self.config.dimensions.h+'px'
		},
			oncanplay: function () {
                            if (self.config.autoPlay) {
				self.state.duration = self.videoElement.duration;
				self.playToggle();
                            }
			},
			config: function (element, isinit) {
                            if (isinit) {
				return;
                            }
                            self.videoElement=element;
			    self.loadFromPlayList();
			},
			onended: self.loadFromPlayList,
			ontimeupdate: function (evt) {
                            self.state.time = self.videoElement.currentTime;
			}
                    },
                    m("source",
                      {
                          src: '',
                          type: "video/mp4"
                      }
                     )
	       ),
	      self.plugins.map(function(plugin){
		   return m.component(plugin,self);
	      }))
		);
    };
};

/*
 The custom overlay for the controls:
 */
var overlayControls = {

    overlayPlay: function (parent) {
        parent.playToggle();
    },
    controller: function () {
    },
    view: function (ctrl, parent) {
        var self = this;

        this.controlsConfig = {
            playUrl: "url('icons/play.png')",
            playDimensions: {h: "100px", w: "100px"},
            pauseUrl: "url('icons/pause.png')",
	    ffUrl:"url('icons/ff.png')",
	    volUp:"url('icons/vup.png')",
	    volDown:"url('icons/vdown.png')",
	    mute:"url('icons/mute.png')",
	    speedToggle:"url('icons/snail.png')",
            pauseDimensions: {h: "25px", w: "25px"}
        };
	console.log( parent.config.dimensions.w)
        return m('.btns',
            m("div.playBtn",
                {
                    width: parent.config.dimensions.w+'px',
                    height: parent.config.dimensions.h+'px',
                    style: {
                        position: "absolute",
                        left: (parent.config.dimensions.w/2-50)+'px',
                        top: (parent.config.dimensions.h/2-50)+'px',
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
                    onclick: function () {
                        self.overlayPlay(parent);
                    }
                }
             ),
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
                }
            ),
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
                    left: "62%",
		    backgroundImage:this.controlsConfig.speedToggle,
		    backgroundSize: "contain",
		    backgroundRepeat: "no-repeat",
		    width: "20px",
		    height: "20px"
	       },
                onclick: function () {
                    parent.speed();
                }
            }),
            m('span', {
                style: {
                    position: 'absolute',
                    color: "white",
                    bottom: "5px",
                    left: "70%",
		    backgroundImage:this.controlsConfig.ffUrl,
		    backgroundSize: "contain",
		    backgroundRepeat: "no-repeat",
		    width: "20px",
		    height: "20px"
		    
                },
                onclick: function () {
                    parent.speed(2);
                }
            }),
            m('span', {
                style: {
                    position: 'absolute',
                    color: "white",
                    bottom: "5px",
                    left: "75%",
		    backgroundImage:this.controlsConfig.volUp,
		    backgroundSize: "contain",
		    backgroundRepeat: "no-repeat",
		    width: "20px",
		    height: "20px"
                },
                onclick: function () {
                    parent.volume(1)
                }
            }),
            m('span', {
                style: {
                    position: 'absolute',
                    color: "white",
                    bottom: "5px",
                    left: "80%",
		    backgroundImage:this.controlsConfig.volDown,
		    backgroundSize: "contain",
		    backgroundRepeat: "no-repeat",
		    width: "20px",
		    height: "20px"
		    
                },
                onclick: function () {
                    parent.volume(-1)
                }
            }),
            m('span', {
                style: {
                    position: 'absolute',
                    color: "white",
                    bottom: "5px",
                    left: "87%",
		    backgroundImage:this.controlsConfig.mute,
		    backgroundSize: "contain",
		    backgroundRepeat: "no-repeat",
		    width: "20px",
		    height: "20px"
		    
                },
                onclick: function () {
                    parent.mute()
                }
            })

		  )
        )

    }
};

var subtitles={
    0:{
	start:1,
	end:10,
	caption:'first subtitle'
    },
    
    2:{
	start:20,
	end:30,
	caption:'third one'
    }

};

var overlaySubtitle={
    state:{
	currentSub:''
    },
    controller:function(){
	this.subIdxs=Object.keys(subtitles);
	

    },
    
    view:function(ctrl,parent){
	var self=this;
	
	ctrl.subIdxs.map(function(subIdx){
	    
	    if(self._isInBetween(parent.state.time,subtitles[subIdx].start,subtitles[subIdx].end))
		self.state.currentSub=subtitles[subIdx].caption;
	    else if(parent.state.time >= subtitles[subIdx].start )
		self.state.currentSub='';
	});
	
	return m('.subtitle',this.state.currentSub);
    },
    _isInBetween:function(x,min,max){
	return x >= min && x <= max;
    }
};

var myPlayer = new Player();

var main={
    view:function(){
	
	return [m('',
		 m.component(myPlayer)
		 
		 ),m('.demo',{
		     style:{
			 position: 'absolute',
			 top: myPlayer.config.dimensions.h+50+"px"
		     }
		 },
		     m('button',{onclick(){
		     myPlayer.playToggle();
		     }},'play/stop'),
		     m('button',{onclick(){
		     myPlayer.speed(0.5);
		     }},'speed Slow'),
		     m('button',{onclick(){
		     myPlayer.speed(1);
		     }},'speed Normal'),
		     m('button',{onclick(){
		     myPlayer.speed(2);
		     }},'speed Fast'),
		     m('button',{onclick(){
			 myPlayer.config.dimensions.h=window.innerHeight-100;
			 myPlayer.config.dimensions.w=window.innerWidth-50;
			 // console.log(myPlayer.videoElement.height=window.innerHeight)
			 // myPlayer.videoElement.width=window.innerWidth;
		     }},'Bigger'),
		m('','current Time: ',m('span',myPlayer.state.time)),
		m('','current Speed: ',m('span',myPlayer.state.speed)),
		m('','current File: ',m('span',myPlayer.state.currentPlaying)),
		m('','mute: ',m('span',myPlayer.state.mute)),
		     m('','current File: ',m('span',overlaySubtitle.state.currentSub))
		    )
		
	       ]
    }
}

m.mount(document.body, main);
