import docker from '../scripts/docker';
import test from 'ava';

test(t => {
    const dockerPsOutput = `7d41ed198b59---0.0.0.0:4444->4444/tcp\n2002e09a3440---0.0.0.0:4443->4443/tcp`;
    const dockerId = docker._extractDockerIdFromDockerPsOutput(dockerPsOutput, 4444);
    t.is(dockerId, '7d41ed198b59');
});

test(t => {
    const port = docker._extractPortFromDockerPortsEntry('0.0.0.0:4443->4443/tcp');
    t.is(port, '4443');
});
