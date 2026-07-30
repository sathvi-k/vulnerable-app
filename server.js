const express = require('express');
const helmet = require('helmet');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const yaml = require('js-yaml');
const ejs = require('ejs');
const marked = require('marked');
const serialize = require('serialize-javascript');
const axios = require('axios');
const moment = require('moment');
const handlebars = require('handlebars');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample data
const users = [
  { id: 1, username: 'alice', role: 'admin' },
  { id: 2, username: 'bob', role: 'user' }
];

const JWT_SECRET = process.env.JWT_SECRET;

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Vulnerable Demo App',
    description: 'This app has both dependency and code vulnerabilities'
  });
});

// Get all users - uses lodash
app.get('/api/users', (req, res) => {
  const safeUsers = _.map(users, user => _.pick(user, ['id', 'username']));
  res.json(safeUsers);
});

// Login - uses jsonwebtoken
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  const user = _.find(users, { username });
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h'
  });
  
  res.json({ token });
});

// CODE VULN: Command Injection
app.get('/api/ping', (req, res) => {
  const host = req.query.host;
  exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
    res.send(stdout || stderr || 'Error');
  });
});

// CODE VULN: Path Traversal
app.get('/api/file', (req, res) => {
  const filename = path.basename(req.query.name);
  const filepath = path.join(__dirname, 'uploads', filename);
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) return res.status(404).send('File not found');
    res.send(data);
  });
});

// CODE VULN: XSS - Reflected user input
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  res.contentType('text/plain').send(`Results for: ${query}`);
});

// Parse YAML config - uses js-yaml (vulnerable)
app.post('/api/config', (req, res) => {
  try {
    const config = yaml.load(req.body.yaml);
    res.json({ config });
  } catch (err) {
    res.status(400).json({ error: 'Invalid YAML' });
  }
});

// Render template - uses ejs (vulnerable)
app.post('/api/render', (req, res) => {
  try {
    const { data } = req.body;
    const safeTemplate = 'Data: <%= JSON.stringify(data) %>';
    const rendered = ejs.render(safeTemplate, { data: data || {} });
    res.send(rendered);
  } catch (err) {
    res.status(400).json({ error: 'Template error' });
  }
});

// Parse markdown - uses marked (vulnerable)
app.post('/api/markdown', (req, res) => {
  try {
    const html = marked.parse(req.body.markdown);
    res.contentType('text/plain').send(html);
  } catch (err) {
    res.status(400).json({ error: 'Markdown error' });
  }
});

// Serialize data - uses serialize-javascript (vulnerable)
app.post('/api/serialize', (req, res) => {
  const serialized = serialize(req.body.data);
  res.json({ serialized });
});

// Fetch external URL - uses axios (vulnerable)
app.post('/api/fetch', async (req, res) => {
  try {
    const response = await axios.get(req.body.url);
    res.json({ data: response.data });
  } catch (err) {
    res.status(400).json({ error: 'Fetch error' });
  }
});

// Format date - uses moment (vulnerable)
app.get('/api/time', (req, res) => {
  res.json({ 
    now: moment().format('YYYY-MM-DD HH:mm:ss')
  });
});

// Render with handlebars (vulnerable)
app.post('/api/handlebars', (req, res) => {
  try {
    const safeTemplates = {
      greeting: 'Hello {{name}}!',
      welcome: 'Welcome {{name}} to {{site}}'
    };
    const templateKey = req.body.template;
    if (!Object.prototype.hasOwnProperty.call(safeTemplates, templateKey)) {
      return res.status(400).json({ error: 'Unknown template' });
    }
    const template = handlebars.compile(safeTemplates[templateKey]);
    const result = template(req.body.data || {});
    res.contentType('text/plain').send(result);
  } catch (err) {
    res.status(400).json({ error: 'Handlebars error' });
  }
});

// Merge objects - uses lodash merge (vulnerable to prototype pollution)
app.post('/api/merge', (req, res) => {
  const defaults = { theme: 'light', language: 'en' };
  const settings = _.merge({}, defaults, req.body.settings);
  res.json({ settings });
});

// CODE VULN: Open Redirect
app.get('/api/redirect', (req, res) => {
  const allowedUrls = ['/', '/home', '/login'];
  const url = req.query.url;
  if (allowedUrls.includes(url)) {
    res.redirect(url);
  } else {
    res.redirect('/');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
