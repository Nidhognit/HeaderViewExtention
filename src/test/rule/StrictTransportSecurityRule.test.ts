import test from 'ava';
import StrictTransportSecurityRule from "../../js/rules/StrictTransportSecurityRule";

test('checkHeader: false to all error headers', t => {
    const rule = new StrictTransportSecurityRule();
    t.false(rule.checkHeader(''));
    t.false(rule.checkHeader('strict-transport'));
    t.false(rule.checkHeader('random text'));
});

test('checkHeader: true to correct header', t => {
    const rule = new StrictTransportSecurityRule();
    t.true(rule.checkHeader('strict-transport-security'));
});

test('checkHeader: correct header value', t => {
    const rule = new StrictTransportSecurityRule();
    t.true(rule.checkHeader('strict-transport-security'));
    rule.addValue('max-age=15552000;');
    rule.check();
    t.is(rule.getRating(), 10);
});
