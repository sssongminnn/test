const express = require('express');
const router = express.Router();
const { Self } = require('../models');

// Self 작성 폼 보여주기
router.get('/write', (req, res) => {
    res.render('selfForm', { session: req.session });
});

// Self 작성 처리
router.post('/write', async (req, res) => {
    const { title, content } = req.body;
    const userId = req.session.userId;

    try {
        await Self.create({ userId, title, content });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
