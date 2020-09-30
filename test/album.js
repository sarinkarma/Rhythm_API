//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = chai.expect
chai.use(chaiHttp)
const app = require('../index')
const album = require("../models/album")

chai.use(chaiHttp);
//Our parent block
  describe('/GET album', () => {
      it('it should GET all the albums', (done) => {
        let res = chai.request(app)
            .get('/api/album')
            .end((err, res) => {
              expect(res.status).to.equal(200)
          done();
        });
      });
  });

  describe('/GET album', () => {
    it('it should GET all the albums', (done) => {
      let res = chai.request(app)
          .get('/api/artist')
          .end((err, res) => {
            expect(res.status).to.equal(200)
        done();
      });
    });
});

describe('/GET album', () => {
  it('it should GET all the albums', (done) => {
    let res = chai.request(app)
        .get('/api/song')
        .end((err, res) => {
          expect(res.status).to.equal(200)
      done();
    });
  });
});