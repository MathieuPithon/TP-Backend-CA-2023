const { Worker } = require('worker_threads')

module.exports = (req, res, next) => {

    return new Promise((resolve, reject) => {
        const worker = new Worker(req)

        // Une fois le worker actif
        worker.on('online', () => {
            console.log('DEBUT : Execution de la tâche intensive en parallèle')
        })

        // Si un message est reçu du worker
        worker.on('message', workerMessage => {
            console.log(workerMessage)
            return resolve
        })

        worker.on('error', reject)
        worker.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`))
            }
        })
    })

};

