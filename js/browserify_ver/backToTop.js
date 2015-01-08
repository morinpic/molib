var $ = require('jquery');

function backToTop(args) {
  this.$trigger = $(args.trigger);

  this.init();
}

var proto = backToTop.prototype;

proto.init = function () {
  this.setEvents();
};

proto.setEvents = function () {
  this.$trigger.click(function(e) {
    e.preventDefault();
    $('body, html').animate({ scrollTop: 0 }, 500);
  });
};

module.exports = backToTop;