import supertest from 'supertest';
import chai from 'chai';
import api from '../server';

// Setting up global variables for use in tests
global.app = api;
global.request = supertest(api);
global.assert = chai.assert;
global.expect = chai.expect;
