import { Op } from 'sequelize';
import chaiPromiser from 'chai-as-promised';
import Todo from '@app/model/todo';
import TodoService from '@app/services/todo';
import { expect } from 'chai';
import { TodoStatus } from '@app/model/todo/types';
import { NotFoundException } from '@app/exceptions';

chai.use(chaiPromiser);

const todoDummydata = {
  title: 'todo one',
};

const todoDummydata2 = {
  title: 'todo two',
};

let todoId1: number;
let todoId2: number;

const beforeAfterQuery = {
  where: {
    title: {
      [Op.in]: [todoDummydata.title, todoDummydata2.title],
    },
  },

  force: true,
};

describe('TodoService', () => {
  before(() => {
    Todo.destroy(beforeAfterQuery);
  });
  after(() => {
    Todo.destroy(beforeAfterQuery);
  });

  describe('TodoService.create', () => {
    it('should create a new Todo', async () => {
      const todo1 = await TodoService.create(todoDummydata);
      const todo2 = await TodoService.create(todoDummydata2);
      todoId1 = todo1.id;
      todoId2 = todo2.id;
      expect(todo1).to.be.an('object');
      expect(todo1.title).to.be.equal('todo one');
      expect(todo2.title).to.be.equal('todo two');
      expect(todo1.status).to.be.equal(TodoStatus.pending);
    });
  });

  describe('TodoService.getTodoById', () => {
    it('should get a todo', async () => {
      const todo = await TodoService.getTodoById(todoId1);
      expect(todo).to.be.an('object');
      expect(todo!.id).to.be.equal(todoId1);
    });

    it('should return null for non-existent todo id', async () => {
      const todo = await TodoService.getTodoById(5);
      expect(todo).to.be.equal(null);
    });
    it('should return null for id 0', async () => {
      const todo = await TodoService.getTodoById(0);
      expect(todo).to.be.equal(null);
    });
  });

  describe('TodoService.getTodos', () => {
    it('should get todos', async () => {
      const todos = await TodoService.getTodos();
      expect(todos.rows).to.be.an('array');
      expect(todos.rows.length).to.equal(1);
      expect(todos.count).to.be.a('number');
    });
  });
  describe('TodoService.updateStatus', () => {
    it('Should reject with NotFoundException if todoId doesnot exists ', async () => {
      await expect(TodoService.updateStatus(60, { status: TodoStatus.completed })).to.be.rejectedWith(
        NotFoundException
      );
    });
    it('should update todo status', async () => {
      const todo = await TodoService.updateStatus(todoId2, {
        status: TodoStatus.completed,
      });
      expect(todo).not.to.equal(null);
      expect(todo.title).to.be.equal('todo two');
      expect(todo.status).to.equal(TodoStatus.completed);
    });
  });
});
