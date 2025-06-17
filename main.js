import { getStudyData } from './data.js';

// --- Surprise Features ---
// 1. Progress Tracker (localStorage)
// 2. Random Daily Question
// 3. Bookmark Questions
// 4. Print/Export Notes
// 5. Fun Confetti for Correct Answers

function confettiBurst() {
  // Simple confetti burst using emoji
  const c = document.createElement('div');
  c.textContent = '🎉';
  c.style.position = 'fixed';
  c.style.left = Math.random() * 80 + 'vw';
  c.style.top = Math.random() * 60 + 'vh';
  c.style.fontSize = '3rem';
  c.style.pointerEvents = 'none';
  c.style.zIndex = 9999;
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 1200);
}

function saveProgress(topicId, qIdx) {
  let prog = JSON.parse(localStorage.getItem('az900-progress') || '{}');
  prog[topicId] = prog[topicId] || [];
  if (!prog[topicId].includes(qIdx)) prog[topicId].push(qIdx);
  localStorage.setItem('az900-progress', JSON.stringify(prog));
}

function getProgress() {
  return JSON.parse(localStorage.getItem('az900-progress') || '{}');
}

function saveBookmark(topicId, qIdx) {
  let bm = JSON.parse(localStorage.getItem('az900-bookmarks') || '{}');
  bm[topicId] = bm[topicId] || [];
  if (!bm[topicId].includes(qIdx)) bm[topicId].push(qIdx);
  localStorage.setItem('az900-bookmarks', JSON.stringify(bm));
}

function getBookmarks() {
  return JSON.parse(localStorage.getItem('az900-bookmarks') || '{}');
}

function showDailyQuestion(data) {
  const all = [];
  data.topics.forEach((t, ti) => t.exam_questions.forEach((q, qi) => all.push({ topic: t, q, ti, qi })));
  const idx = new Date().getDate() % all.length;
  const { topic, q, ti, qi } = all[idx];
  const daily = document.getElementById('daily-question');
  daily.innerHTML = `<div class="mb-2 text-lg font-bold text-blue-600">Daily Challenge</div>
    <div class="mb-2">${q.question}</div>`;
  q.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'mr-2 mb-2 px-3 py-1 rounded bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700 transition';
    btn.textContent = choice;
    btn.onclick = () => {
      if (choice === q.answer) {
        btn.classList.add('bg-green-200', 'dark:bg-green-700');
        confettiBurst();
        saveProgress(topic.id, qi);
      } else {
        btn.classList.add('bg-red-200', 'dark:bg-red-700');
      }
    };
    daily.appendChild(btn);
  });
  const exp = document.createElement('div');
  exp.className = 'mt-2 text-sm text-gray-700 dark:text-gray-300 hidden';
  exp.textContent = 'Explanation: ' + q.explanation;
  daily.appendChild(exp);
}

function renderProgress(data) {
  const prog = getProgress();
  let total = 0, done = 0;
  data.topics.forEach((t, ti) => {
    total += t.exam_questions.length;
    done += (prog[t.id] || []).length;
  });
  const el = document.getElementById('progress-bar');
  el.innerHTML = `<div class="mb-2 text-sm">Progress: <span class="font-bold">${done}</span> / ${total} questions answered</div>
    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded h-3">
      <div class="bg-blue-500 h-3 rounded" style="width:${(done/total)*100}%"></div>
    </div>`;
}

function renderBookmarks(data) {
  const bm = getBookmarks();
  const el = document.getElementById('bookmarks');
  el.innerHTML = '<div class="mb-2 text-lg font-bold text-blue-600">Bookmarked Questions</div>';
  let found = false;
  data.topics.forEach((t, ti) => {
    (bm[t.id]||[]).forEach(qi => {
      found = true;
      const q = t.exam_questions[qi];
      const div = document.createElement('div');
      div.className = 'mb-2 p-2 rounded bg-yellow-50 dark:bg-yellow-900';
      div.innerHTML = `<div class="font-medium mb-1">${q.question}</div>`;
      el.appendChild(div);
    });
  });
  if (!found) el.innerHTML += '<div class="text-gray-500">No bookmarks yet.</div>';
}

function addPrintExport(data) {
  const btn = document.createElement('button');
  btn.className = 'fixed bottom-6 right-6 z-50 px-4 py-2 bg-blue-600 text-white rounded shadow-lg hover:bg-blue-700 transition';
  btn.innerHTML = 'Export Notes';
  btn.onclick = () => {
    let text = '';
    data.topics.forEach(t => {
      text += `# ${t.title}\n`;
      t.ms_learn.forEach(item => {
        if (item.type === 'info') text += item.content + '\n';
        if (item.type === 'list') item.content.forEach(li => text += '- ' + li + '\n');
      });
      text += '\n';
    });
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'az900-notes.txt';
    a.click();
  };
  document.body.appendChild(btn);
}

window.addEventListener('DOMContentLoaded', async () => {
  const data = await getStudyData();
  // Daily question
  if (document.getElementById('daily-question')) showDailyQuestion(data);
  // Progress bar
  if (document.getElementById('progress-bar')) renderProgress(data);
  // Bookmarks
  if (document.getElementById('bookmarks')) renderBookmarks(data);
  // Export/print
  addPrintExport(data);

  // Enhance all exam question cards for progress/bookmark/confetti
  document.querySelectorAll('section').forEach((section, ti) => {
    section.querySelectorAll('.mb-4.p-4').forEach((card, qi) => {
      const btns = card.querySelectorAll('button');
      btns.forEach(btn => {
        btn.onclick = () => {
          const topicId = data.topics[ti].id;
          if (btn.textContent === data.topics[ti].exam_questions[qi].answer) {
            btn.classList.add('bg-green-200', 'dark:bg-green-700');
            confettiBurst();
            saveProgress(topicId, qi);
            renderProgress(data);
          } else {
            btn.classList.add('bg-red-200', 'dark:bg-red-700');
          }
          // Bookmark button
          if (!card.querySelector('.bookmark-btn')) {
            const bmBtn = document.createElement('button');
            bmBtn.className = 'bookmark-btn ml-2 px-2 py-1 rounded bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 text-xs';
            bmBtn.textContent = 'Bookmark';
            bmBtn.onclick = () => {
              saveBookmark(topicId, qi);
              renderBookmarks(data);
            };
            card.appendChild(bmBtn);
          }
        };
      });
    });
  });
});
