let SVG_SIZE = 100;
let STROKE_WIDTH = 8;
let RADIUS = (SVG_SIZE / 2) - (STROKE_WIDTH / 2);
let CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Progress(selector) {
  this.container = document.querySelector(selector);

  if (!this.container) {
    console.error('Progress: элемент не найден по селектору ' + selector);
    return;
  }

  this._value    = 0;
  this._animated = false;
  this._hidden   = false;

  this._buildSVG();
}

Progress.prototype._buildSVG = function() {
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 ' + SVG_SIZE + ' ' + SVG_SIZE);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  let cx = SVG_SIZE / 2;
  let cy = SVG_SIZE / 2;

  let trackCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  trackCircle.setAttribute('cx', cx);
  trackCircle.setAttribute('cy', cy);
  trackCircle.setAttribute('r', RADIUS);
  trackCircle.setAttribute('fill', 'none');
  trackCircle.setAttribute('stroke', '#e8e8ef');
  trackCircle.setAttribute('stroke-width', STROKE_WIDTH);

  let progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  progressCircle.setAttribute('cx', cx);
  progressCircle.setAttribute('cy', cy);
  progressCircle.setAttribute('r', RADIUS);
  progressCircle.setAttribute('fill', 'none');
  progressCircle.setAttribute('stroke', '#3700ff');
  progressCircle.setAttribute('stroke-width', STROKE_WIDTH);
  progressCircle.setAttribute('stroke-linecap', 'round');
  progressCircle.setAttribute('stroke-dasharray', CIRCUMFERENCE);
  progressCircle.setAttribute('stroke-dashoffset', CIRCUMFERENCE);

  svg.appendChild(trackCircle);
  svg.appendChild(progressCircle);

  this.container.appendChild(svg);
  this._arc = progressCircle;
};

Progress.prototype.setValue = function(percent) {
  percent = parseFloat(percent);

  if (isNaN(percent)) percent = 0;
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  this._value = percent;

  let offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  // КОСТЫЛЬ: при 100% stroke-linecap: round оставляет gap
  // я знаю, что это не лучший способ, но работает
  if (percent === 100) {
    offset = -0.5;
  }

  this._arc.setAttribute('stroke-dashoffset', offset);
};

Progress.prototype.setAnimated = function(on) {
  this._animated = !!on;

  if (on) {
    this.container.classList.add('progress--animated');
  } else {
    this.container.classList.remove('progress--animated');
    var self = this;
    setTimeout(function() {
      var svg = self.container.querySelector('svg');
      if (svg) {
        svg.style.transform = '';
      }
    }, 50);
  }
};

Progress.prototype.setHidden = function(on) {
  this._hidden = !!on;

  if (on) {
    this.container.classList.add('progress--hidden');
  } else {
    this.container.classList.remove('progress--hidden');
  }
};