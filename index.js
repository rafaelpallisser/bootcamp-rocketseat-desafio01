const express = require('express');

const server = express();

server.use(express.json());

let CountRequest = 0;

const projects = [];

function getProjectIndex(id) {
  return projects.findIndex(p => p.id == id);
}

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: `Projeto ${id} não encontrado!` })
  }

  return next();
}

function logRequests(req, res, next) {
  CountRequest++;

  console.log(`Total de Requisições: ${CountRequest}`)

  next();
}

server.use(logRequests);

// CRIAR NOVO PROJETO
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project);

  return res.json(project);
})

// LISTAR TODOS OS PROJETOS
server.get('/projects', (req, res) => {
  return res.json(projects);
})

// EDITAR UM PROJETO PELO ID
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  
  project.title = title;

  return res.json(project);
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

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
})

server.listen(3000);