const express = require('express');

const server = express();

server.use(express.json());

let CountRequest = 0;

const projects = [];

function getProjectIndex(id) {
  return projects.findIndex(p => p.id == id);
}

server.use((req, res, next) => {
  CountRequest++;

  console.log(`Total de Requisições: ${CountRequest}`)

  next();
})

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const projectIndex = getProjectIndex(id);

  if (projectIndex === -1) {
    return res.status(400).json({ error: `Projeto ${id} não encontrado!` })
  }

  return next();
}

// CRIAR NOVO PROJETO
server.post('/projects', (req, res) => {
  const { id } = req.body;
  const { title} = req.body;
  const { tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
})

// LISTAR TODOS OS PROJETOS
server.get('/projects', (req, res) => {
  return res.json(projects);
})

// EDITAR UM PROJETO PELO ID
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const projectIndex = getProjectIndex(id);
  
  projects[projectIndex].title = title;

  return res.json(projects);
})

// DELETAR UM PROJETO PELO ID
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = getProjectIndex(id);

  projects.splice(projectIndex, 1);

  return res.send();
})

// CRIAR NOVA TAREFA
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const projectIndex = getProjectIndex(id);

  projects[projectIndex].tasks = [title];

  return res.json(projects);
})

server.listen(3000);