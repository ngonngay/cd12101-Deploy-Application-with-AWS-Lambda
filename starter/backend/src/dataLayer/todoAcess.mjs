
import { AttachmentUtils } from '../utils/attachmentUtils';
import { createLogger } from '../utils/logger';
import * as AWS from 'aws-sdk';

const AWSXRay = require('aws-xray-sdk');
const log = createLogger('TodosAccess');
const XAWS = AWSXRay.captureAWS(AWS);

export class TodosAccess {
  constructor() {
    this.dynamoDB = new XAWS.DynamoDB.DocumentClient();
    this.todoTable = process.env.TODOS_TABLE;
    this.bucketName = process.env.ATTACHMENT_S3_BUCKET;
    this.todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX;
  }

  async create(todoItem) {
    await this.dynamoDB.put({
      TableName: this.todoTable,
      Item: todoItem,
    }).promise();
    log.info(`Todo item ${todoItem.name} added successfully`);
    return todoItem;
  }

  async generateAttachmentUrl(userId, todoId, attachmentId) {
    const attachmentUtils = new AttachmentUtils();
    const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`;

    await this.dynamoDB.update({
      TableName: this.todoTable,
      Key: { todoId, userId },
      UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
      ExpressionAttributeNames: {
        '#attachmentUrl': 'attachmentUrl',
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl,
      },
    }).promise();

    const presignedUrl = await attachmentUtils.createAttachmentPresignedUrl(attachmentId);
    log.info(`Generated presigned URL: ${presignedUrl}`);
    return presignedUrl;
  }

  async getAll(userId) {
    const result = await this.dynamoDB.query({
      TableName: this.todoTable,
      IndexName: this.todosCreatedAtIndex,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }).promise();

    log.info('Todos fetched successfully', result.Items);
    return result.Items;
  }

  async update(userId, todoId, updatedTodo) {
    await this.dynamoDB.update({
      TableName: this.todoTable,
      Key: { todoId, userId },
      UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done',
      },
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done,
      },
    }).promise();

    log.info('Todo item updated successfully', updatedTodo);
  }

  async remove(userId, todoId) {
    await this.dynamoDB.delete({
      TableName: this.todoTable,
      Key: { todoId, userId },
    }).promise();
    log.info('Todo item deleted successfully');
  }
}
