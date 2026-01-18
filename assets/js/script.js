const API_BASE = 'https://jsonplaceholder.typicode.com';
const endpoints = [
    `${API_BASE}/users/2`,
    `${API_BASE}/todos?userId=2`,
    `${API_BASE}/posts?userId=2`
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
        console.error('Falha crítica no carregamento:', error);
        handleCriticalError(error);
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
            <p class="text-xs text-slate-400 mt-2 text-right">${progress}% de produtividade</p>
        `;
    document.getElementById('todo-data').innerHTML = html;
}

function renderActivity(posts) {
    const lastPost = posts[0];
    const html = `
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Postagem Recente</p>
            <h3 class="font-medium text-slate-800 leading-tight">"${lastPost.title}"</h3>
            <p class="text-sm text-slate-500 mt-2 line-clamp-3">${lastPost.body}</p>
            <button class="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">Ver histórico completo &rarr;</button>
        `;
    document.getElementById('post-data').innerHTML = html;
}

initDashboard();
