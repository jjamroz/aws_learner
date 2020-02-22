const app_user_id = 'user';
let addedSetId;

test('should get sets for user', async done => {
  const lambda = require('../api/sets/getSets');
  const event = {
    body: null,
    headers: {
      app_user_id: app_user_id
    }
  };

  const res = await lambda.handler(event);
  const items = JSON.parse(res.body);

  expect(res.statusCode).toEqual(200);
  // expect(items.length).toEqual(9);
  items.forEach(i => {
    expect(i).toHaveProperty('set_id');
    expect(i).toHaveProperty('user_id');
    expect(i).toHaveProperty('questions');
    expect(i).toHaveProperty('category');
    expect(i).toHaveProperty('name');
  });
  done();
});

test('should get set by UUID', async done => {
  const lambda = require('../api/sets/getSet');

  const event = {
    body: null,
    headers: {
      app_user_id: app_user_id
    },
    pathParameters: {
      set_id: '7694f382-e10f-43c6-93c4-13369b5e3488'
    }
  };

  const res = await lambda.handler(event);
  const set = JSON.parse(res.body);

  expect(res.statusCode).toEqual(200);
  expect(set).toHaveProperty('set_id', '7694f382-e10f-43c6-93c4-13369b5e3488');
  expect(set).toHaveProperty('user_id', app_user_id);
  expect(set).toHaveProperty('questions');
  expect(set).toHaveProperty('category', 'flashcards');
  expect(set).toHaveProperty('name', 'user cards 2213');
  done();
});

test('should not get set by UUID - wrong user', async done => {
  const lambda = require('../api/sets/getSet');

  const event = {
    body: null,
    headers: {
      app_user_id: 'wrong_user'
    },
    pathParameters: {
      set_id: '7694f382-e10f-43c6-93c4-13369b5e3488'
    }
  };

  const res = await lambda.handler(event);
  const error = JSON.parse(res.body);

  expect(res.statusCode).toEqual(404);
  expect(error.message).toBe('Resource not found');
  done();
});

test('should add new set', async done => {
  const lambda = require('../api/sets/addSet');

  const set = {
    name: 'added',
    category: 'flashcards',
    questions: [
      {
        translation: '무당 벌레',
        pronunciation: 'mu-dang boel-le',
        word: 'biedronka'
      }
    ]
  };

  const event = {
    body: JSON.stringify(set),
    headers: {
      app_user_id: app_user_id
    }
  };

  const res = await lambda.handler(event);
  const addedSet = JSON.parse(res.body);
  // to be determined if its the way
  addedSetId = addedSet.set_id;

  expect(res.statusCode).toEqual(200);
  expect(addedSet).toMatchObject(set);
  expect(addedSet).toHaveProperty('set_id');
  expect(addedSet).toHaveProperty('user_id', app_user_id);
  done();
});

test('should update set', async done => {
  const lambda = require('../api/sets/updateSet');
  const getLambda = require('../api/sets/getSets');

  const event = {
    body: null,
    headers: {
      app_user_id: app_user_id
    }
  };

  // getting all sets and getting the one added(alternative is to remember its id from previous test... TBD)
  const { body } = await getLambda.handler(event);
  const sets = JSON.parse(body);
  const set = sets.filter(s => s.name === 'added')[0];
  set.name = 'updated';

  event.body = JSON.stringify(set);

  const res = await lambda.handler(event);
  const updatedSet = JSON.parse(res.body);

  expect(res.statusCode).toEqual(200);
  expect(updatedSet).toMatchObject(set);
  done();
});

test('should delete set', async done => {
  const lambda = require('../api/sets/deleteSet');
  const getLambda = require('../api/sets/getSets');

  const event = {
    body: null,
    headers: {
      app_user_id: app_user_id
    }
  };

  // getting all sets and getting the one added(alternative is to remember its id from previous test... TBD)
  const { body } = await getLambda.handler(event);
  const sets = JSON.parse(body);
  const set_id = sets.filter(s => s.name === 'updated').map(s => s.set_id)[0];

  event.pathParameters = {
    set_id: set_id
  };

  const res = await lambda.handler(event);

  expect(res.statusCode).toEqual(200);
  done();
});
