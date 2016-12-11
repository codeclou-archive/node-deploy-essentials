import http from '../scripts/http';
import request from 'sync-request';
import test from 'ava';

test('http waitForStatusCode', t => {
    request('GET', 'https://codeclou.io/test/request/retry.php?hash=node-deploy-essentials-unit-test&reset=true');
    http.waitForStatusCode(200, 'https://codeclou.io/test/request/retry.php?hash=node-deploy-essentials-unit-test');
    t.pass();
});