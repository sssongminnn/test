const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { Todo, User, Self } = require('./models');

const app = express();
const port = 3000;

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// 인증 미들웨어
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// 메인 페이지 라우팅
app.get('/', isAuthenticated, async (req, res) => {
    const todos = await Todo.findAll({ 
        where: { userId: req.session.userId },
        order: [['date', 'ASC']] 
    });

    const selfPosts = await Self.findAll({
        where: { userId: req.session.userId },
        order: [['createdAt', 'DESC']]
    });

    res.render('index', { todos, selfPosts, session: req.session });
});

// 회원가입 페이지 라우팅
app.get('/signup', (req, res) => {
    res.render('signup', { session: req.session });
});

// 회원가입 처리 라우팅
app.post('/signup', async (req, res) => {
    const { username, password, name } = req.body;

    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.json({ success: false, message: '이미 존재하는 아이디입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword, name });
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

// 로그인 페이지 라우팅
app.get('/login', (req, res) => {
    res.render('login', { session: req.session });
});

// 로그인 처리 라우팅
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        req.session.userId = user.id;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

// 로그아웃 라우팅
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destroy failed:', err);
            return res.status(500).json({ success: false, message: '로그아웃에 실패했습니다.' });
        }
        res.redirect('/login'); // 로그아웃 후에 로그인 페이지로 리다이렉트
    });
});

// 할 일 추가 라우팅
app.post('/add', isAuthenticated, async (req, res) => {
    const { date, tasks } = req.body;
    const tasksArray = tasks.split(',').map(task => task.trim());
    await Todo.create({
        date: date,
        tasks: JSON.stringify(tasksArray),
        done: false,
        userId: req.session.userId
    });
    res.redirect('/');
});

// 특정 날짜의 할 일 조회 라우팅 (done 상태 포함)
app.get('/todos/:date', isAuthenticated, async (req, res) => {
    const { date } = req.params;
    const todos = await Todo.findAll({
        where: { date: date, userId: req.session.userId },
        order: [['done', 'ASC'], ['date', 'ASC']]
    });

    const tasksOnly = todos.map(todo => ({
        id: todo.id,
        tasks: JSON.parse(todo.tasks),
        done: todo.done
    }));
    res.json(tasksOnly);
});

// 할 일 완료 상태 토글 라우팅
app.put('/todos/:id/toggle', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findOne({ where: { id, userId: req.session.userId } });
    if (todo) {
        todo.done = !todo.done;
        await todo.save();
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Todo not found' });
    }
});

// Self 게시물 삭제 라우팅
app.post('/delete/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Self.destroy({ where: { id, userId: req.session.userId } });
        if (result) {
            res.sendStatus(200); // 삭제 성공 시 HTTP 상태 코드 200 반환
        } else {
            res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

// Self 라우트 사용
const selfRoutes = require('./routes/selfRoutes');
app.use('/self', selfRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});