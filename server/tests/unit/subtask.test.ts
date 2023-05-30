import chaiPromiser from 'chai-as-promised';
import SubtaskService from '@app/services/subtask';
import { expect } from 'chai';
import { TodoDto, TodoStatus } from '@app/model/todo/types';
import { BadRequestException, NotFoundException } from '@app/exceptions';
import { createTodo, deleteTodo } from 'tests/utils';
import { SubtaskStatus } from '@app/model/subtask/types';

chai.use(chaiPromiser);

let dummyTodo: TodoDto;

const subtaskDummydata = {
  title: 'subtask title 1',
  todoId: 50,
};

const subtaskDummydata2 = {
  title: 'subtask title 2',
};

const subtaskIds: number[] = [];

describe('SubtaskService', () => {
  before(async () => {
    dummyTodo = await createTodo();
  });

  after(async () => {
    await deleteTodo();
  });

  describe('SubtaskService.create', () => {
    it('should throw BadRequestException if invalid todo id is provided', async () => {
      await expect(SubtaskService.create(subtaskDummydata)).to.be.rejectedWith(BadRequestException);
    });

    it('should create a subtask', async () => {
      const subtask = await SubtaskService.create({
        title: subtaskDummydata2.title,
        todoId: dummyTodo.id,
      });

      expect(subtask).to.be.an('object');
      expect(subtask.id).to.be.a('number');
      expect(subtask.title).to.be.equal('subtask title 2');
      expect(subtask.status).to.be.equal(SubtaskStatus.pending);
      subtaskIds.push(subtask.id);
    });
  });

  describe('SubtaskService.updateStatus', () => {
    it('should be rejected with NotFoundException if invalid subtask id provided', async () => {
      await expect(SubtaskService.updateStatus(225, { status: SubtaskStatus.completed })).to.be.rejectedWith(
        NotFoundException
      );
    });

    it('should update subtask status', async () => {
      const subtask = await SubtaskService.updateStatus(subtaskIds[0], {
        status: SubtaskStatus.completed,
      });
      expect(subtask).not.to.equal(null);
      expect(subtask.title).to.be.equal(subtaskDummydata2.title);
      expect(subtask.status).to.equal(TodoStatus.completed);
    });
  });
});
