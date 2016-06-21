var EventSystem = {
    queue: {},
    publish: function (event, data) {
      var queue = this.queue[event];

      if (typeof queue === 'undefined') {
        return false;
      }

      // while(queue.length > 0) {
      //   (queue.shift())(data);
      // }

      queue.forEach(function (item) {
          item(data);
      })

      return true;
    },
    subscribe: function(event, callback) {
      if (typeof this.queue[event] === 'undefined') {
        this.queue[event] = [];
      }

      this.queue[event].push(callback);
    }
}

module.exports = EventSystem;