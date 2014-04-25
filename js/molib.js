'use strict';

var MOLIB = {};

(function(MOLIB){
  //Carousel
  MOLIB.carousel = function (args) {
    this.targetId = $(args.targetId);
    this.targetContents = this.targetId.find(args.contents);
    this.lamp = (args.lamp) ? $(args.lamp): false;
    this.autoChange = (args.autoChange) ? args.autoChange: false;
    this.autoTimer = (args.autoTimer) ? args.autoTimer: 5000;
    this.loop = (args.loop) ? args.loop: false;
    this.btnPrev = (args.btn) ? $(args.btn.prev): false;
    this.btnNext = (args.btn) ? $(args.btn.next): false;
    this.btnFlag = (args.btn) ? true: false;
    this.nextAnimationFlag = false;
    this.prevAnimationFlag = false;

    this.lamps = [];
    this.colWidth = 0;
    this.colNum = 0;
    this.colPos = 0;
    this.colOffset = 1;

    this.init();
  }

  var proto = MOLIB.carousel.prototype;

  proto.init = function() {
    this.initDom();
    this.initLamp();
    this.autoChangeFunc();
  }

  proto.initDom = function(){
    this.colWidth = this.targetContents.children('.item').outerWidth(true),
    this.colNum = this.targetContents.children('.item').length;
    this.targetContents.css('width', (this.colWidth * this.colNum) + 'px');

    if(this.loop){
      this.targetContents.children('.item:last').prependTo(this.targetContents);
      this.targetContents.css("margin-left", - this.colWidth + 'px');
    };

    if(this.btnFlag){
      this.setNextEvent();
      this.setPrevEvent();
      this.chcekPostion();
    }
  }

  proto.nextAnimation = function(){
    var self = this;

    this.nextAnimationFlag = true;

    this.targetContents.animate({
        marginLeft: parseInt(self.targetContents.css('margin-left')) - (self.colWidth * self.colOffset) + 'px'
      },
      'show', function(){
        if(self.loop){
          self.targetContents.find('div.item:first').appendTo(self.targetContents);
          self.targetContents.css("margin-left", - self.colWidth + 'px');
          self.colPos %= self.colNum;
        }
        self.chcekPostion();
        self.setLamps();
        self.nextAnimationFlag = false;
    });
  }

  proto.prevAnimation = function(){
    var self = this;

    this.prevAnimationFlag = true;

    this.targetContents.animate({
        marginLeft: parseInt(self.targetContents.css('margin-left')) + (self.colWidth * self.colOffset) + 'px'
      },
      'show', function(){
        if(self.loop){
          self.targetContents.find('div.item:last').prependTo(self.targetContents);
          self.targetContents.css("margin-left", - self.colWidth + 'px');
          if(self.colPos < 0) self.colPos += self.colNum;
        }
        self.chcekPostion();
        self.setLamps();
        self.prevAnimationFlag = false;
    });
  }

  proto.setNextEvent = function(){
    var self = this;
    this.btnNext.click(function(){
      if(!self.nextAnimationFlag){
        self.colPos++;
        self.colOffset = 1;
        self.nextAnimation();
      }
    });
  }

  proto.setPrevEvent = function(){
    var self = this;
    this.btnPrev.click(function(){
      if(!self.prevAnimationFlag){
        self.colPos--;
        self.colOffset = 1;
        self.prevAnimation();
      }
    });
  }

  proto.autoChangeFunc = function(){
    if(this.autoChange){
      var self = this;
      setInterval(function(){
        if(!self.nextAnimationFlag){
          self.colPos++;
          self.colOffset = 1;
          self.nextAnimation();
        }
      }, this.autoTimer);
    }
  }

  proto.chcekPostion = function(){
    if(this.btnFlag){
      if(this.btnNext.attr('disabled') !== undefined) this.btnNext.removeAttr('disabled');
      if(this.btnPrev.attr('disabled') !== undefined) this.btnPrev.removeAttr('disabled');
    }
    if(!this.loop){
      if(this.colPos == this.colNum - 1){
        this.btnNext.attr('disabled', true);
      }
      else if(this.colPos == 0){
        this.btnPrev.attr('disabled', true);
      }
    }
  }

  proto.initLamp = function(){
    var self = this;
    if(this.lamp){
      for(var i = 0; i < this.colNum; i++){
        this.lamps[i] = $("<div>");
        (function(pos){
          self.lamps[pos].click(function() {
            if(self.colPos < pos){
              if(!self.nextAnimationFlag){
                self.colOffset = pos - self.colPos;
                self.colPos = pos;
                self.nextAnimation();
              }
            }
            else if(self.colPos > pos){
              if(!self.prevAnimationFlag){
                self.colOffset = self.colPos - pos;
                self.colPos = pos;
                self.prevAnimation();
              }
            }
          });
        })(i);
        this.lamp.append(this.lamps[i]);
      }
      this.setLamps();
    }
  }

  proto.setLamps = function(){
    if(this.lamp){
      console.log(this.colPos);
      for(var i = 0; i < this.colNum; i++){
        this.lamps[i].removeClass('current');
      }
      this.lamps[this.colPos].addClass('current');
    }
  }

})(MOLIB || (MOLIB = {}));
