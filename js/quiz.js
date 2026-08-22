/*
  Motor genérico de quiz.
  A página do quiz define, antes de incluir este script:

    window.QUIZ = {
      questions: [
        { q: "Pergunta...", options: ["a", "b", "c", "d"], correct: 0 },
        ...
      ]
    };

  Este script renderiza as perguntas dentro de <div id="quiz-root"></div>,
  cuida da seleção de alternativas, corrige ao final e mostra a nota.
*/
(function(){
  var DATA = window.QUIZ;
  var root = document.getElementById('quiz-root');
  if(!DATA || !root) return;

  var questions = DATA.questions || [];
  var answers = new Array(questions.length).fill(null);
  var corrected = false;

  var letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  function render(){
    var html = '';
    html += '<div class="quiz-result" id="quiz-result" hidden></div>';
    html += '<ol class="quiz-list">';
    questions.forEach(function(item, qi){
      html += '<li class="quiz-question-card" id="quiz-q' + qi + '">';
      html += '<div class="quiz-q-head"><span class="quiz-q-num">' + (qi + 1) + '</span><h3>' + item.q + '</h3></div>';
      html += '<div class="quiz-options" role="radiogroup">';
      item.options.forEach(function(opt, oi){
        html += '<button type="button" class="quiz-option" data-q="' + qi + '" data-o="' + oi + '" role="radio" aria-checked="false">';
        html += '<span class="quiz-option-letter">' + letters[oi] + '</span>';
        html += '<span class="quiz-option-text">' + opt + '</span>';
        html += '<span class="quiz-option-icon" aria-hidden="true"></span>';
        html += '</button>';
      });
      html += '</div>';
      html += '<p class="quiz-feedback" aria-live="polite"></p>';
      html += '</li>';
    });
    html += '</ol>';
    html += '<div class="quiz-actions">';
    html += '<p class="quiz-progress-label" id="quiz-progress-label">0 de ' + questions.length + ' respondidas</p>';
    html += '<button type="button" class="quiz-submit" id="quiz-submit">Corrigir quiz</button>';
    html += '<button type="button" class="quiz-reset" id="quiz-reset" hidden>Refazer o quiz</button>';
    html += '</div>';
    root.innerHTML = html;
    bind();
  }

  function updateProgress(){
    var answered = answers.filter(function(a){ return a !== null; }).length;
    var label = document.getElementById('quiz-progress-label');
    if(label) label.textContent = answered + ' de ' + questions.length + ' respondidas';
    var submit = document.getElementById('quiz-submit');
    if(submit) submit.disabled = answered < questions.length;
  }

  function selectOption(qi, oi){
    if(corrected) return;
    answers[qi] = oi;
    var card = document.getElementById('quiz-q' + qi);
    card.querySelectorAll('.quiz-option').forEach(function(btn){
      var isSelected = parseInt(btn.getAttribute('data-o'), 10) === oi;
      btn.classList.toggle('selected', isSelected);
      btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
    updateProgress();
  }

  function grade(){
    var answered = answers.filter(function(a){ return a !== null; }).length;
    if(answered < questions.length){
      var label = document.getElementById('quiz-progress-label');
      if(label){
        label.classList.remove('shake');
        void label.offsetWidth;
        label.textContent = 'Responda todas as ' + questions.length + ' perguntas antes de corrigir (faltam ' + (questions.length - answered) + ').';
        label.classList.add('quiz-progress-warn', 'shake');
      }
      return;
    }
    corrected = true;
    var score = 0;
    questions.forEach(function(item, qi){
      var card = document.getElementById('quiz-q' + qi);
      var chosen = answers[qi];
      var isRight = chosen === item.correct;
      if(isRight) score++;
      card.querySelectorAll('.quiz-option').forEach(function(btn){
        var oi = parseInt(btn.getAttribute('data-o'), 10);
        btn.disabled = true;
        if(oi === item.correct) btn.classList.add('correct');
        else if(oi === chosen) btn.classList.add('incorrect');
      });
      var feedback = card.querySelector('.quiz-feedback');
      if(feedback){
        feedback.textContent = isRight ? 'Certa.' : 'Errada — a resposta correta está marcada acima.';
        feedback.classList.add(isRight ? 'right' : 'wrong');
      }
      card.classList.add(isRight ? 'is-right' : 'is-wrong');
    });
    showResult(score);
    document.getElementById('quiz-submit').hidden = true;
    document.getElementById('quiz-reset').hidden = false;
    var progLabel = document.getElementById('quiz-progress-label');
    if(progLabel) progLabel.hidden = true;
  }

  function showResult(score){
    var total = questions.length;
    var pct = Math.round((score / total) * 100);
    var tier, message;
    if(pct >= 90){ tier = 'top'; message = 'Excelente! Domínio sólido do conteúdo da aula.'; }
    else if(pct >= 70){ tier = 'good'; message = 'Muito bom — revise os pontos que errou.'; }
    else if(pct >= 50){ tier = 'mid'; message = 'Bom começo — vale reler a aula com calma.'; }
    else { tier = 'low'; message = 'Releia a aula antes de seguir — ainda há bastante para fixar.'; }

    var el = document.getElementById('quiz-result');
    el.hidden = false;
    el.className = 'quiz-result show tier-' + tier;
    el.innerHTML =
      '<div class="quiz-result-score">' +
        '<span class="quiz-result-num">' + score + '</span>' +
        '<span class="quiz-result-den">/ ' + total + '</span>' +
      '</div>' +
      '<p class="quiz-result-pct">' + pct + '%</p>' +
      '<p class="quiz-result-msg">' + message + '</p>';
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function reset(){
    corrected = false;
    answers = new Array(questions.length).fill(null);
    render();
  }

  function bind(){
    root.querySelectorAll('.quiz-option').forEach(function(btn){
      btn.addEventListener('click', function(){
        selectOption(parseInt(btn.getAttribute('data-q'), 10), parseInt(btn.getAttribute('data-o'), 10));
      });
    });
    var submit = document.getElementById('quiz-submit');
    if(submit) submit.addEventListener('click', grade);
    var resetBtn = document.getElementById('quiz-reset');
    if(resetBtn) resetBtn.addEventListener('click', reset);
    updateProgress();
  }

  render();
})();
