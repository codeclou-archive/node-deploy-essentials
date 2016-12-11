import http from '../scripts/http';
import request from 'sync-request';
import test from 'ava';

test('http waitForStatusCode', t => {
    request('GET', 'http://localhost:3000/reset');
    http.waitForStatusCode(200, 'http://localhost:3000/');
    t.pass();
});