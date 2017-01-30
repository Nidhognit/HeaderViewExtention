import test from 'ava';
import SecurityHeaderRating from '../js/SecurityHeaderRating';
import {h} from '../js/utils';

test('checkXxss: sets 15 for disclosing XSS protection', t => {
    const headers = new SecurityHeaderRating();
    headers.checkXxss('1; mode=block');
    t.is(headers.rating, 15);
    headers.clear();

    headers.checkXxss('1; report=<reporting-uri>');
    t.is(headers.rating, 15);
    headers.clear();

    headers.checkXxss('1');
    t.is(headers.rating, 15);
    headers.clear();
});

test('checkXxss: sets 0 for not disclosing XSS protection', t => {
    const headers = new SecurityHeaderRating();
    headers.checkXxss('0');
    t.is(headers.rating, 0);
    headers.clear();

    headers.checkXxss('report=<reporting-uri>');
    t.is(headers.rating, 0);
    headers.clear();
});

test('checkXctp: sets 15 for disclosing content protection', t => {
    const headers = new SecurityHeaderRating();
    headers.checkXctp('nosniff');
    t.is(headers.rating, 10);
    headers.clear();
});

test('checkXframe: sets 25 for disclosing Frame protection', t => {
    const headers = new SecurityHeaderRating();
    headers.checkXframe('deny');
    t.is(headers.rating, 25);
    headers.clear();

    headers.checkXframe('sameorigin');
    t.is(headers.rating, 25);
    headers.clear();
});

test('checkXframe: sets 0 for not disclosing Frame protection', t => {
    const headers = new SecurityHeaderRating();
    headers.checkXframe('all');
    t.is(headers.rating, 0);
    headers.clear();

    headers.checkXframe('none');
    t.is(headers.rating, 0);
    headers.clear();
});

test('checkHsts: sets 10 for disclosing strict-transport protection', t => {
    const headers = new SecurityHeaderRating();
    headers.checkHsts('max-age=15552000;');
    t.is(headers.rating, 10);
    headers.clear();

    headers.checkHsts('max-age=25552000;');
    t.is(headers.rating, 10);
    headers.clear();
});
test('checkHsts: sets 0 for not disclosing strict-transport protection', t => {
    const headers = new SecurityHeaderRating();
    headers.checkHsts('max-age=6452000;');
    t.is(headers.rating, 0);
    headers.clear();

    headers.checkHsts('random text');
    t.is(headers.rating, 0);
    headers.clear();
});

test('checkCsp: sets 30 for disclosing CSP protection', t => {
    const headers = new SecurityHeaderRating();
    headers.checkCsp('default-src \'self\';');
    t.is(headers.rating, 30);
    headers.clear();

    headers.checkCsp('default-src \'none\'; base-uri \'self\'; block-all-mixed-content; child-src www.youtube-nocookie.com; connect-src \'self\' www.google-analytics.com; font-src \'self\'; form-action \'self\'; media-src \'self\'; script-src \'self\' www.google-analytics.com; style-src \'self\' \'unsafe-inline\';');
    t.is(headers.rating, 30);
    headers.clear();

    headers.checkCsp('default-src \'none\'; base-uri \'self\'; block-all-mixed-content; child-src www.youtube-nocookie.com; connect-src \'self\' www.google-analytics.com ; font-src \'self\'; form-action \'self\'; frame-ancestors \'none\'; frame-src www.youtube-nocookie.com; img-src \'self\' data: photos.com ; media-src \'self\'; script-src \'self\';');
    t.is(headers.rating, 30);
    headers.clear();
});

test('checkCsp: sets 10 for disclosing CSP protection with unsafe', t => {
    const headers = new SecurityHeaderRating();
    headers.checkCsp('script-src \'unsafe-inline\';');
    t.is(headers.rating, 10);
    headers.clear();

    headers.checkCsp('script-src \'unsafe-eval\';');
    t.is(headers.rating, 10);
    headers.clear();

    headers.checkCsp('default-src \'none\'; script-src \'self\' www.youtube-nocookie.com \'unsafe-inline\'; base-uri \'self\'; block-all-mixed-content;');
    t.is(headers.rating, 10);
    headers.clear();

    headers.checkCsp('default-src \'none\'; script-src \'self\' www.youtube-nocookie.com \'unsafe-eval\'; base-uri \'self\'; block-all-mixed-content;');
    t.is(headers.rating, 10);
    headers.clear();

    headers.checkCsp('default-src \'none\';');
    t.is(headers.rating, 10);
    headers.clear();
});

test('getLink: check correct object for valid security headers', t => {
    const headers = new SecurityHeaderRating();
    let value = 'default-src \'self\';';
    headers.checkCsp(value);
    let linkArr = headers.getLink(h, value);
    t.is(headers.correct, true);
    t.is(linkArr[0].children, value);
    t.is(linkArr[0].props.className, 'good-header');
    headers.clear();

    value = 'max-age=25552000;';
    headers.checkHsts(value);
    linkArr = headers.getLink(h, value);
    t.is(headers.correct, true);
    t.is(linkArr[0].children, value);
    t.is(linkArr[0].props.className, 'good-header');
    headers.clear();
});
