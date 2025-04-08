document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById("home-link"); // Находим заголовок

    // Делаем заголовок кликабельным
    header.style.cursor = "pointer"; 

    // Добавляем обработчик клика
    header.addEventListener("click", () => {
        switchTab("home"); // Переключаемся на "Главная"
    });

    function switchTab(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        // Убираем активность у всех вкладок и контента
        contents.forEach(content => content.classList.remove('active'));
        tabs.forEach(tab => tab.classList.remove('active'));

        // Добавляем активность текущей вкладке и её контенту
        document.querySelector(`[data-tab="${targetId}"]`)?.classList.add('active');
        target.classList.add('active');
        
        // Обновляем URL без перезагрузки страницы
        history.pushState({ tab: targetId }, "");
    }

    // Переключение темы
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Переключение вкладок
    const tabs = document.querySelectorAll('[data-tab]');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(tab.dataset.tab);
            
            contents.forEach(content => content.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            
            tab.classList.add('active');
            target.classList.add('active');
        });
    });

    // Логика дедлайнов
    const deadlineList = document.getElementById('deadline-list');
    const deadlineNameInput = document.getElementById('deadline-name');
    const deadlineDateInput = document.getElementById('deadline-date');
    const addDeadlineButton = document.getElementById('add-deadline');

    let deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];

    function updateDeadlines() {
        deadlineList.innerHTML = '';
        deadlines.forEach((deadline, index) => {
            const deadlineItem = document.createElement('div');
            deadlineItem.classList.add('deadline-item');

            const timeLeft = calculateTimeLeft(deadline.date);
            deadlineItem.innerHTML = `
                <span>${deadline.name}</span>
                <span>${timeLeft}</span>
                <button onclick="removeDeadline(${index})">Удалить</button>
            `;

            deadlineList.appendChild(deadlineItem);
        });
    }

    function calculateTimeLeft(deadlineDate) {
        const now = new Date();
        const targetDate = new Date(deadlineDate);
        const timeDiff = targetDate - now;

        if (timeDiff <= 0) return 'Время вышло!';

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    addDeadlineButton.addEventListener('click', () => {
        const name = deadlineNameInput.value.trim();
        const date = deadlineDateInput.value;

        if (name && date) {
            deadlines.push({ name, date });
            localStorage.setItem('deadlines', JSON.stringify(deadlines));
            deadlineNameInput.value = '';
            deadlineDateInput.value = '';
            updateDeadlines();
        } else {
            alert('Заполните все поля!');
        }
    });

    window.removeDeadline = (index) => {
        deadlines.splice(index, 1);
        localStorage.setItem('deadlines', JSON.stringify(deadlines));
        updateDeadlines();
    };

    setInterval(updateDeadlines, 1000);
    updateDeadlines();

    //checkbox для архэвм
    function addCheckboxes(listId) {
        const list = document.getElementById(listId);
        if (!list) return;

        const items = list.querySelectorAll("li");

        items.forEach((item) => {
            const link = item.querySelector("a");
            if (!link) return;

            const url = link.href;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "link-checkbox";

            const savedState = localStorage.getItem(url);
            if (savedState === "true") {
                checkbox.checked = true;
            }

            checkbox.addEventListener("change", () => {
                localStorage.setItem(url, checkbox.checked);
            });

            item.insertBefore(checkbox, link);
        });
    }

    addCheckboxes("labs-list");
});
