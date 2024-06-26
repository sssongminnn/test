// nav function
function to_todo(){
  var todoWrap = document.getElementById('ToDo_wrap');
  var selfWrap = document.getElementById('Self_wrap');
  var btn = document.getElementById('ToDo_btn');
  var btn2 = document.getElementById('Self_btn');

  todoWrap.style.display = 'flex';
  selfWrap.style.display = 'none';
  btn.style.backgroundColor = 'antiquewhite'
  btn2.style.backgroundColor = 'rgba(0,0,0,0)'
}
function to_self(){
  var todoWrap = document.getElementById('ToDo_wrap');
  var selfWrap = document.getElementById('Self_wrap');
  var btn = document.getElementById('ToDo_btn');
  var btn2 = document.getElementById('Self_btn');
  
  todoWrap.style.display = 'none';
  selfWrap.style.display = 'flex';
  btn.style.backgroundColor = 'rgba(0,0,0,0)'
  btn2.style.backgroundColor = 'antiquewhite'
}
const calendarDates = document.getElementById("calendarDates");
const currentMonthElement = document.getElementById("currentMonth");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function renderCalendar() {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();
  currentMonthElement.textContent = `${currentYear}년 ${currentMonth + 1}월`;

  calendarDates.innerHTML = "";

  for (let i = 0; i < startDayOfWeek; i++) {
    const emptyDate = document.createElement("div");
    emptyDate.classList.add("date", "empty");
    calendarDates.appendChild(emptyDate);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateElement = document.createElement("div");
    dateElement.classList.add("date");
    dateElement.textContent = i;
    dateElement.addEventListener("click", () => {
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      updateTodoList(formattedDate);
      setAddDate(formattedDate);
    });
    calendarDates.appendChild(dateElement);
  }
}

function updateTodoList(date) {
  const todoDateElement = document.getElementById("todo-date");
  const searchResults = document.getElementById('search-results');
  todoDateElement.textContent = date;

  fetch(`/todos/${date}`)
    .then(response => response.json())
    .then(data => {
      searchResults.innerHTML = '';

      if (data.length === 0) {
        searchResults.innerHTML = '<p>No todos found for this date.</p>';
      } else {
        data.forEach(({ id, tasks, done }) => {
          tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = 'card mb-3';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'form-check-input';
            checkbox.checked = done; // Set the checkbox state based on 'done'
            checkbox.id = `task-${id}-${task}`;
            checkbox.addEventListener('change', () => {
              fetch(`/todos/${id}/toggle`, {
                method: 'PUT'
              }).then(response => {
                if (!response.ok) {
                  console.error('Failed to update task');
                }
              });
            });

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = `task-${id}-${task}`;
            label.textContent = task;

            cardBody.appendChild(checkbox);
            cardBody.appendChild(label);
            card.appendChild(cardBody);
            searchResults.appendChild(card);
          });
        });
      }
    })
    .catch(error => {
      console.error('Error fetching todos:', error);
      searchResults.innerHTML = '<p>There was an error fetching the todos.</p>';
    });
}
function setAddDate(date) {
  const addDateInput = document.getElementById('add-date');
  addDateInput.value = date;
}

renderCalendar();

prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

document.addEventListener('DOMContentLoaded', function() {
  const searchDateInput = document.getElementById('search-date');

  searchDateInput.addEventListener('change', function() {
    const searchDate = searchDateInput.value;
    updateTodoList(searchDate);
  });
});

function display_Add() {
  var add_icon = document.getElementById('addTodo_icon');
  var add_form = document.getElementById('addTodo');
  var close_icon = document.getElementById('closeTodo_icon');
  
  if(add_icon.style.display == 'block') {
    add_icon.style.display = 'none';
    add_form.style.display = 'flex';
    close_icon.style.display = 'block';
  } else {
    add_icon.style.display = 'block';
    add_form.style.display = 'none';
    close_icon.style.display = 'none';
  }
}
// 로그인 폼 보이기
function showLoginForm() {
  document.getElementById('loginFormContainer').style.display = 'block';
  document.getElementById('signupFormContainer').style.display = 'none';
}

// 회원가입 폼 보이기
function showSignupForm() {
  document.getElementById('signupFormContainer').style.display = 'block';
  document.getElementById('loginFormContainer').style.display = 'none';
}

// 로그인 폼 닫기
document.getElementById('closeLoginForm').addEventListener('click', () => {
  document.getElementById('loginFormContainer').style.display = 'none';
});

// 회원가입 폼 닫기
document.getElementById('closeSignupForm').addEventListener('click', () => {
  document.getElementById('signupFormContainer').style.display = 'none';
});

// 로그인 폼 제출
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert('로그인 성공!');
          document.getElementById('loginFormContainer').style.display = 'none';
          window.location.reload(); // 페이지 새로고침
      } else {
          alert('로그인 실패: ' + data.message);
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});

// 회원가입 폼 제출
document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const name = document.getElementById('name').value;

  fetch('/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, name }),
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert('회원가입 성공!');
          document.getElementById('signupFormContainer').style.display = 'none';
      } else {
          alert('회원가입 실패: ' + data.message);
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});

function logout() {
  fetch('/logout', { method: 'POST' })
      .then(response => {
          if (response.redirected) {
              window.location.href = response.url; // 서버에서 리다이렉트된 URL로 이동
          }
      })
      .catch(error => {
          console.error('로그아웃 오류:', error);
          alert('로그아웃 중 오류가 발생했습니다.');
      });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchSelfEntries();
});

async function submitSelfForm(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  try {
      const response = await fetch('/self/write', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
          throw new Error('Failed to submit form');
      }

      const responseData = await response.json();
      displaySelfEntry(responseData);

  } catch (error) {
      console.error('Error submitting form:', error);
  }
}

async function fetchSelfEntries() {
  try {
      const response = await fetch('/self/list');
      const entries = await response.json();

      entries.forEach(entry => displaySelfEntry(entry));
  } catch (error) {
      console.error('Error fetching entries:', error);
  }
}

function displaySelfEntry(entry) {
  const postContainer = document.getElementById('postContainer');
  const newEntry = document.createElement('div');
  newEntry.classList.add('self-entry');
  newEntry.innerHTML = `
      <h3>${entry.title}</h3>
      <p>${entry.content}</p>
  `;
  postContainer.prepend(newEntry);
}

function toggleSelfForm() {
  const form = document.getElementById('selfForm');
  const btn  = document.getElementById('form_btn');
  
    btn.style.display = 'none';
    form.style.display = 'block';
  
  
  form.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const selfForm = document.getElementById('selfForm');
  
  selfForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // 기본 form 제출 동작을 막습니다.
      
      const formData = new FormData(selfForm);
      const data = {};
      formData.forEach((value, key) => {
          data[key] = value;
      });

      try {
          const response = await fetch('/self/write', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });

          if (!response.ok) {
              throw new Error('Failed to submit form');
          }

          const result = await response.json();
          
          // 서버에서 받은 데이터로 새로운 게시글을 추가합니다.
          const postContainer = document.getElementById('postContainer');
          const newPost = document.createElement('div');
          newPost.className = 'post-item';
          newPost.id = `post_${result.id}`;
          newPost.innerHTML = `
              <h3>${result.title}</h3>
              <p>${result.content}</p>
              <button onclick="remove_write('${result.id}')">&times;</button>
          `;
          postContainer.prepend(newPost); // 새로운 게시글을 맨 위에 추가합니다.
          
          // 폼 초기화
          selfForm.reset();

      } catch (error) {
          console.error('Error submitting form:', error);
      }
  });
});

// script.js

// 게시글 제목 클릭 시 팝업 토글
document.addEventListener('DOMContentLoaded', function() {
  const postTitles = document.querySelectorAll('.post-title');

  postTitles.forEach(title => {
      title.addEventListener('click', function() {
          const postId = this.getAttribute('data-post-id');
          const postContent = document.getElementById(`post_${postId}`);

          // 현재 display 상태 확인
          const isHidden = postContent.style.display === 'none' || postContent.style.display === '';

          // 팝업 열기/닫기
          postContent.style.display = isHidden ? 'block' : 'none';
      });
  });
});


function remove_write(postId) {
  if (confirm("글을 지우시겠습니까?")) {
      fetch(`/delete/${postId}`, {
          method: 'POST',
      }).then(response => {
          if (response.ok) {
              console.log(`Post with ID ${postId} has been deleted`);
              // UI에서 해당 게시물 제거 (예: DOM에서 제거)
              const postElement = document.getElementById(`post_${postId}`);
              if (postElement) {
                  postElement.remove(); // DOM에서 제거
              }
              window.location.reload();
          } else {
              console.error('Failed to delete the post');
          }
      }).catch(error => {
          console.error('Error deleting the post:', error);
      });
  }
}
