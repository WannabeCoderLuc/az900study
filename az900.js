import content from './az900-content.json' assert { type: 'json' };

function createIntroSection() {
  const section = document.createElement('section');
  section.id = 'introduction';
  section.className = 'mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg';
  section.innerHTML = `
    <h2 class="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Introduction</h2>
    <p class="mb-2 text-lg">Welcome to the AZ-900 Learning Path! This site is your interactive, modern, and fully automated study companion for the Microsoft Azure Fundamentals exam. Explore MS Learn-style notes, real exam questions, and track your progress.</p>
    <ul class="list-disc pl-6 mb-2">
      <li>Study with official-style notes and explanations</li>
      <li>Practice with real exam questions</li>
      <li>Bookmark, track, and export your learning</li>
    </ul>
  `;
  return section;
}

function createTopicsSection() {
  const section = document.createElement('section');
  section.id = 'topics';
  section.className = 'mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg';
  section.innerHTML = `<h2 class="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Topics</h2>`;
  content.topics.forEach(topic => {
    section.appendChild(createTopicSection(topic));
  });
  return section;
}

function createFAQSection() {
  const section = document.createElement('section');
  section.id = 'faq';
  section.className = 'mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg';
  section.innerHTML = `
    <h2 class="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">FAQ</h2>
    <ul class="list-disc pl-6 mb-2">
      <li><b>Is this site official?</b> No, but it is inspired by Microsoft Learn and top exam prep sites.</li>
      <li><b>How do I use it?</b> Click Topics to study, try questions, and track your progress. Use Bookmarks and Export for revision.</li>
      <li><b>Is my progress saved?</b> Yes, in your browser (localStorage).</li>
    </ul>
  `;
  return section;
}

function createTopicSection(topic) {
  const section = document.createElement('section');
  section.className = 'mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg';
  // Title
  const title = document.createElement('h2');
  title.className = 'text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300';
  title.textContent = topic.title;
  section.appendChild(title);
  // MS Learn style notes
  topic.ms_learn.forEach(item => {
    if (item.type === 'info') {
      const p = document.createElement('p');
      p.className = 'mb-2 text-lg';
      p.textContent = item.content;
      section.appendChild(p);
    } else if (item.type === 'list') {
      const ul = document.createElement('ul');
      ul.className = 'list-disc pl-6 mb-2';
      item.content.forEach(li => {
        const liEl = document.createElement('li');
        liEl.textContent = li;
        ul.appendChild(liEl);
      });
      section.appendChild(ul);
    }
  });
  // Exam Questions
  const qTitle = document.createElement('h3');
  qTitle.className = 'text-xl font-semibold mt-6 mb-2 text-blue-600 dark:text-blue-200';
  qTitle.textContent = 'Sample Exam Questions';
  section.appendChild(qTitle);
  topic.exam_questions.forEach(q => {
    const card = document.createElement('div');
    card.className = 'mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900 shadow';
    const qText = document.createElement('div');
    qText.className = 'font-medium mb-2';
    qText.textContent = q.question;
    card.appendChild(qText);
    q.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'mr-2 mb-2 px-3 py-1 rounded bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700 transition';
      btn.textContent = choice;
      btn.onclick = () => {
        if (choice === q.answer) {
          btn.classList.add('bg-green-200', 'dark:bg-green-700');
        } else {
          btn.classList.add('bg-red-200', 'dark:bg-red-700');
        }
        explanation.style.display = 'block';
      };
      card.appendChild(btn);
    });
    const explanation = document.createElement('div');
    explanation.className = 'mt-2 text-sm text-gray-700 dark:text-gray-300 hidden';
    explanation.textContent = 'Explanation: ' + q.explanation;
    card.appendChild(explanation);
    section.appendChild(card);
  });
  return section;
}

function showSection(sectionId) {
  const main = document.getElementById('az900-main');
  main.innerHTML = '';
  if (sectionId === 'introduction') main.appendChild(createIntroSection());
  else if (sectionId === 'topics') main.appendChild(createTopicsSection());
  else if (sectionId === 'faq') main.appendChild(createFAQSection());
}

window.addEventListener('DOMContentLoaded', () => {
  // Default: show Introduction
  showSection('introduction');
  // Nav links
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').replace('#', '');
      showSection(id);
    });
  });
});
