const express = require('express');
const app = express();
const port = 2333;
const path = require('path');

let waterLevelData = [];

app.get('/api/getData', (req, res) => {
    const formattedData = waterLevelData.map(entry => {
        return {
            time: entry.time,
            level: entry.level
        };
    });
    res.json(formattedData);
});

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}:${seconds}`;
}

app.get('/api/update', (req, res) => {
    const { level } = req.query;
    const timestamp = new Date().getTime();
    const fixedtime = formatDate(timestamp)    

    const newData = {
        time: fixedtime,
        level: level
    };

    waterLevelData.push(newData);
    res.send('Data added successfully');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));

app.get('/api/delete', (req, res) => {
    const { time } = req.query;
    
    // 将时间戳转换为字符串
    const strTime = String(time);
    
    // 在数据数组中查找并删除相应时间戳的数据
    const index = waterLevelData.findIndex(entry => String(entry.time) === strTime);
    
    if (index !== -1) {
        waterLevelData.splice(index, 1);
        res.send('Data deleted successfully');
    } else {
        res.status(404).send('Data not found');
    }
});

app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
});