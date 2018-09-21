AFRAME.registerComponent('saber-controls', {
  schema: {
    enabled: {default: false},
    hand: {default: 'right', oneOf: ['left', 'right']}
  },

  init: function () {
    var el = this.el;
    var data = this.data;

    this.controllerType = '';

    el.addEventListener('controllerconnected', this.initSaber.bind(this));

    const hand = {hand: data.hand, model: false};
    el.setAttribute('oculus-touch-controls', hand);
    el.setAttribute('vive-controls', hand);
    el.setAttribute('windows-motion-controls', hand);

    this.bladeEl = this.el.querySelector('.blade');
  },

  update: function (oldData) {
    if (!oldData.bladeEnabled  && this.data.bladeEnabled) {
      this.bladeEl.emit('drawblade');
    }
  },

  tick: function () {
    if (!this.data.enabled) { return; }
    this.boundingBox.setFromObject(this.bladeEl.getObject3D('mesh'));
  },

  initSaber: function (evt) {
    this.boundingBox = new THREE.Box3();
    this.controllerType = evt.detail.name;
    this.el.setAttribute('cursor', this.config[this.controllerType].cursor || {});
  },

  config: {
    'oculus-touch-controls': {
      cursor: {
        downEvents: [
          'triggerdown',
          'gripdown',
          'abuttondown',
          'bbuttondown',
          'xbuttondown',
          'ybuttondown',
        ],
        upEvents: [
          'triggerup',
          'gripup',
          'abuttonup',
          'bbuttonup',
          'xbuttonup',
          'ybuttonup',
        ],
      },
    },

    'vive-controls': {
      cursor: {
        downEvents: ['trackpaddown', 'triggerdown', 'gripdown'],
        upEvents: ['trackpadup', 'triggerup', 'gripup'],
      },
    },

    'windows-motion-controls': {
      cursor: {
        downEvents: ['trackpaddown', 'triggerdown', 'gripdown'],
        upEvents: ['trackpadup', 'triggerup', 'gripup'],
      },
    }
  }
});
