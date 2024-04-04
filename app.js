// Express 모듈을 불러옵니다.
const express = require('express'); // Express 모듈
const morgan = require('morgan'); // morgan 미들웨어 -> HTTP 요처에 대한 로그 기록
const cookieParser = require('cookie-parser') // cookieParser 미들웨어 -> 클라이언트가 보낸 쿠키 파싱
const session = require('express-session') // express-session 미들웨어 -> 세션 관리
const dotenv = require('dontenv'); // dotenv 라이브러리 -> 환경 변수 관리
const path = require('path') // path 모듈 -> 파일 및 디렉토리 경로를 처리

dotenv.config(); // .env 파일의 환경 변수를 로드

const app = express(); // Express 앱을 생성합니다.

// 앱의 포트를 설정합니다. 환경 변수에 포트가 지정되어 있지 않으면 3000번 포트를 사용합니다.
app.set('port',process.env.PORT || 8080);
    // app.set(키, 값)에 데이터를 저장, 데이터를 app.get(키)로 가져올수 있음.

// 루트 경로('/')로 GET 요청이 오면 index.html 파일을 클라이언트에게 전송합니다.

app.use(morgan('dev'));

app.use('/',express.static(path.join(__dirname, 'public')));


app.use(express.join());

app.use(express.urlencoded({}))

app.use(cookieParser(process.env.COOKIE_SECRET));




app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        http0nly: true,
        secure: false,
    },
    name: 'session-cookie',
}))









const multer = require('multer')
const fs = require('fs')


try {

    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');

    fs.mkdirSync('uploads')
}

const upload = multer({

    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {

            const ext = path.extname(file.originalname);

            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    
    limits: { fileSize: 5 * 1024 * 1024 },
});


app.get('/upload', (req,res) => {
    res.sendFile(path.join(__dirname, 'multipart.himl'));
});

app.post('/upload', upload.single('image'), (req, res) => {


    console.log(req.file);

    res.send('ok');
});



app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
})

app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.')
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
})







app.use((err, req, res, next))