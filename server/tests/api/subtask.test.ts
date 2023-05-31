import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import { Application } from 'express';
import app from '@app/app';
import { TodoDto } from '@app/model/todo/types';
import { createTodo, deleteSubtask } from 'tests/utils';
import { SubtaskDto, SubtaskStatus } from '@app/model/subtask/types';
import { deleteTodo } from 'tests/utils';

chai.should();
chai.use(chaiHttp);

let server: Application;

describe('Subtask API', () => {
  let todo: TodoDto;
  let todo2: TodoDto;
  const subtaskList: SubtaskDto[] = [];
  before(async () => {
    server = await app();
    todo = await createTodo('test parent');
    todo2 = await createTodo('test parent 2');
  });

  after(async () => {
    await deleteSubtask(subtaskList.map((sub) => sub.title));
    await deleteTodo([todo.title]);
    await deleteTodo([todo2.title]);
  });

  describe('POST /subtask', () => {
    describe('validation', () => {
      it('should throw error for empty title', (done) => {
        chai
          .request(server)
          .post('/subtask')
          .set('content-type', 'application/json')
          .send({
            title: '',
            todoId: todo.id,
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
      it('should throw error for empty todoId', (done) => {
        chai
          .request(server)
          .post('/subtask')
          .set('content-type', 'application/json')
          .send({
            title: 'test subtask 1',
            todoId: '',
          })
          .end((err, res) => {
            try {
              res.status.should.equal(422);
              res.body.should.be.a('object');
              res.body.should.have.all.keys('status', 'message');
              assert.isTrue(res.body.message.includes('TodoId'), 'Should include `TodoId` in error message');
              assert.equal(res.body.status, 'error');
              done();
            } catch (e) {
              done(e);
            }
          });
      });
    });
    it('should create a subtask', (done) => {
      chai
        .request(server)
        .post('/subtask')
        .set('content-type', 'application/json')
        .send({
          title: 'test subtask 2',
          todoId: todo2.id,
        })
        .end((err, res) => {
          try {
            res.should.have.status(200);
            expect(res.body).to.include.keys('data', 'status');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data).to.contain.keys('id', 'title', 'status', 'createdAt');
            expect(res.body.data.id).to.be.a('number');
            expect(res.body.data.title).to.equal('test subtask 2');
            expect(res.body.data.status).to.equal(SubtaskStatus.pending);
            subtaskList.push(res.body.data);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('PUT /subtask/:id', () => {
    describe('validation', () => {
      it('should throw error if empty status provided', (done) => {
        chai
          .request(server)
          .put(`/subtask/${subtaskList[0].id}`)
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
          .put(`/subtask/${subtaskList[0].id}`)
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

    it('should update subtask status', (done) => {
      chai
        .request(server)
        .put(`/subtask/${subtaskList[0].id}`)
        .set('content-type', 'application/json')
        .send({
          status: SubtaskStatus.completed,
        })
        .end((err, res) => {
          try {
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.all.keys('status', 'data');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data.id).to.equal(subtaskList[0].id);
            expect(res.body.data.title).to.equal('test subtask 2');
            expect(res.body.data.status).to.equal(SubtaskStatus.completed);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
