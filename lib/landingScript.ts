// @ts-nocheck
// Wires up the case walk-through steps and the approve / revise buttons on the home page.
export function initLanding() {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var prev = document.getElementById('prevBtn'), next = document.getElementById('nextBtn'), label = document.getElementById('stepLabel');
  var cur = 0;
  function animate(panel) {
    panel.querySelectorAll('.fill').forEach(function (f) { f.style.width = '0%'; });
    panel.querySelectorAll('.meter i').forEach(function (m) { m.style.width = '0%'; });
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      panel.querySelectorAll('.fill').forEach(function (f) { f.style.width = f.dataset.w + '%'; });
      panel.querySelectorAll('.meter i').forEach(function (m) { m.style.width = '100%'; });
    }); });
  }
  function show(i) {
    cur = i;
    tabs.forEach(function (t, j) {
      t.setAttribute('aria-selected', j === i ? 'true' : 'false');
      t.tabIndex = j === i ? 0 : -1;
      t.classList.toggle('done', j < i);
      panels[j].hidden = j !== i;
    });
    animate(panels[i]);
    prev.disabled = i === 0;
    next.hidden = i === tabs.length - 1;
    label.textContent = 'Step ' + (i + 1) + ' of ' + tabs.length;
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var d = e.key === 'ArrowRight' ? 1 : -1;
        var n = (cur + d + tabs.length) % tabs.length; show(n); tabs[n].focus();
      }
    });
  });
  prev.addEventListener('click', function () { if (cur > 0) show(cur - 1); });
  next.addEventListener('click', function () { if (cur < tabs.length - 1) show(cur + 1); });
  // bars render at full width before any interaction
  document.querySelectorAll('.fill').forEach(function (f) { f.style.width = f.dataset.w + '%'; });

  var reviseBox = document.getElementById('reviseBox');
  reviseBox.hidden = true;
  document.getElementById('approveBtn').addEventListener('click', function () {
    reviseBox.hidden = true;
    document.getElementById('report').hidden = false;
    this.textContent = 'Approved'; this.disabled = true;
  });
  document.getElementById('reviseBtn').addEventListener('click', function () {
    document.getElementById('report').hidden = true;
    reviseBox.hidden = false;
  });
  document.getElementById('sendRevise').addEventListener('click', function () {
    document.getElementById('reviseDone').hidden = false;
    this.disabled = true; this.textContent = 'Sent';
  });
}
