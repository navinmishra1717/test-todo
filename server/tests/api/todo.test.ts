import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import { Application } from 'express';
import { Op } from 'sequelize';
import app from '@app/app';
import Todo from '@app/model/todo';
import { TodoStatus } from '@app/model/todo/types';

chai.should();
chai.use(chaiHttp);

const todoDummyData: any[] = [
  {
    title: 'test todo',
  },
  {
    title: 'test todo 2',
  },
];

describe('Todo API', () => {
  let server: Application;
  before(async () => {
    server = await app();
    await Todo.destroy({
      where: {
        title: {
          [Op.in]: todoDummyData.map((data) => data.title),
        },
      },
      force: true,
    });
    await Todo.bulkCreate(todoDummyData);
  });

  after(async () => {
    await Todo.destroy({
      where: {
        title: {
          [Op.in]: todoDummyData.map((data) => data.title),
        },
      },
      force: true,
    });
  });

  describe('GET /todos', () => {
    it('should get todos', (done) => {
      chai
        .request(server)
        .get('/todos')
        .set('content-type', 'application/json')
        .end((err, res) => {
          try {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.all.keys('status', 'data');
            expect(res.body.status).to.be.equal('ok');
            expect(res.body.data).should.be.a('object');
            expect(res.body.data).to.contain.keys('items', 'total');
            expect(res.body.data.items[0]).to.contain.keys('id', 'title');
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('POST /todo', () => {
    describe('validation', () => {
      it('should throw error for empty title', (done) => {
        chai
          .request(server)
          .post('/todo')
          .set('content-type', 'application/json')
          .send({
            title: '',
          })
          .end((err, res) => {
            try {
              res.status.should.equal(422);
              res.body.should.be.a('object');
              res.body.should.have.all.keys('status', 'message');
              assert.isTrue(res.body.message.includes('Title'), 'Should include `Title` in error message');
              assert.equal(res.body.status, 'error');
              done();
            } catch (e) {
              done(e);
            }
          });
      });
    });
    it('should create a todo', (done) => {
      chai
        .request(server)
        .post('/todo')
        .set('content-type', 'application/json')
        .send({
          title: 'test todo 3',
        })
        .end((err, res) => {
          try {
            res.should.have.status(200);
            expect(res.body).to.include.keys('data', 'status');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data).to.contain.keys('id', 'title', 'status', 'createdAt');
            expect(res.body.data.id).to.be.a('number');
            expect(res.body.data.title).to.equal('test todo 3');
            expect(res.body.data.status).to.equal(TodoStatus.pending);
            todoDummyData.push(res.body.data);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('PUT /todo/:id', () => {
    describe('validation', () => {
      it('should throw error if empty status provided', (done) => {
        chai
          .request(server)
          .put(`/todo/${todoDummyData[0].id}`)
          .set('content-type', 'application/json')
          .send({
            status: '',
          })
          .end((err, res) => {
            try {
              res.status.should.equal(422);
              res.body.should.be.a('object');
              res.body.should.have.all.keys('status', 'message');
              assert.isTrue(res.body.message.includes('Status'), 'Should include `Status` in error message');
              assert.equal(res.body.status, 'error');
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should throw error if invalid status provided', (done) => {
        chai
          .request(server)
          .put(`/todo/${todoDummyData[0].id}`)
          .set('content-type', 'application/json')
          .send({
            status: 'completedddd',
          })
          .end((err, res) => {
            try {
              res.status.should.equal(422);
              res.body.should.be.a('object');
              res.body.should.have.all.keys('status', 'message');
              assert.isTrue(res.body.message.includes('Status'), 'Should include `Status` in error message');
              assert.equal(res.body.status, 'error');
              done();
            } catch (e) {
              done(e);
            }
          });
      });
    });

    it('should update todo status', (done) => {
      chai
        .request(server)
        .put(`/todo/${todoDummyData[2].id}`)
        .set('content-type', 'application/json')
        .send({
          status: TodoStatus.completed,
        })
        .end((err, res) => {
          try {
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.all.keys('status', 'data');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data.id).to.equal(todoDummyData[2].id);
            expect(res.body.data.title).to.equal('test todo 3');
            expect(res.body.data.status).to.equal(TodoStatus.completed);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
