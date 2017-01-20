const test = require('ava');
const VersionChecker = require('../js/VersionChecker');

test('checkLang: sets -5 for disclosing PHP', t => {
    const checker = new VersionChecker();
    checker.checkLang('php');

    t.is(checker.getRating(), -5);
});
