import assert from 'node:assert';
import http from 'node:http';
import { once } from 'node:events';
import test from 'node:test';
import app from '../../app.js';

test('GET /health returns status OK', async () => {
  const server = http.createServer(app);
  server.listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  const response = await fetch(`http://localhost:${port}/health`);
  const body = await response.json();
  server.close();
  assert.strictEqual(response.status, 200);
  assert.strictEqual(body.status, 'OK');
});
