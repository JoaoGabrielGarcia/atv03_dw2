const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors"); // Importa o middleware cors


const app = express()
app.use(express.json())
app.use(cors()); // Habilita CORS
const port = 3000


const Task = mongoose.model("Tarefa", {
	task_id: Number,
	name: String,
	status: { type: Boolean, default: false },
})

app.get("/", async (req, res) => {
	const tasks = await Task.find()
    res.send(tasks);
})

app.post("/", async (req, res) => {
	const existingTaskById = await Task.findOne({ task_id: req.body.task_id });
    const existingTaskByName = await Task.findOne({ name: req.body.name });

    // Verifica se já existe uma tarefa com o mesmo ID ou nome
    if (existingTaskById) {
        return res.status(400).send({ error: "Uma tarefa com este ID já existe." });
    }

    if (existingTaskByName) {
        return res.status(400).send({ error: "Uma tarefa com este nome já existe." });
    }
    const task = new Task({
		task_id: req.body.task_id,
		name: req.body.name,
		status: req.body.status
	});
    await task.save()
    res.send(task)
})

app.delete("/:id", async(req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id)
    res.send(task)
})

app.put("/:id", async(req, res) => {
    const existingTaskWithSameName = await Task.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id } // Verifica se o ID é diferente do ID da tarefa sendo atualizada
    });

    // Verifica se já existe uma tarefa com o mesmo nome
    if (existingTaskWithSameName) {
        return res.status(400).send({ error: "Já existe uma tarefa com este nome." });
    }
    const task = await Task.findByIdAndUpdate(req.params.id, {
        task_id: req.body.task_id,
		name: req.body.name,
		status: req.body.status
    }, {new: true})

    res.send(task)
})

app.use(express.static("public"));

app.listen(port, () => {
    mongoose.connect(
        "mongodb+srv://root:aFiA94mwsnEYbY29@atv03.i7fib.mongodb.net/?retryWrites=true&w=majority&appName=atv03",
    )
	console.log(`Example app listening on port ${port}`)
})
