(function () {
  var config = window.FALLING_CONFIG || { type: 'sakura', count: 30 };
  if (!config.enable) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'falling-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none'; // 穿透點擊，不影響頁面按鈕互動
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var width = (canvas.width = window.innerWidth);
  var height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  var particles = [];
  var particleCount = config.count || 30;

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.size = Math.random() * 8 + 6; // 尺寸
    this.speedY = Math.random() * 1.5 + 0.8; // 下落速度
    this.speedX = Math.random() * 1 - 0.5; // 左右漂移
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 1.5;
    this.opacity = Math.random() * 0.5 + 0.5;
  };

  Particle.prototype.update = function () {
    this.y += this.speedY;
    this.x += Math.sin(this.y / 30) + this.speedX;
    this.rotation += this.rotationSpeed;

    if (this.y > height || this.x < -20 || this.x > width + 20) {
      this.reset();
      this.y = -10;
    }
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;

    if (config.type === 'snow') {
      // 畫雪花（白色圓點帶柔光）
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    } else {
      // 畫櫻花瓣（粉色橢圓/花瓣狀）
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
      ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
      ctx.fillStyle = '#ffb7c5'; // 櫻花粉色
      ctx.fill();
    }

    ctx.restore();
  };

  for (var i = 0; i < particleCount; i++) {
    var p = new Particle();
    p.y = Math.random() * height; // 初始隨機分布全屏
    particles.push(p);
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(render);
  }

  render();
})();