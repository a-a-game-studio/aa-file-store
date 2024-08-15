import axios from 'axios'

async function run() {

    for (let i = 0; i < 1000; i++) {
        await axios.post('http://127.0.0.1:3030/set?backet=backet1', i + '_123456');
        console.log(i);
    }

}

run();