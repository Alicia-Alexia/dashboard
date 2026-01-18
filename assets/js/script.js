const API_BASE = 'https://jsonplaceholder.typicode.com';
const endpoints = [
    `${API_BASE}/users/1`,      
    `${API_BASE}/todos?userId=1`,
    `${API_BASE}/posts?userId=1`
];

async function initDashboard() {
    const loader = document.getElementById('loader');
    const dashboard = document.getElementById('dashboard');
    const errorContainer = document.getElementById('error-container');

    loader.classList.remove('hidden');
    dashboard.classList.add('hidden');
    errorContainer.classList.add('hidden');

    try {
        const responses = await Promise.all(
            endpoints.map(url => fetch(url).then(res => {
                if (!res.ok) throw new Error(`Erro ao carregar: ${url}`);
                return res.json();
            }))
        );

        const [user, todos, posts] = responses;

        renderUser(user);
        renderStats(todos);
        renderActivity(posts);

        loader.classList.add('hidden');
        dashboard.classList.remove('hidden');

    } catch (error) {
        console.error('Erro capturado:', error);
        handleCriticalError(error);
    }
}

async function handleCriticalError(originalError) {
    const loader = document.getElementById('loader');
    const errorContainer = document.getElementById('error-container');
    const errorMsg = document.getElementById('error-message');

    loader.classList.add('hidden');
    errorContainer.classList.remove('hidden');

    const results = await Promise.allSettled(
        endpoints.map(url => fetch(url))
    );

    const failedRequests = results.map((res, index) => {
        const isNetworkError = res.status === 'rejected';
        const isHttpError = res.status === 'fulfilled' && !res.value.ok;

        if (isNetworkError || isHttpError) {
            const names = ['Usuário', 'Tarefas', 'Posts'];
            return names[index];
        }
        return null;
    }).filter(name => name !== null);

    if (failedRequests.length > 0) {
        errorMsg.innerHTML = `Não foi possível carregar: <strong>${failedRequests.join(', ')}</strong>.<br>O sistema tentou reconectar mas o recurso não foi encontrado.`;
    } else {
        errorMsg.textContent = "Erro desconhecido na conexão.";
    }
}

function renderUser(user) {
    const html = `
            <p class="text-sm text-slate-500">Nome</p>
            <p class="font-semibold text-slate-900">${user.name}</p>
            <p class="text-sm text-slate-500 mt-2">Email</p>
            <p class="font-semibold text-indigo-600">${user.email}</p>
            <p class="text-sm text-slate-500 mt-2">Empresa</p>
            <p class="font-semibold text-slate-900">${user.company.name}</p>
        `;
    document.getElementById('user-data').innerHTML = html;
}

function renderStats(todos) {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const progress = Math.round((completed / total) * 100);

    const html = `
            <div class="flex justify-between items-end mb-2">
                <span class="text-3xl font-bold text-slate-800">${completed}/${total}</span>
                <span class="text-sm font-medium text-emerald-600 mb-1">Concluídas</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2.5">
                <div class="bg-emerald-500 h-2.5 rounded-full" style="width: ${progress}%"></div>
            </div>
            <p class="text-xs text-slate-400 mt-2 text-right">${progress}% produtivo</p>
        `;
    document.getElementById('todo-data').innerHTML = html;
}

function renderActivity(posts) {
    const lastPost = posts[0];
    const html = `
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recente</p>
            <h3 class="font-medium text-slate-800 leading-tight">"${lastPost.title}"</h3>
            <p class="text-sm text-slate-500 mt-2 line-clamp-3">${lastPost.body}</p>
        `;
    document.getElementById('post-data').innerHTML = html;
}

initDashboard();