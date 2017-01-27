import test from 'ava';
import VersionChecker = require('../js/VersionChecker');

test('checkLang: sets -5 for disclosing PHP', t => {
    const checker = new VersionChecker();
    checker.checkLang('php');
    t.is(checker.getRating(), -5);

    checker.checkLang('php/-.-.--1+donate.sury.org~trusty+1');
    t.is(checker.getRating(), -5);
});

test('checkLang: sets -5 for disclosing PHP current version', t => {
    const checker = new VersionChecker();
    const currentVersion = checker._php[0].join('.');
    checker.checkLang('php/' + currentVersion);
    t.is(checker.getRating(), -5);
});

test('checkLang: sets -20 for disclosing PHP vulnerable version', t => {
    const checker = new VersionChecker();
    checker.checkLang('php/5.6.22-1+donate.sury.org~trusty+1');
    t.is(checker.getRating(), -20);

    checker.checkLang('php/5.3.3');
    t.is(checker.getRating(), -20);

    checker.checkLang('php/7.0.13');
    t.is(checker.getRating(), -20);
});

test('checkLang: not disclosing PHP', t => {
    const checker = new VersionChecker();
    checker.checkLang('test');
    t.is(checker.getRating(), 0);
});

test('checkServer: sets -5 for disclosing server technology', t => {
    const checker = new VersionChecker();
    checker.checkServer('nginx');
    t.is(checker.getRating(), -5);

    checker.checkServer('apache');
    t.is(checker.getRating(), -5);
});

test('checkServer: sets -5 for disclosing server current version', t => {
    const checker = new VersionChecker();
    const currentVersionNginx = checker._nginx[0].join('.');
    checker.checkServer('nginx/' + currentVersionNginx);
    t.is(checker.getRating(), -5);

    const currentVersionApache = checker._apache[0].join('.');
    checker.checkServer('apache/' + currentVersionApache);
    t.is(checker.getRating(), -5);
});

test('checkServer: sets -20 for disclosing server vulnerable version', t => {
    const checker = new VersionChecker();
    checker.checkServer('nginx/1.8.1');
    t.is(checker.getRating(), -20);

    checker.checkServer('apache/2.2.2');
    t.is(checker.getRating(), -20);
});

test('checkServer: not disclosing server', t => {
    const checker = new VersionChecker();
    checker.checkServer('test');
    t.is(checker.getRating(), 0);
});
